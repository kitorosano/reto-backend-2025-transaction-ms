export enum ExceptionTypeKeys {
  BAD_MODEL = 'BadModelException',
  INVALID_PERMISSIONS = 'InvalidPermissionsException',
  NOT_FOUND = 'NotFoundException',
  UNEXPECTED = 'UnexpectedException',
}

export enum ErrorCodesKeys {
  UNIMPLEMENTED = 'TST000',

  // ...
  REPOSITORY_UNEXPECTED = 'TST010',

  ID_FORMAT_NOT_VALID = 'TST021',
  DESCRIPTION_TOO_LARGE = 'TST022',
  USER_ID_FORMAT_NOT_VALID = 'TST023',
  REQUEST_NOT_VALID = 'TST024',

  TRANSACTION_NOT_FOUND = 'TST030',
}