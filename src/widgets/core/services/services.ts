import { RemindersData } from '../../shared/types'

export const registerReminders = async (data: RemindersData) => {
  await fetch(`http://localhost:3000/register-reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
