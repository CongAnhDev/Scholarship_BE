import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './schemas/quiz.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema },
  ])],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule { }
