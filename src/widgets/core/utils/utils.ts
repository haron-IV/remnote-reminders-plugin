import { ReactRNPlugin } from '@remnote/plugin-sdk'
import debounce from 'lodash.debounce'
import { SEND_REMINDERS_TO_API_DEBOUNCE_MS } from '../../shared/constants'
import type { Reminder } from '../../shared/types'
import { registerReminders } from '../services/services'
import { storage } from '../../shared/storage'
/**
 * @description Get default time for reminder. It is 15 minutes from now (900000 milliseconds)
 */
// TODO: use data format from KB settings
export const getDefaultTime = () =>
  new Date(Date.now() + 900000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const getDeeplink = async (plugin: ReactRNPlugin, remId: string) => {
  const knowledgeBase = await plugin.kb.getCurrentKnowledgeBaseData()
  if (!knowledgeBase || !remId) return ''

  return `remnote://w/${knowledgeBase._id}/${remId}`
}

export const updateReminder = debounce((remId: string, reminder: Reminder, isDeleted?: boolean) => {
  const toUpdateIndex = storage.remindersData.reminders.findIndex(
    (reminder) => reminder.remId === remId
  )

  if (toUpdateIndex >= 0) {
    if (isDeleted) {
      storage.remindersData.reminders = storage.remindersData.reminders.filter((_, index) => {
        return index !== toUpdateIndex
      })
    } else storage.remindersData.reminders[toUpdateIndex] = reminder

    registerReminders(storage.remindersData)
  }
}, SEND_REMINDERS_TO_API_DEBOUNCE_MS)
