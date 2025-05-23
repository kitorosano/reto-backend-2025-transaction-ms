import { ErrorCodesKeys, ExceptionTypeKeys } from '../error-code-keys.enum';

const UNIMPLEMENTED_MESSAGE = 'Error no conocido';
const UNIMPLEMENTED_DETAIL =
  'Error no implementado en el diccionario de errores';

export const EsDictionary = {
  [ExceptionTypeKeys.UNEXPECTED]: {
    [ErrorCodesKeys.UNIMPLEMENTED]: {
      message: UNIMPLEMENTED_MESSAGE,
      detail: UNIMPLEMENTED_DETAIL,
    },
    [ErrorCodesKeys.REPOSITORY_UNEXPECTED]: {
      message: 'Error inesperado en el acceso a datos',
      detail: 'Ocurrió un error inesperado en el repositorio',
    },
  },
  [ExceptionTypeKeys.BAD_MODEL]: {
    [ErrorCodesKeys.ID_FORMAT_NOT_VALID]: {
      message: 'El formato del ID no es válido',
      detail: 'El ID debe ser un UUID válido',
    },
    [ErrorCodesKeys.DESCRIPTION_TOO_LARGE]: {
      message: 'Descripción demasiado larga',
      detail: 'La descripción no puede exceder los 50 caracteres',
    },
    [ErrorCodesKeys.USER_ID_FORMAT_NOT_VALID]: {
      message: 'El formato del ID del usuario no es válido',
      detail: 'El ID de usuario debe ser un UUID válido',
    },
    [ErrorCodesKeys.REQUEST_NOT_VALID]: {
      message: 'Solicitud no válida',
      detail: 'La solicitud no cumple con los requisitos necesarios',
    },
    [ErrorCodesKeys.AMOUNT_EXCEEDS_BUDGET]: {
      message: 'El monto excede el presupuesto',
      detail:
        'El monto de la transacción excede el presupuesto asignado para la categoría',
    },
    [ErrorCodesKeys.AUTH_HEADER_NOT_PROVIDED]: {
      message: 'Encabezado de autorización no proporcionado',
      detail:
        'El encabezado de autorización no fue proporcionado en la solicitud',
    },
  },
  [ExceptionTypeKeys.NOT_FOUND]: {
    [ErrorCodesKeys.TRANSACTION_NOT_FOUND]: {
      message: 'Transacción no encontrada',
      detail: 'No se encontró la transacción con el ID proporcionado',
    },
    [ErrorCodesKeys.BUDGET_NOT_FOUND]: {
      message: 'Presupuesto no encontrado',
      detail: 'No se encontró el presupuesto con el ID proporcionado',
    },
  },
  [ExceptionTypeKeys.INVALID_PERMISSIONS]: {
    [ErrorCodesKeys.TOKEN_NOT_VALID]: {
      message: 'Autenticación no válida',
      detail: 'El token de acceso proporcionado no es válido o ha expirado',
    },
    [ErrorCodesKeys.USER_NOT_AUTHENTICATED]: {
      message: 'Usuario no autenticado',
      detail: 'El usuario no está autenticado',
    },
  },
};
