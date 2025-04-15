import { ReactRNPlugin } from "@remnote/plugin-sdk";

export const registerSettings = async (plugin: ReactRNPlugin) => {
  //TODO: create beetter descriptions and etc.
  await plugin.settings.registerStringSetting({
    id: "chatId",
    title: "Chat ID",
    description: "Chat ID to send reminders to.",
    defaultValue: "",
  });
}