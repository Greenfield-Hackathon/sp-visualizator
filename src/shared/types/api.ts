export type ApiRequestArgs = {
    method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
    url: string
    params?: {
        [key: string]: unknown
    }
    query?: {
        [key: string]: unknown
    }
    withToken?: boolean
    withCancelation?: boolean
    toLocal?: boolean
}
