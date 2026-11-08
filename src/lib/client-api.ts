import { useAuthStore } from '@/stores/authStore'

export async function assetRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const send = () => fetch(path, {
    ...options,
    signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    headers: { 'Content-Type': 'application/json', ...options.headers,
      Authorization: `Bearer ${useAuthStore.getState().tokens?.accessToken || ''}` },
  }).catch(error => {
    if (error instanceof TypeError) throw new Error('网络连接失败，请检查网络后重试')
    if (error instanceof DOMException && error.name === 'TimeoutError') throw new Error('请求超时，请稍后重试')
    throw error
  })
  let response = await send()
  if (response.status === 401) {
    await useAuthStore.getState().refreshToken()
    if (useAuthStore.getState().tokens) response = await send()
  }
  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout()
      throw new Error('登录已过期，请重新登录')
    }
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || '操作未完成，请稍后重试')
  }
  return response.json()
}
