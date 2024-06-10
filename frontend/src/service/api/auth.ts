import { request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  return request<Api.Auth.LoginToken>({
    url: '/admin/user/login',
    method: 'post',
    data: {
      userName,
      password
    }
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/admin/user/userInfo' });
}

/** Update user info */
export function fetchUpdateUserInfo(password: string) {
  return request<Api.Auth.UserInfo>({
    url: '/admin/user/userInfo',
    method: 'put',
    data: {
      password
    }
  });
}
