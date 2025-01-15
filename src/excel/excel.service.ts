import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { IExcel } from './excel.interface';
import dayjs from 'dayjs';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ExcelService {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    async generateFile(
        payload: IExcel[],
        status: 'Lịch phỏng vấn' | 'Hồ sơ thành công',
    ) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Danh sách ứng viên');
        worksheet.columns = [
            { header: 'Họ và tên', key: 'name', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Link Hồ Sơ', key: 'cvUrl', width: 30 },
            {
                header: 'Số Điện Thoại',
                key: 'phone',
                width: 40,
            },
            {
                header: 'Trường',
                key: 'school',
                width: 30,
            },
            {
                header: 'Học bổng',
                key: 'scholarship',
                width: 30,
            },
            { header: 'Ngày tạo', key: 'createdAt', width: 30 },
            {
                header: 'Thời gian và địa điểm',
                key: 'note',
                width: 40,
            },
        ];

        worksheet.addRows(payload);

        const headerRow = worksheet.getRow(1);
        headerRow.height = 40;
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFA9D08E' },
            };
            cell.font = { bold: true };
        });

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = {
                    wrapText: true,
                    horizontal: 'center',
                    vertical: 'middle',
                };

                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            row.getCell('phone').value = row.getCell('phone').value.toString();
        });

        // save file
        const id = crypto.randomUUID();
        const fileName = `DanhSachUngVien_${status === 'Lịch phỏng vấn' ? 'PhongVan' : 'DaDau'}_${dayjs().format('DDMMYYYY')}_${id}`;

        const buffer = (await workbook.xlsx.writeBuffer()) as Buffer;

        const uploadRes = await this.cloudinaryService.uploadByBuffer(
            {
                buffer,
                originalname: fileName,
            },
            {
                folder: 'Resume',
                public_id: `${fileName}.xlsx`,
                resource_type: 'raw',
            },
        );

        return uploadRes.secure_url;
    }
}
