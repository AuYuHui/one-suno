import { request } from '../request';

/** get account list */
export function fetchGetAccountList(params?: Api.AccountManage.AccountSearchParams) {
  return request<Api.AccountManage.AccountList>({ url: '/admin/suno/list', method: 'get', params });
}

/** create account */
export function fetchCreateAccount(data: Pick<Api.AccountManage.Account, 'cookie' | 'status'>) {
  return request<Api.AccountManage.Account>({ url: '/admin/suno', method: 'post', data });
}

/** update account */
export function fetchUpdateAccount(data: Pick<Api.AccountManage.Account, 'cookie' | 'status'>) {
  return request<Api.AccountManage.Account>({ url: '/admin/suno', method: 'put', data });
}

/** delete account */
export function fetchDeleteAccount(id: number) {
  return request<Api.AccountManage.Account>({ url: `/admin/suno/${id}`, method: 'delete' });
}
