type CurrencyValue = 'USD' | 'UYU' | 'COL';

export class Currency {
  constructor(readonly value: CurrencyValue) {}

  equals(other: Currency): boolean {
    return this.value === other.value;
  }
}
