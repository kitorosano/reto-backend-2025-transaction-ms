import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'transactions' })
export class TransactionMongoDBEntity {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  datetime: Date;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Prop({ required: true })
  userId: string;
}

export type TransactionMongoDBDocument =
  HydratedDocument<TransactionMongoDBEntity>;

export const TransactionSchema = SchemaFactory.createForClass(
  TransactionMongoDBEntity,
).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
