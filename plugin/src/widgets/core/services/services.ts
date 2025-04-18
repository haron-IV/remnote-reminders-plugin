import { RemindersData } from '@remnote-reminders-plugin/shared'

export const registerReminders = async (data: RemindersData) => {
  console.log('API CALL', data)
  await fetch(`http://localhost:3000/register-reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
