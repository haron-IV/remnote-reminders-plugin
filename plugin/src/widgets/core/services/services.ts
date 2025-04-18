import { RemindersData } from '../../shared/types'

export const registerReminders = async (data: RemindersData) => {
  console.log("API CALL", data)
  await fetch(`http://localhost:3000/register-reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
