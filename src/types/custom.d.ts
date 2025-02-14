declare module '*.png'
declare module '*.svg'
interface ImportMeta {
  readonly url: string
  readonly scriptElement: HTMLScriptElement
  readonly env: {
    [key: string]: string | boolean | undefined
  }
}
