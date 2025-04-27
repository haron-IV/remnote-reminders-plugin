/**
 * Remember to update the code manifest.json - it's used for granting permissions
 */
export enum PowerupCode {
  RemindMe = 'remindMe',
}

export enum SlotCode {
  Date = 'date',
  Time = 'time',
}

export const SEND_REMINDERS_TO_API_DEBOUNCE_MS = 2000
export const DATE_FORMAT = 'dd/MM/yyyy'
export const REMINDER_TEXT_CHARACTER_LIMIT = 390

const DEV_API_URL = 'http://localhost:3000'
const PROD_API_URL = 'http://188.68.232.55:3000'
export const API_URL = PROD_API_URL // Just change this value if you wan to test it differently
