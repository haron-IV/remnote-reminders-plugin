export interface Reminder {
  date?: string;
  deeplink: string;
  remId: string;
  text?: string;
  time?: string;
  timestamp: number;
}

export interface RemindersData {
  chatId?: number;
  reminders: Reminder[];
  timestamp?: number;
}
