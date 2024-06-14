type StringEnableStatus = `${Api.Common.EnableStatus}`;

export const enableStatusRecord: Record<StringEnableStatus, App.I18n.I18nKey> = {
  '1': 'page.account.common.status.enable',
  '0': 'page.account.common.status.disable'
};

export const enableStatusOptions = [
  {
    value: 1,
    label: 'page.account.common.status.enable'
  },
  {
    value: 0,
    label: 'page.account.common.status.disable'
  }
];
