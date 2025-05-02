import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'transactions' })
export class TransactionMongoDBEntity {
  @Prop({
    required: true,
    type: MongooseSchema.Types.UUID,
    index: true,
    searchIndex: true,
  })
  id: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.UUID,
    index: true,
    searchIndex: true,
  })
  userId: string;

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
}

export type TransactionMongoDBDocument =
  HydratedDocument<TransactionMongoDBEntity>;

export const TransactionSchema = SchemaFactory.createForClass(
  TransactionMongoDBEntity,
);
// .set('toJSON', {
//   transform: (doc, ret) => {
//     ret.id = ret._id.toString();
//     delete ret._id;
//     delete ret.__v;
//     return ret;
//   },
// });
