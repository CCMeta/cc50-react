
import { createSignal } from 'react-solid-state'

export function Define(value) {
  const [getValue, setValue] = createSignal(value)
  return { get: getValue, set: setValue }
}