import { AppEvents, declareIndexPlugin, ReactRNPlugin } from '@remnote/plugin-sdk'
import { PowerupCode } from './shared/constants'
import { registerPowerup } from './core/components/registerPowerup'
import { registerSettings } from './core/settings/settings'
import { initRemindersData } from './shared/storage'
import { watchReminders } from './core/components/watchReminders'
import '../style.css' //TODO: to remove
import '../App.css' //TODO: to remove

async function onActivate(plugin: ReactRNPlugin) {
  await registerSettings(plugin)
  await registerPowerup(plugin)
  await initRemindersData(plugin)

  plugin.event.addListener(AppEvents.SettingChanged, 'chatId', async (event) => {
    await registerPowerup(plugin)
    await initRemindersData(plugin)
  })

  const powerup = await plugin.powerup.getPowerupByCode(PowerupCode.RemindMe)
  await watchReminders(plugin, powerup)
}

async function onDeactivate(_: ReactRNPlugin) {
  //TODO: write removing reminders from API
  //TODO: write removing listeners
}

declareIndexPlugin(onActivate, onDeactivate)
