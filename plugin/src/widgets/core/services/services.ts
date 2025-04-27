import type { RemindersData } from '@remnote-reminders-plugin/shared'
import { mapDateTimeToUTC } from '../utils/utils'
import { API_URL, REMINDER_TEXT_CHARACTER_LIMIT } from '../../shared/constants'

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
export const textLimit = (text?: string) =>
  (text || '').length > REMINDER_TEXT_CHARACTER_LIMIT
    ? text?.slice(0, REMINDER_TEXT_CHARACTER_LIMIT).concat('...')
    : text

export const registerReminders = async (data: RemindersData) => {
  const mappedReminders = data.reminders.map(({ date, time, text, ...reminder }) => ({
    ...reminder,
    text: textLimit(text),
    date,
    time,
    timezone,
    sent: false,
    UTCTime: mapDateTimeToUTC(date, time),
  }))

  return await fetch(`${API_URL}/register-reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, reminders: mappedReminders }),
  })
}
