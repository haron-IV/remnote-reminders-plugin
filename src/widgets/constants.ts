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