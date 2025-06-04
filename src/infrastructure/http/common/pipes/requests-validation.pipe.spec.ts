import { TransactionCurrency } from '../../../../shared/dto/transaction.dto';
import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { RequestValidationPipe } from '../../common/pipes/requests-validation.pipe';
import { RegisterTransactionHTTPRequest } from '../../models/register-transaction.http.request';

describe('RequestValidationPipe', () => {
  let pipe: RequestValidationPipe;

  beforeEach(async () => {
    pipe = new RequestValidationPipe();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should create a BadModelException for invalid transaction amount', () => {
    const category = 'Food';
    const amount = NaN; // Invalid amount
    const datetime = '2023-10-01T12:00:00Z';
    const currency = TransactionCurrency.USD;

    expect(
      pipe.transform(
        <RegisterTransactionHTTPRequest>{
          category,
          amount,
          datetime,
          currency,
        },
        {
          type: 'body',
          metatype: RegisterTransactionHTTPRequest,
        },
      ),
    ).rejects.toThrow(BadModelException);
  });
});
