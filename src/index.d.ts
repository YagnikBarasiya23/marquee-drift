export interface MarqueeDriftOptions { speed?: number; gap?: number; pauseOnHover?: boolean; direction?: 'left' | 'right'; }
export declare class MarqueeDrift { constructor(element: HTMLElement, options?: MarqueeDriftOptions); destroy(): void; }
export default MarqueeDrift;
