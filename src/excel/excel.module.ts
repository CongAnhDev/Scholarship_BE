import { Module } from '@nestjs/common';
import { ExcelController } from './excel.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ExcelService } from './excel.service';

@Module({
    imports: [CloudinaryModule],
    controllers: [ExcelController],
    providers: [ExcelService],
    exports: [ExcelService],
})
export class ExcelModule { }
