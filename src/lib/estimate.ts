import { HOME_STATE } from './states'

export const minOrderFor = (
  state: string,
  settings: { minOrderHomeState: number; minOrderOtherStates: number },
) => (state === HOME_STATE ? settings.minOrderHomeState : settings.minOrderOtherStates)

export const normalisePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '')
  return /^[6-9]\d{9}$/.test(digits) ? digits : null
}
