import { Module } from '@nestjs/common';
import { ResumesModule } from 'src/resumes/resumes.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { DashboardController } from './dashboard.controller';

@Module({
  controllers: [DashboardController],
  imports: [TransactionModule, ResumesModule],
})
export class DashboardModule {}
