// const reminders = await plugin.powerup.getPowerupByCode(PowerupCode.RemindMe)
  // const allReminders = await reminders?.taggedRem()

  // console.log('Reminders', allReminders)

  // await fetch(`http://localhost:3000/register-reminder`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     text: 'Reminder - elo melo',
  //     deeplink: '67fbf740b49e999d43b2ad96/oxmk6yCv7ISyNCezC',
  //     date: new Date().toDateString(),
  //     time: new Date().toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     }),
  //     chatId: 7700263174
  //   })
  // })

  // new Notification('Reminder', {})

  // if (allReminders) {
  // setInterval(() => {
  //   console.log('Checking reminders')

  //   const currentTime = new Date()
  //     .toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     })
  //     .split(':')
  //   const [currentHour, currentMinute] = currentTime

  //   allReminders.forEach(async (reminder) => {
  //     const time = (
  //       await reminder?.getPowerupProperty(PowerupCode.RemindMe, TIME_PROPERTY_CODE)
  //     ).split(':')
  //     const [hour, minute] = time

  //     if (currentHour >= hour && currentMinute >= minute) {
  //       new Notification('Reminder', {
  //         body: reminder.text?.toLocaleString(),
  //       })
  //     }
  //   })
  // }, 1000 * 10)
  // }