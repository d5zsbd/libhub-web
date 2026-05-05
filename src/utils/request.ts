import axios from 'axios'
import { API_URL } from './shared'
import { useAuthStore } from '../stores/auth'

const request = axios.create({
  baseURL: API_URL, // import.meta.env.VITE_API_BASE_URL
  timeout: 10000
})

request.interceptors.response.use(
  response => response.data,
  error => {
    console.error('请求错误: ', error)
    console.log(error.response);
    return Promise.reject(error)
  }
)

export const reqToken = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

let isRefreshing = false
let waitingQueue: Array<{
  resolve: (value: string) => void,
  reject: (reason?: any) => void
}> = []
const processQueue = (error: any = null, token: string | null = null) => {
  for (const prom of waitingQueue) {
    if (error) {
      prom.reject(error)
    } else if (token) {
      prom.resolve(token)
    }
  }

  waitingQueue = []
}

reqToken.interceptors.request.use(
  async config => {
    const authStore = useAuthStore()

    // 应该增加一个检查api是否需要token的功能

    // 可用直接通过
    if (authStore.isAccessTokenValid()) {
      config.headers.Authorization = `bearer ${authStore.accessToken}`
      return config
    }

    // 加载中的请求加入等待队列
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitingQueue.push({
          resolve: (token: string) => {
            config.headers.Authorization = `bearer ${token}`
            resolve(config)
          },
          reject
        })
      })
    }

    // 堵塞后方的请求
    isRefreshing = true
    try {
      await authStore.rotateToken()

      config.headers.Authorization = `bearer ${authStore.accessToken}`

      processQueue(null, authStore.accessToken)
      
      return config
    } catch (error) {
      processQueue(error, null)

      authStore.clearAccessToken()
      authStore.clearRefreshToken()
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
  Promise.reject
)

// 等后端权限错误类型确定了之后，可以实现只在令牌失效了主动刷新
reqToken.interceptors.response.use(
  response => response.data,
  error => {
    console.error('请求错误: ', error)
    console.log(error.response);
    return Promise.reject(error)
  }
)

export function req() {
  const authStore = useAuthStore();

  if (authStore.payload) {
    return reqToken;
  } else {
    return request;
  }
}

export default request