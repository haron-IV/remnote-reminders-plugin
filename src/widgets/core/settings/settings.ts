import { ReactRNPlugin } from '@remnote/plugin-sdk'

export const registerSettings = async (plugin: ReactRNPlugin) => {
  //TODO: create beetter descriptions and etc.
  await plugin.settings.registerStringSetting({
    id: 'chatId',
    title: 'Chat ID',
    description: 'Chat ID to send reminders to.',
    defaultValue: '',
    validators: [
      {
        type: 'min',
        arg: 1,
      },
    ],
  })
}

export const getSettings = async (plugin: ReactRNPlugin) => {
  const chatId = await plugin.settings.getSetting<string>('chatId') //telegram chaId

  if (!chatId) plugin.app.toast('Please, set chatId in settings.')

  return { chatId }
}
