import { ReactRNPlugin } from '@remnote/plugin-sdk'
import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { addListenerToPowerupRem } from './addListenerToPowerupRem'

export const watchReminders = async (plugin: ReactRNPlugin, powerup?: RemObject) => {
  if (!powerup) return

  const reminderRems = await powerup?.taggedRem()
  reminderRems.forEach(async (reminderRem) => {
    await addListenerToPowerupRem(plugin, reminderRem)
  })
}
