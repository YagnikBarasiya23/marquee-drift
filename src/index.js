export const wrap = (position, width) => width > 0 ? ((position % width) + width) % width : 0;
export const ease = (current, target, dt) => current + (target - current) * (1 - Math.exp(-8 * dt));
export const focus = (distance, radius) => { const t = radius > 0 ? Math.max(0, 1 - Math.abs(distance) / radius) : 0; return t * t * (3 - 2 * t); };
const lensDefaults = { scale: 1.35, radius: 0.3, dim: 0.4 };
const instances = new WeakMap();
export class MarqueeDrift {
  constructor(el, options = {}) {
    if (!el || el.nodeType !== 1) throw new TypeError('MarqueeDrift requires an element');
    if (instances.has(el)) throw new Error('Element already has a MarqueeDrift instance');
    this.options = { speed: 28, gap: 48, pauseOnHover: true, direction: 'left', lens: false, ...options };
    const o = this.options;
    if (!Number.isFinite(o.speed) || o.speed < 0 || !Number.isFinite(o.gap) || o.gap < 0 || typeof o.pauseOnHover !== 'boolean' || !['left', 'right'].includes(o.direction)) throw new TypeError('Invalid marquee options');
    if (o.lens === true || (o.lens && typeof o.lens === 'object')) this.lens = { ...lensDefaults, ...(o.lens === true ? {} : o.lens) };
    else if (o.lens !== false) throw new TypeError('Invalid marquee options');
    const l = this.lens;
    if (l && !(Number.isFinite(l.scale) && l.scale >= 1 && Number.isFinite(l.radius) && l.radius > 0 && l.radius <= 1 && Number.isFinite(l.dim) && l.dim >= 0 && l.dim <= 1)) throw new TypeError('Invalid marquee options');
    this.el = el; this.win = el.ownerDocument.defaultView; this.doc = el.ownerDocument;
    this.original = [...el.childNodes]; this.cleanups = []; this.x = 0; this.v = 0;
    this.sign = o.direction === 'left' ? 1 : -1; this.visible = true; this.paused = false;
    this.hadClass = el.classList.contains('md-root');
    this.hadStatic = el.classList.contains('md-static');
    this.hadLens = el.classList.contains('md-lens');
    this.saved = [...el.children].map(child => [child, child.style.transform, child.style.opacity]);
    this.track = this.doc.createElement('div'); this.track.className = 'md-track';
    this.group = this.doc.createElement('div'); this.group.className = 'md-group';
    this.group.append(...this.original); this.track.append(this.group); el.append(this.track);
    this.clone = this.group.cloneNode(true); this.clone.setAttribute('aria-hidden', 'true'); this.clone.inert = true;
    for (const node of this.clone.querySelectorAll('[id]')) node.removeAttribute('id');
    this.track.append(this.clone); this.track.style.setProperty('--md-gap', `${o.gap}px`);
    el.classList.add('md-root'); if (this.lens) el.classList.add('md-lens');
    this.button = this.doc.createElement('button'); this.button.type = 'button'; this.button.className = 'md-pause'; this.button.textContent = 'Pause motion'; this.button.setAttribute('aria-pressed', 'false'); el.append(this.button);
    this.media = this.win.matchMedia('(prefers-reduced-motion: reduce)');
    this.on(this.button, 'click', () => { this.paused = !this.paused; this.button.textContent = this.paused ? 'Resume motion' : 'Pause motion'; this.button.setAttribute('aria-pressed', String(this.paused)); this.sync(); });
    this.on(this.track, 'pointerenter', e => { if (e.pointerType !== 'touch') this.hover = true; });
    this.on(this.track, 'pointerleave', () => { this.hover = false; });
    this.on(this.group, 'focusin', () => { this.focused = true; this.sync(); });
    this.on(this.group, 'focusout', e => { if (!this.group.contains(e.relatedTarget)) { this.focused = false; this.sync(); } });
    this.on(this.media, 'change', () => this.sync());
    this.on(this.doc, 'visibilitychange', () => this.sync());
    this.lastScroll = this.win.scrollY;
    this.on(this.win, 'scroll', () => { const y = this.win.scrollY; const delta = y - this.lastScroll; if (Math.abs(delta) >= 2) { this.sign = delta > 0 ? 1 : -1; this.lastScroll = y; } }, { passive: true });
    this.resize = new this.win.ResizeObserver(() => this.measure()); this.resize.observe(el); this.resize.observe(this.group);
    this.intersection = new this.win.IntersectionObserver(entries => { this.visible = entries[0].isIntersecting; this.sync(); }); this.intersection.observe(el);
    this.tick = time => { this.frame = 0; if (!this.running()) return; const dt = Math.min((time - (this.lastTime ?? time)) / 1000, .05); this.lastTime = time;
      this.v = ease(this.v, this.sign * o.speed * (this.hover && o.pauseOnHover ? .15 : 1), dt);
      this.x = wrap(this.x + this.v * dt, this.width); this.track.style.transform = `translate3d(${-this.x}px,0,0)`; this.focus();
      this.frame = this.win.requestAnimationFrame(this.tick);
    };
    instances.set(el, this); this.measure();
  }
  on(target, event, handler, options) { target.addEventListener(event, handler, options); this.cleanups.push(() => target.removeEventListener(event, handler, options)); }
  measure() {
    if (this.destroyed) return;
    const width = this.group.getBoundingClientRect().width;
    if (this.width) this.x = wrap(this.x / this.width * width, width);
    this.width = width;
    this.short = this.group.children.length < 2 || width - this.options.gap <= this.el.clientWidth;
    if (this.lens) {
      // Cache item centres once per measure so each frame only writes transforms.
      const left = this.group.getBoundingClientRect().left;
      const centres = [...this.group.children].map(child => { const r = child.getBoundingClientRect(); return r.left + r.width / 2 - left; });
      this.lensItems = [...centres.map((c, i) => [this.group.children[i], c]), ...centres.map((c, i) => [this.clone.children[i], c + width])];
      this.track.style.paddingBlock = `${this.group.getBoundingClientRect().height * (this.lens.scale - 1) / 2}px`;
    }
    this.sync();
  }
  focus() {
    if (!this.lens || !this.lensItems || this.el.classList.contains('md-static')) return;
    const { scale, radius, dim } = this.lens, view = this.el.clientWidth, start = this.track.offsetLeft;
    for (const [item, centre] of this.lensItems) {
      const k = focus(start + centre - this.x - view / 2, radius * view);
      item.style.transform = `scale(${(1 + (scale - 1) * k).toFixed(3)})`; item.style.opacity = (dim + (1 - dim) * k).toFixed(3);
    }
  }
  unfocus() { for (const [child, transform, opacity] of this.saved) { child.style.transform = transform; child.style.opacity = opacity; } }
  running() { return !this.destroyed && !this.short && !this.media.matches && !this.focused && !this.paused && this.visible && !this.doc.hidden && this.options.speed > 0; }
  sync() {
    const staticMode = this.short || this.media.matches || this.focused;
    if (!staticMode && this.el.classList.contains('md-static')) this.el.scrollLeft = 0;
    this.el.classList.toggle('md-static', Boolean(staticMode));
    this.button.hidden = this.short || this.media.matches || this.options.speed === 0;
    if (staticMode) { this.track.style.transform = 'none'; this.unfocus(); } else this.focus();
    if (this.running()) { if (!this.frame) { this.lastTime = null; this.frame = this.win.requestAnimationFrame(this.tick); } }
    else { this.win.cancelAnimationFrame(this.frame); this.frame = 0; this.lastTime = null; }
  }
  destroy() {
    if (this.destroyed) return; this.destroyed = true;
    this.win.cancelAnimationFrame(this.frame); this.frame = 0; this.resize.disconnect(); this.intersection.disconnect(); this.cleanups.forEach(fn => fn());
    this.el.replaceChildren(...this.original); if (!this.hadClass) this.el.classList.remove('md-root'); this.el.classList.toggle('md-static', this.hadStatic); this.el.classList.toggle('md-lens', this.hadLens); this.unfocus(); instances.delete(this.el);
  }
}
export default MarqueeDrift;
