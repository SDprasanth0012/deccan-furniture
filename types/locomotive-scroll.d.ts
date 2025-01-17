declare module 'locomotive-scroll' {
    export default class LocomotiveScroll {
      constructor(options: {
        el: HTMLElement;
        direction : string;
        smooth: boolean;

        multiplier?: number;
        getDirection?: boolean;
        smartphone?: { smooth: boolean };
        tablet?: { smooth: boolean };
        lerp: number;
        inertia: number;
      });
  
      on(event: string, callback: (args?: any) => void): void;
      update(): void;
      destroy(): void;
      scrollTo(target: string | HTMLElement | number, options?: { offset?: number; duration?: number }): void;
    }
  }
  