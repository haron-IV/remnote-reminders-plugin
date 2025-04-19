import { RemindersData } from '@remnote-reminders-plugin/shared'
import { Request, Response } from 'express'

export type RegisterRemindersRequest = Request<object, RemindersData, RemindersData, object>
export type RegisterRemindersResponse = Response<RemindersData, RemindersData>
