import { declareIndexPlugin, ReactRNPlugin } from '@remnote/plugin-sdk'
import { watchReminders } from './utils'
import { PowerupCode } from './constants'
import { registerPowerup } from './registerPowerup'
import { registerSettings } from './settings'
import '../style.css' //TODO: to remove
import '../App.css' //TODO: to remove

async function onActivate(plugin: ReactRNPlugin) {
  await registerSettings(plugin)
  await registerPowerup(plugin)

  const powerup = await plugin.powerup.getPowerupByCode(PowerupCode.RemindMe)
  await watchReminders(plugin, powerup)
}

async function onDeactivate(_: ReactRNPlugin) {
  //TODO: write removing reminders from API
  //TODO: write removing listeners
}

declareIndexPlugin(onActivate, onDeactivate)
