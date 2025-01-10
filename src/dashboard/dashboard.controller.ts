import { Controller, Get, Query } from '@nestjs/common';
import { SkipCheckPermission } from 'src/decorator/customize';
import { ResumesService } from 'src/resumes/resumes.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly resumeService: ResumesService,
  ) {}

  @SkipCheckPermission()
  @Get()
  async getStatics() {
    // 1. Transactions
    const totalTransactionAsync = this.transactionService.getTotals();
    const thisMonthTransactionAsync = this.transactionService.getTotalByMonth(
      new Date(),
    );
    const lastMonthTransactionAsync = this.transactionService.getTotalByMonth(
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
    );

    // 2. Resumes
    const totalCVAsync = this.resumeService.getTotals();
    const completedCVAsync =
      this.resumeService.getTotalsByStatus('Hồ sơ thành công');
    // pendingCvAsync = totalCVAsync - completedCVAsync

    const [
      totalTransaction,
      thisMonthTransaction,
      lastMonthTransaction,
      totalCV,
      completedCV,
    ] = await Promise.all([
      totalTransactionAsync,
      thisMonthTransactionAsync,
      lastMonthTransactionAsync,
      totalCVAsync,
      completedCVAsync,
    ]);

    const pendingCv = totalCV - completedCV;

    return {
      transactions: {
        total: totalTransaction,
        thisMonth: thisMonthTransaction,
        lastMonth: lastMonthTransaction,
      },
      resumes: {
        total: totalCV,
        completed: completedCV,
        pending: pendingCv,
      },
    };
  }

  @SkipCheckPermission()
  @Get('transactions')
  async getTransactions(@Query('groupBy') groupBy: 'day' | 'month' = 'month') {
    return this.transactionService.getTransactions(groupBy);
  }

  @SkipCheckPermission()
  @Get('resumes')
  async getResumes(@Query('groupBy') groupBy: 'day' | 'month' = 'month') {
    return this.resumeService.getAllGroupBy(groupBy);
  }
}
