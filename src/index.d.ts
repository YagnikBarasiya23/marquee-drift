export interface MarqueeDriftLensOptions { scale?: number; radius?: number; dim?: number; }
export interface MarqueeDriftOptions { speed?: number; gap?: number; pauseOnHover?: boolean; direction?: 'left' | 'right'; lens?: boolean | MarqueeDriftLensOptions; }
export declare class MarqueeDrift { constructor(element: HTMLElement, options?: MarqueeDriftOptions); destroy(): void; }
export default MarqueeDrift;
