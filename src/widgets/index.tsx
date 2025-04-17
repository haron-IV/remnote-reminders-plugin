import { AppEvents, declareIndexPlugin, ReactRNPlugin } from '@remnote/plugin-sdk'
import type { RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { PowerupCode } from './shared/constants'
import { registerPowerup } from './core/components/registerPowerup'
import { registerSettings } from './core/settings/settings'
import { initRemindersData } from './shared/storage'
import { watchRemRemindersOnLoad } from './core/components/watchRemRemindersOnLoad'
import { cleanRemovedReminders } from './core/components/cleanRemovedReminders'
import '../style.css' //TODO: to remove
import '../App.css' //TODO: to remove


const watchEditorSelection = async (plugin: ReactRNPlugin, powerup?: RemObject) => {
  plugin.event.addListener(AppEvents.EditorSelectionChanged, undefined, async () =>
    await cleanRemovedReminders(powerup)
  )
}

async function onActivate(plugin: ReactRNPlugin) {
  await registerSettings(plugin)
  await registerPowerup(plugin)
  await initRemindersData(plugin)

  plugin.event.addListener(AppEvents.SettingChanged, 'chatId', async (event) => {
    await registerPowerup(plugin)
    await initRemindersData(plugin)
  })

  const powerup = await plugin.powerup.getPowerupByCode(PowerupCode.RemindMe)
  await watchRemRemindersOnLoad(plugin, powerup)
  await watchEditorSelection(plugin, powerup)
}

async function onDeactivate(_: ReactRNPlugin) {
  //TODO: write removing reminders from API
  //TODO: write removing listeners
}

declareIndexPlugin(onActivate, onDeactivate)
