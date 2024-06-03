const enum emailTypeEnum {
  VERIFY = 'verify',
  LOGIN = 'login',
}

type emailType = keyof typeof emailTypeEnum
