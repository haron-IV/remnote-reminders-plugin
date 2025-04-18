import { ReactRNPlugin } from '@remnote/plugin-sdk'
import { getSettings } from '../core/settings/settings'
import { RemindersData } from '@remnote-reminders-plugin/shared'

interface Storage {
  remindersData: RemindersData
  /** It stores temporary data (remIds) that have to be removed from server */
  removedReminders: Set<string>
}

export const storage: Storage = {
  remindersData: {
    chatId: undefined,
    timestamp: undefined,
    reminders: [],
  },
  removedReminders: new Set(),
}

export const initRemindersData = async (plugin: ReactRNPlugin) => {
  const { chatId } = await getSettings(plugin)
  storage.remindersData = {
    chatId: Number(chatId),
    timestamp: new Date().getTime(),
    reminders: [],
  }
}
