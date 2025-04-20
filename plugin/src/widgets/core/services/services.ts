import { RemindersData } from '@remnote-reminders-plugin/shared'
import { mapDateTimeToUTC } from '../utils/utils'

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export const registerReminders = async (data: RemindersData) => {
  const mappedReminders = data.reminders.map(({ date, time, ...reminder }) => ({
    ...reminder,
    date,
    time,
    timezone,
    sent: false,
    UTCTime: mapDateTimeToUTC(date, time),
  }))

  await fetch(`http://localhost:3000/register-reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, reminders: mappedReminders }),
  })
}
