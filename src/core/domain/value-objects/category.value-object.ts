type CategoryValue = 'food' | 'transport' | 'entertainment' | 'house' | 'other' | 'uncategorized';

export class Category {
  constructor(readonly value: CategoryValue) {}

  equals(other: Category): boolean {
    return this.value === other.value;
  }
}
