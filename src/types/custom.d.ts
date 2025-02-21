declare module '*.png'
declare module '*.svg'
declare module '*.jpg'
interface ImportMeta {
  readonly url: string
  readonly scriptElement: HTMLScriptElement
  readonly env: {
    [key: string]: string | boolean | undefined
  }
}
