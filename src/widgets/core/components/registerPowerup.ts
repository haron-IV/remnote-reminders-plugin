import { PropertyType, ReactRNPlugin, SelectionType } from '@remnote/plugin-sdk'
import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { PowerupCode, SlotCode } from '../../shared/constants'
import { getDefaultTime } from '../utils/utils'
import { addListenerToPowerupRem } from './addListenerToPowerupRem'
import { getSettings } from '../settings/settings'

const addPowerup = async (
  plugin: ReactRNPlugin,
  rem: RemObject,
  powerup: PowerupCode,
  today?: string
) => {
  await rem.addPowerup(powerup)
  await rem.setPowerupProperty(PowerupCode.RemindMe, SlotCode.Date, today ? [today] : [])
  await rem.setPowerupProperty(PowerupCode.RemindMe, SlotCode.Time, [getDefaultTime()])

  addListenerToPowerupRem(plugin, rem)
}

const powerupCommand = async (plugin: ReactRNPlugin) => {
  const selection = await plugin.editor.getSelection()
  if (!selection?.type) return

  if (selection.type === SelectionType.Rem) {
    const rems = (await plugin.rem.findMany(selection.remIds)) || []
    rems.forEach(async (rem) => await addPowerup(plugin, rem, PowerupCode.RemindMe))
  } else {
    const rem = await plugin.rem.findOne(selection.remId)
    if (!rem) return

    const today = await plugin.date.getTodaysDoc()
    await addPowerup(plugin, rem, PowerupCode.RemindMe, today?.text?.toString())
  }
}

/**
 * @description Register the powerup and add tagging rems with powerup
 */
export const registerPowerup = async (plugin: ReactRNPlugin) => {
  const { chatId } = await getSettings(plugin)

  await plugin.app.registerPowerup({
    name: 'Remind me',
    code: PowerupCode.RemindMe,
    description: 'Add reminder to this rem - you will be notified about it',
    options: {
      slots: [
        { code: SlotCode.Date, name: 'Date', propertyType: PropertyType.DATE },
        { code: SlotCode.Time, name: 'Time', propertyType: PropertyType.TEXT },
      ],
      properties: [
        { code: SlotCode.Date, name: 'Date', propertyType: PropertyType.DATE },
        { code: SlotCode.Time, name: 'Time', propertyType: PropertyType.TEXT },
      ],
    },

  })

  await plugin.app.registerCommand({
    id: `${PowerupCode.RemindMe}-command`,
    name: `Remind me ${chatId ? '' : '<-- it will not work. Please set chatId in settings'}`,
    action: async () => {
      if (!chatId) {
        await plugin.app.toast('Please, set chatId in the plugin settings.')
        return
      }
      await powerupCommand(plugin)
    },
  })
}
