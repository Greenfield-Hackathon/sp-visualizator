import { create } from 'zustand'

import { Provider, ProviderStoragePrice, ProviderKPISettings } from '../types'

type State = {
  providers: Provider[]
  currentProvider: Provider | null
  currentProviderPriceByTime: ProviderStoragePrice[]
  currentProviderKPISettings: ProviderKPISettings
}

type Action = {
  setProviders: (providers: Provider[]) => void
  setCurrentProvider: (provider: Provider) => void
  setCurrentProviderPriceByTime: (currentProviderPriceByTime: ProviderStoragePrice) => void
  setCurrentProviderKPISettings: (currentProviderKpiSettings: ProviderKPISettings) => void

}

export const useProviderStore = create<State & Action>((set, get) => ({
  providers: [],
  currentProvider: null,
  currentProviderPriceByTime: [],
  currentProviderKPISettings: {
    storePrice: null,
    readPrice: null,
    status: null,
  },
  setProviders: (providers: Provider[]) => set({ providers }),
  setCurrentProvider: (currentProvider: Provider) => {
    set({ currentProvider, currentProviderPriceByTime: [] })
  },
  setCurrentProviderKPISettings: (
    currentProviderKPISettings: ProviderKPISettings,
  ) => set({ currentProviderKPISettings }),
  setCurrentProviderPriceByTime: (currentProviderPriceByTime: ProviderStoragePrice) => set({
    currentProviderPriceByTime: [...get().currentProviderPriceByTime, currentProviderPriceByTime],
  }),
}))
