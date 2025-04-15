import { declareIndexPlugin, ReactRNPlugin } from '@remnote/plugin-sdk'
import { watchReminders } from './utils'
import { PowerupCode } from './constants'
import { registerPowerup } from './registerPowerup'
import '../style.css'
import '../App.css'

async function onActivate(plugin: ReactRNPlugin) {
  await registerPowerup(plugin)

  const powerup = await plugin.powerup.getPowerupByCode(PowerupCode.RemindMe)
  await watchReminders(plugin, powerup)
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate)
