import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Resume } from 'src/resumes/schemas/resume.schemas';
export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Resume.name })
  resume: Types.ObjectId;

  @Prop()
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  transactionDateTime: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updateAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
