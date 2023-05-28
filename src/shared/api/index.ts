import axios, { AxiosError } from 'axios'

import { ApiRequestArgs } from 'shared/types/api'

const client = axios.create({
  baseURL: 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org',
  headers: {
    'Content-Type': 'application/json',
  },
})

let controller = new AbortController()

export const request = async ({
  method, url, params, query, withToken = false, withCancelation = false, toLocal = false,
}: ApiRequestArgs) => {
  if (withCancelation) {
    if (controller) {
      controller.abort()
    }

    controller = new AbortController()
  }

  if (toLocal) {
    client.defaults.baseURL = 'http://localhost:8000'
  } else {
    client.defaults.baseURL = 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'
  }

  if (withToken) {
    const token = localStorage.getItem('accessToken')

    if (token) {
      const parsedToken = JSON.parse(token)

      client.defaults.headers.common.Authorization = `Bearer ${parsedToken}`
    }
  }

  let response

  const urlWithQuery = query ? `${url}?${Object.keys(query)
    .map(key => (query[key] ? `${key}=${query[key]}` : ''))
    .filter((v) => v !== '')
    .join('&')}` : url

  const cancellation = withCancelation ? { signal: controller?.signal } : {}

  try {
    switch (method) {
      case 'POST':
        response = await client.post(url, params)
        break
      case 'GET':
        response = await client.get(urlWithQuery, cancellation)
        break
      case 'PUT':
        response = await client.put(url, params)
        break
      case 'PATCH':
        response = await client.patch(url, params)
        break
      case 'DELETE':
        response = await client.delete(url, params)
        break
      default:
        response = await client.post(url, params)
        break
    }

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response
    }

    throw error
  }
}
