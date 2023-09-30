import axios from 'axios'
import { CONFIG } from '~/config'
import type { ISessionModel } from '~/models/sessionModel'
import { CONSOLE } from '~/utilities/log'

export const getHeaders = (session: ISessionModel) => {
  return {
    'x-user-id': session.adminId || ''
  }
}

export const API = {
  post: async (session: any, url: string, body: any, headers?: any) => {
    try {
      const result = await axios.post(url, body, {
        auth: {
          username: CONFIG.authorization.username ?? '',
          password: CONFIG.authorization.passsword ?? ''
        },
        headers: {
          ...getHeaders(session),
          ...headers
        }
      })
      return result.data
    } catch (error: any) {
      CONSOLE.log(error)
      throw {
        code: error.response.status,
        message: error.response
          ? error.response.data.error_message
          : 'Tidak dapat memproses permintaan. Ulangi beberapa saat lagi.'
      }
    }
  },
  patch: async (session: any, url: string, body: any, headers?: any) => {
    try {
      const result = await axios.patch(url, body, {
        auth: {
          username: CONFIG.authorization.username ?? '',
          password: CONFIG.authorization.passsword ?? ''
        },
        headers: {
          ...getHeaders(session),
          ...headers
        }
      })
      return result.data
    } catch (error: any) {
      CONSOLE.log(error)
      throw {
        code: error.response.status,
        message: error.response
          ? error.response.data.error_message
          : 'Tidak dapat memproses permintaan. Ulangi beberapa saat lagi.'
      }
    }
  },
  delete: async (session: any, url: string, headers?: any) => {
    try {
      const result = await axios.delete(url, {
        auth: {
          username: CONFIG.authorization.username ?? '',
          password: CONFIG.authorization.passsword ?? ''
        },
        headers: {
          ...getHeaders(session),
          ...headers
        }
      })
      return result.data
    } catch (error: any) {
      CONSOLE.log(error)
      throw {
        code: error.response.status,
        message: error.response
          ? error.response.data.error_message
          : 'Tidak dapat memproses permintaan. Ulangi beberapa saat lagi.'
      }
    }
  },
  get: async (session: any, url: string, headers?: any) => {
    try {
      const result = await axios.get(url, {
        auth: {
          username: CONFIG.authorization.username ?? '',
          password: CONFIG.authorization.passsword ?? ''
        },
        headers: {
          ...getHeaders(session),
          ...headers
        }
      })
      return result.data.data
    } catch (error: any) {
      CONSOLE.log(error)
      throw {
        code: error.response.status,
        message: error.response
          ? error.response.data.error_message
          : 'Tidak dapat memproses permintaan. Ulangi beberapa saat lagi.'
      }
    }
  },
  getTableData: async ({
    session,
    url,
    pagination,
    page,
    size,
    filters,
    headers
  }: {
    session: any
    url: string
    pagination?: boolean | true
    page?: number | 0
    size?: number | 10
    filters?: any
    headers?: any
  }) => {
    try {
      const queryFilter = new URLSearchParams(filters).toString()
      const result = await axios.get(
        `${url}?pagination=${pagination}&page=${page}&size=${size}&${queryFilter}`,
        {
          headers: {
            ...getHeaders(session),
            ...headers
          },
          auth: {
            username: CONFIG.authorization.username ?? '',
            password: CONFIG.authorization.passsword ?? ''
          }
        }
      )
      return {
        ...result.data.data,
        page: page,
        size: size
      }
    } catch (error: any) {
      CONSOLE.log(error)
      throw {
        code: error.response.status,
        message: error.response
          ? error.response.data.error_message
          : 'Tidak dapat memproses permintaan. Ulangi beberapa saat lagi.'
      }
    }
  }
}
