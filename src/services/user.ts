import request from "../utils/request";

export async function login(account: string, password: string) {
  return request.post('/user/login', { account, password })
}

export async function signup(username: string, account: string, password: string) {
  return request.post('/user/signup', { username, account, password })
}