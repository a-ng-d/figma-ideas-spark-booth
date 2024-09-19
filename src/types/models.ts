export interface ActionsList {
  [action: string]: () => void
}

export type HexModel = `#${string}` | string
