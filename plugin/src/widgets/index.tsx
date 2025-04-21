import { AppEvents, declareIndexPlugin, ReactRNPlugin } from '@remnote/plugin-sdk'
import { PowerupCode } from './shared/constants'
import { registerPowerup } from './core/components/registerPowerup'
import { registerSettings } from './core/settings/settings'
import { initRemindersData } from './shared/storage'
import { watchRemRemindersOnLoad } from './core/components/watchRemRemindersOnLoad'
import '../style.css' //TODO: to remove if not used
import '../App.css' //TODO: to remove if not used

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
}

async function onDeactivate(_: ReactRNPlugin) {
  //TODO: write removing reminders from API
  //TODO: write removing listeners
}

declareIndexPlugin(onActivate, onDeactivate)
