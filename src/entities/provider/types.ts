
export interface Provider {
    operator_address: string
    funding_address: string
    seal_address: string
    approval_address: string
    gc_address: string
    total_deposit: string
    status: 'STATUS_IN_SERVICE' | 'STATUS_IN_JAILED' | 'STATUS_GRACEFUL_EXITING' | 'STATUS_OUT_OF_SERVICE'
    endpoint: string
    description: Description
}

export interface Description {
    moniker: string
    identity: string
    website: string
    security_contact: string
    details: string
}

export interface ProviderStoragePrice {
    sp_address: string
    update_time_sec: string
    read_price: string
    free_read_quota: string
    store_price: string
}

export interface ProviderKPISettings {
    storePrice: string | null
    readPrice: string | null
    status: 'STATUS_IN_SERVICE' | 'STATUS_IN_JAILED' | 'STATUS_GRACEFUL_EXITING' | 'STATUS_OUT_OF_SERVICE' | null
}

export type GetProvidersResponse = {
    sps: Provider[]
}

export type GetProviderResponse = {
    storageProvider: Provider
}

export type GetPriceByTimeResponse = {
    sp_storage_price: ProviderStoragePrice
}

