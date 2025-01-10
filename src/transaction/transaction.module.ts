import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Provider,
  ProviderSchema,
} from 'src/provider/schemas/providers.schemas';
import {
  Transaction,
  TransactionSchema,
} from 'src/transaction/schema/transaction.schema';
import { TransactionService } from 'src/transaction/transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Provider.name, schema: ProviderSchema },
    ]),
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
