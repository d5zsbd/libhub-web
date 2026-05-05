import request from "../utils/request";

export function access(refreshToken: string): any {
  return request.post('/auth/access', { refreshToken })
}