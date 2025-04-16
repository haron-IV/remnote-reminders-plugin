import { PropertyType, ReactRNPlugin, SelectionType } from '@remnote/plugin-sdk'
import { PowerupCode, SlotCode } from './constants'
import { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { addListenerToPowerupRem, getDefaultTime, remindersData } from './utils'

const addPowerup = (plugin: ReactRNPlugin, rem: RemObject, powerup: PowerupCode, today?: string) => {
  rem.addPowerup(powerup)
  rem.setPowerupProperty(PowerupCode.RemindMe, SlotCode.Date, today ? [today] : [])
  rem.setPowerupProperty(PowerupCode.RemindMe, SlotCode.Time, [getDefaultTime()])

  addListenerToPowerupRem(plugin, rem, remindersData)
}

const powerupCommand = async (plugin: ReactRNPlugin) => {
  const selection = await plugin.editor.getSelection()
  if (!selection?.type) return

  if (selection.type === SelectionType.Rem) {
    const rems = (await plugin.rem.findMany(selection.remIds)) || []
    rems.forEach((rem) => addPowerup(plugin, rem, PowerupCode.RemindMe))
  } else {
    const rem = await plugin.rem.findOne(selection.remId)
    if (!rem) return

    const today = await plugin.date.getTodaysDoc()
    addPowerup(plugin, rem, PowerupCode.RemindMe, today?.text?.toString())
  }
}

/**
 * @description Register the powerup and add tagging rems with powerup
 */
export const registerPowerup = async (plugin: ReactRNPlugin) => {
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
    name: 'Remind me',
    action: async () => await powerupCommand(plugin),
  })
}
