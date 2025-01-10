import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from 'src/transaction/schema/transaction.schema';

@Injectable()
export class TransactionService {
  private logger: Logger = new Logger('TransactionService');
  constructor(
    @InjectModel(Transaction.name)
    private readonly model: mongoose.Model<TransactionDocument>,
  ) {}

  async createTransaction(transaction: Transaction) {
    this.logger.log('Creating new transaction', transaction);
    return this.model.create(transaction);
  }

  async getTotals() {
    return this.model.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
  }

  async getTransactions(groupBy?: 'day' | 'month' | 'year') {
    return this.model.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            ...(groupBy === 'day'
              ? { day: { $dayOfMonth: '$createdAt' } }
              : groupBy === 'month'
                ? { month: { $month: '$createdAt' } }
                : {}),
          },
          total: { $sum: '$amount' },
        },
      },
    ]);
  }

  async getTotalByMonth(time: Date) {
    return this.model.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(time.getFullYear(), time.getMonth(), 1),
            $lt: new Date(time.getFullYear(), time.getMonth() + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          indicate: {
            $first: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
          },
        },
      },
    ]);
  }
}
