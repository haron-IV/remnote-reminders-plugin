import {
  AppEvent,
  AppEventListerKey,
  AppNamespace,
  EmbedComponentType,
  EventCallbackFn,
  EventNamespace,
  ReactRNPlugin,
  RNPlugin,
  SettingsNamespace,
  WidgetOptions,
} from '@remnote/plugin-sdk'
import { RemNamespace, RemObject } from '@remnote/plugin-sdk/dist/name_spaces/rem'
import { vi } from 'vitest'

export const pluginMock = {
  initReact: function (plugin: ReactRNPlugin, mountDiv: HTMLElement, rootURL: string): void {
    throw new Error('Function not implemented.')
  },
  onDeactivateReact: function (plugin: ReactRNPlugin): void {
    throw new Error('Function not implemented.')
  },
  onActivate: function (mountDiv: HTMLElement, rootURL: string): Promise<void> {
    throw new Error('Function not implemented.')
  },
  onDeactivate: function (): Promise<void> {
    throw new Error('Function not implemented.')
  },
  kb: {
    getCurrentKnowledgeBaseData: async () => ({
      _id: 'kbId',
      name: 'kbName',
    }),
  },
  event: {
    addListener: vi
      .fn()
      .mockImplementation(
        (eventId: AppEvent, listenerKey: AppEventListerKey, callback: EventCallbackFn) => {}
      ) as EventNamespace['addListener'],
    removeListener: vi.fn() as EventNamespace['removeListener'],
  },
  app: {
    toast: vi.fn() as AppNamespace['toast'],
    registerPowerup: vi.fn() as AppNamespace['registerPowerup'],
    registerCommand: vi.fn() as AppNamespace['registerCommand'],
  },
  model: {},
  listeners: {},
  inSandbox: undefined,
  isNative: undefined,
  rootURL: undefined,
  mountDiv: undefined,
  widgetOptions: undefined,
  manifest: undefined,
  id: undefined,
  rem: {
    findOne: vi.fn() as RemNamespace['findOne'],
  },
  settings: {
    getSetting: vi.fn() as SettingsNamespace['getSetting'],
  },
  setCustomCSS: function ({ cssBlocks, cssUrls }: { cssBlocks: []; cssUrls: [] }): void {
    throw new Error('Function not implemented.')
  },
  track: function (userFunc: (plugin: RNPlugin) => Promise<any>): () => void {
    throw new Error('Function not implemented.')
  },
  receiveActivateMessage: function (args: {
    inSandbox: boolean
    widgetOptions: WidgetOptions
    widgetInstanceId: number
    mountDiv: HTMLElement | undefined
    rootURL: string
    styleSheetHREFs: string[]
  }): Promise<void> {
    throw new Error('Function not implemented.')
  },
  receiveDeactivateMessage: function (_args: {}): Promise<void> {
    throw new Error('Function not implemented.')
  },
  createMountDiv: function (): HTMLDivElement {
    throw new Error('Function not implemented.')
  },
  log: function (...args: any[]): void {
    throw new Error('Function not implemented.')
  },
  _receive: function (event: MessageEvent): Promise<void> {
    throw new Error('Function not implemented.')
  },
  createFakeEmbedComponent: function (args: {
    type: EmbedComponentType
    id: string
    top: number
    left: number
    width?: number | string
    height?: number | string
    maxHeight?: number | string
    maxWidth?: number | string
    externalProps: any
  }): Promise<string> {
    throw new Error('Function not implemented.')
  },
  unmountFakeEmbedComponent: function (id: string): Promise<void> {
    throw new Error('Function not implemented.')
  },
  updateFakeEmbedComponentRect: function (
    id: string,
    args: {
      top?: number
      left?: number
      width?: number | string | null
      height?: number | string | null
      maxWidth?: number | string | null
      maxHeight?: number | string | null
    }
  ): Promise<any> {
    throw new Error('Function not implemented.')
  },
  updateFakeEmbedExternalProps: function (id: string, externalProps: any): Promise<any> {
    throw new Error('Function not implemented.')
  },
  ping: function (): Promise<any> {
    throw new Error('Function not implemented.')
  },
} as ReactRNPlugin

export const remMock = {
  _id: 'remId',
  getPowerupProperty: vi.fn().mockResolvedValue('slotValue') as RemObject['getPowerupProperty'],
  hasPowerup: function (powerupCode: string): Promise<boolean> {
    return Promise.resolve(false)
  },
  text: ['polska gurom'],
} as RemObject
