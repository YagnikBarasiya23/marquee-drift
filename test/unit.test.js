import test from 'node:test';import assert from 'node:assert/strict';import {wrap,ease,MarqueeDrift} from '../src/index.js';
test('wrap handles either direction, multiple loops and zero width',()=>{assert.equal(wrap(125,100),25);assert.equal(wrap(-225,100),75);assert.equal(wrap(7,0),0);});
test('velocity easing is frame-rate independent',()=>{let a=0,b=0;for(let i=0;i<60;i++)a=ease(a,28,1/60);for(let i=0;i<120;i++)b=ease(b,28,1/120);assert.ok(Math.abs(a-b)<1e-10);});
test('reverse eases through zero rather than jumping',()=>{const v=ease(28,-28,1/60);assert.ok(v>0&&v<28);assert.ok(ease(28,-28,1)<0);});
test('invalid mount rejects',()=>assert.throws(()=>new MarqueeDrift(null),TypeError));
