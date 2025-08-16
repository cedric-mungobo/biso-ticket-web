declare module 'gsap' {
  export interface TweenVars {
    duration?: number
    delay?: number
    ease?: string | Function
    y?: number | string
    x?: number | string
    opacity?: number
    scale?: number
    rotation?: number
    [key: string]: any
  }

  export interface TimelineVars {
    delay?: number
    repeat?: number
    yoyo?: boolean
    [key: string]: any
  }

  export function to(target: string | Element | Element[], vars: TweenVars): any
  export function from(target: string | Element | Element[], vars: TweenVars): any
  export function fromTo(target: string | Element | Element[], fromVars: TweenVars, toVars: TweenVars): any
  export function timeline(vars?: TimelineVars): any
  export function registerPlugin(...plugins: any[]): void
}

declare module 'gsap/ScrollTrigger' {
  export interface ScrollTriggerVars {
    trigger?: string | Element
    start?: string
    end?: string
    scrub?: boolean | number
    markers?: boolean
    onEnter?: () => void
    onLeave?: () => void
    onEnterBack?: () => void
    onLeaveBack?: () => void
    [key: string]: any
  }

  export class ScrollTrigger {
    static create(vars: ScrollTriggerVars): ScrollTrigger
    static getAll(): ScrollTrigger[]
    kill(): void
  }
}

declare module 'gsap/ScrollToPlugin' {
  export interface ScrollToVars {
    y?: number | string
    x?: number | string
    duration?: number
    ease?: string | Function
    [key: string]: any
  }

  export function scrollTo(target: string | Element | ScrollToVars, vars?: ScrollToVars): any
}

declare module 'gsap/TextPlugin' {
  export interface TextPluginVars {
    value?: string
    delimiter?: string
    speed?: number
    [key: string]: any
  }
}
