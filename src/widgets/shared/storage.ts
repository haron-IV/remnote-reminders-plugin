import { ReactRNPlugin } from '@remnote/plugin-sdk'
import { getSettings } from '../core/settings/settings'
import type { RemindersData } from './types'

interface Storage {
  remindersData: RemindersData
}

export const storage: Storage = {
  remindersData: {
    chatId: undefined,
    timestamp: undefined,
    reminders: [],
  },
}

export const initRemindersData = async (plugin: ReactRNPlugin) => {
  const { chatId } = await getSettings(plugin)
  storage.remindersData = {
    chatId: Number(chatId),
    timestamp: new Date().getTime(),
    reminders: [],
  }
}
