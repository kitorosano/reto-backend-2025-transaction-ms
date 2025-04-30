import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BusinessRuleViolationException } from '../../../common/exceptions/application.exceptions';
import { InvalidModelPropertyValueException } from '../../../common/exceptions/domain.exceptions';

@Catch(InvalidModelPropertyValueException)
export class BusinessRuleViolationExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidModelPropertyValueException, host: ArgumentsHost) {
    const args = host.getArgs(),
      type = host.getType(),
      arg = host.getArgByIndex(0);

    console.log({ type, args, arg });


    throw new BusinessRuleViolationException(exception.message);
  }
}
