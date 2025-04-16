import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { AppEvents, ReactRNPlugin } from '@remnote/plugin-sdk'
import { PowerupCode, SEND_REMINDERS_TO_API_DEBOUNCE_MS, SlotCode } from './constants'
import debounce from 'lodash.debounce'
import { RemindersData, Reminder } from './types'
import { registerReminders } from './services'
/**
 * @description Get default time for reminder. It is 15 minutes from now (900000 milliseconds)
 * TODO: use data format from KB settings
 */
export const getDefaultTime = () =>
  new Date(Date.now() + 900000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const getDeeplink = async (plugin: ReactRNPlugin, remId: string) => {
  const knowledgeBase = await plugin.kb.getCurrentKnowledgeBaseData()
  if (!knowledgeBase || !remId) return ''

  return `remnote://w/${knowledgeBase._id}/${remId}`
}

export const addListenerToPowerupRem = async (
  plugin: ReactRNPlugin,
  reminderRem: RemObject,
  remindersData: RemindersData
) => {
  const data: Reminder = {
    date: await reminderRem?.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Date),
    time: await reminderRem?.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Time),
    text: reminderRem.text?.toLocaleString(),
    remId: reminderRem._id,
    deeplink: await getDeeplink(plugin, reminderRem._id),
    timestamp: new Date().getTime(),
  }

  remindersData.reminders.push(data) // initialize data
  console.log('Registering reminder', remindersData)

  plugin.event.addListener(AppEvents.RemChanged, reminderRem._id, async (event) => {
    data.date = await reminderRem.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Date)
    data.time = await reminderRem.getPowerupProperty(PowerupCode.RemindMe, SlotCode.Time)
    data.text = reminderRem.text?.toLocaleString()

    data.timestamp = new Date().getTime()
    updateReminder(reminderRem._id, data, remindersData)
  })
}

const updateReminder = debounce(
  (remId: string, reminder: Reminder, remindersData: RemindersData) => {
    const toUpdate = remindersData.reminders.findIndex((reminder) => reminder.remId === remId)
    if (toUpdate >= 0) remindersData.reminders[toUpdate] = reminder
    registerReminders(remindersData)
  },
  SEND_REMINDERS_TO_API_DEBOUNCE_MS
)

//TODO: refactorize this
export let remindersData: RemindersData
const initRemindersData = (chatId: string): void => {
  remindersData = {
    chatId: Number(chatId),
    timestamp: new Date().getTime(),
    reminders: [],
  }
}

//TODO: refactorize this
export const watchReminders = async (plugin: ReactRNPlugin, powerup?: RemObject) => {
  const chatId = await plugin.settings.getSetting<string>('chatId') //telegram chaId
  if (!powerup || !chatId) return

  initRemindersData(chatId)

  // TODO: no listeners for new items
  const reminderRems = await powerup?.taggedRem()
  reminderRems.forEach(async (reminderRem) => {
    await addListenerToPowerupRem(plugin, reminderRem, remindersData)
  })
}
