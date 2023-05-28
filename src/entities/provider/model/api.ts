import { request } from 'shared/api'

import {
  GetProvidersResponse, GetProviderResponse, GetPriceByTimeResponse, ProviderKPISettings,
} from '../types'

export const getProviders = (): Promise<GetProvidersResponse> => request({
  method: 'GET',
  url: '/greenfield/storage_providers',
})

export const getProvider = (spAddress: string): Promise<GetProviderResponse> => request({
  method: 'GET',
  url: `/greenfield/storage_provider/${spAddress}`,
})

export const getPriceByTime = (spAddress: string, timestamp: number): Promise<GetPriceByTimeResponse> => request({
  method: 'GET',
  url: `/greenfield/sp/get_sp_storage_price_by_time/${spAddress}/${timestamp}`,
})

export const updateProviderKPISettings = (
  spAddress: string,
  kpiSettings: ProviderKPISettings,
  webhookUrl: string,
) => request({
  method: 'POST',
  toLocal: true,
  url: '/api/kpi/set',
  params: {
    spAddress,
    storePriceLimit: `${kpiSettings.storePrice}`,
    webHook: webhookUrl,
  },
})
