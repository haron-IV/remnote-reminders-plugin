import {
  declareIndexPlugin,
  ReactRNPlugin,
  WidgetLocation,
  SelectionType,
  PropertyType,
  AppEvents,
  useTrackerPlugin,
  useSyncedStorageState,
} from '@remnote/plugin-sdk'
import '../style.css'
import '../App.css'
import { text } from 'stream/consumers'


const REMIND_ME_POWERUP_CODE = 'remindMe'
const DATE_PROPERTY_CODE = 'date'
const TIME_PROPERTY_CODE = 'time'

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.app.registerPowerup({
    name: 'Remind me', // human-readable name
    code: REMIND_ME_POWERUP_CODE, // powerup code used to uniquely identify the powerup
    description: 'Add reminder to this rem', // description
    options: {
      slots: [
        { code: DATE_PROPERTY_CODE, name: 'Date', propertyType: PropertyType.DATE },
        { code: TIME_PROPERTY_CODE, name: 'Time', propertyType: PropertyType.TEXT },
      ],
      properties: [
        {
          code: DATE_PROPERTY_CODE,
          name: 'Date',
          propertyType: PropertyType.DATE,
        },
        {
          code: TIME_PROPERTY_CODE,
          name: 'Time',
          propertyType: PropertyType.TEXT,
        },
      ],
    },
  })

  // const [time, setTime] = useSyncedStorageState('time', '')

  let time: string | undefined

  const runAddPowerupCommand = async (powerup: string) => {
    const selection = await plugin.editor.getSelection()
    if (!selection?.type) return

    if (selection.type === SelectionType.Rem) {
      const rems = (await plugin.rem.findMany(selection.remIds)) || []
      rems.forEach((r) => r.addPowerup(powerup))
    } else {
      const rem = await plugin.rem.findOne(selection.remId)
      rem?.addPowerup(powerup)
      rem?.setPowerupProperty(REMIND_ME_POWERUP_CODE, DATE_PROPERTY_CODE, [
        new Date().toDateString(),
      ])
      rem?.setPowerupProperty(REMIND_ME_POWERUP_CODE, TIME_PROPERTY_CODE, [
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      ])
      plugin.event.addListener(AppEvents.RemChanged, rem?._id, async (event) => {
        // time = await rem?.getPowerupProperty(REMIND_ME_POWERUP_CODE, TIME_PROPERTY_CODE)
      })
    }
  }

  await plugin.app.registerCommand({
    id: `${REMIND_ME_POWERUP_CODE}Cmd`,
    name: 'Remind me',
    action: async () => {
      await runAddPowerupCommand(REMIND_ME_POWERUP_CODE)
    },
  })

  const reminders = await plugin.powerup.getPowerupByCode(REMIND_ME_POWERUP_CODE)
  const allReminders = await reminders?.taggedRem()

  console.log('Reminders', allReminders)

  // await fetch(`http://localhost:3000/register-reminder`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     text: 'Reminder',
  //     date: new Date().toDateString(),
  //     time: new Date().toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     }),
  //     chatId: 7700263174
  //   })
  // })


  new Notification('Reminder', {})

  if (allReminders) {
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
    //       await reminder?.getPowerupProperty(REMIND_ME_POWERUP_CODE, TIME_PROPERTY_CODE)
    //     ).split(':')
    //     const [hour, minute] = time

    //     if (currentHour >= hour && currentMinute >= minute) {
    //       new Notification('Reminder', {
    //         body: reminder.text?.toLocaleString(),
    //       })
    //     }
    //   })
    // }, 1000 * 10)
  }
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate)
