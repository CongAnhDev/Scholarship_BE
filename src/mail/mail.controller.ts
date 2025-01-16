import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schemas/subscriber.schemas';
import { Scholarship, ScholarshipDocument } from 'src/scholarship/schemas/scholarship.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
    @InjectModel(Scholarship.name)
    private readonly scholarshipModel: SoftDeleteModel<ScholarshipDocument>,
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: SoftDeleteModel<SubscriberDocument>
  ) { }

  @Get()
  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  @Public()
  @ResponseMessage("Send email to subscriber")
  async handleTestEmail() {
    try {
      const subscribers = await this.subscriberModel.find({});

      for (const subs of subscribers) {
        const subsMajor = subs.major;
        const subsLevel = subs.level;
        const subsIelts = subs.ielts;
        const subsGPA = subs.GPA;
        const subsPay = subs.pay;
        const subsValue = subs.value;
        const subsLocation = subs.location;

        const query: any = {};
        if (subsMajor?.length) {
          query.major = { $in: subsMajor.map(major => new RegExp(`^${major}$`, 'i')) };
        }
        if (subsLevel?.length) {
          query.level = { $in: subsLevel.map(level => new RegExp(`^${level}$`, 'i')) };
        }
        if (subsLocation) {
          query.location = new RegExp(`^${subsLocation}$`, 'i');
        }
        if (subsIelts !== undefined) {
          query.ielts = { $lte: subsIelts };
        }
        if (subsGPA !== undefined) {
          query.GPA = { $lte: subsGPA };
        }
        if (subsPay !== undefined) {
          query.pay = { $lte: subsPay };
        }
        if (subsValue !== undefined) {
          query.value = { $lte: subsValue };
        }

        const Matching = await this.scholarshipModel.find(query);

        if (Matching?.length) {
          const scholarship = Matching.map(item => ({
            id: item._id,
            name: item.name,
            level: item.level,
            major: item.major,
            ielts: item.ielts,
            GPA: item.GPA,
            pay: item.pay,
            value: item.value,
            location: item.location
          }));

          await this.mailerService.sendMail({
            to: subs.email,
            from: '"Support Team" <support@example.com>',
            subject: 'Welcome to Nice App! Confirm your Email',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Hỏi Dân IT vs Eric</title>
                    <meta charset="UTF-8">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
                    <table style="max-width: 80rem; min-height: 100vh; padding: 2rem; margin: 0 auto; background-color: #f5f5f5;">
                        <tr>
                            <td align="center">
                                <table style="background-color: white; border-radius: 5px; padding: 20px;">
                                    <tr>
                                        <td>
                                            <div style="text-align: left; font-size: 20px;">SFMS</div>
                                        </td>
                                        <td>
                                            <div style="text-align: right; font-size: 20px;">Thông Tin Học Bổng</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="margin: 15px 0; border-top: 1px solid rgba(5, 5, 5, 0.06);"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <div style="text-align: left;">
                                                <div style="font-size: 16px;">Hi ${subs.name},</div>
                                                <div style="font-size: 16px;">Tìm Hiểu Học Bổng Hôm Nay nào!</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="margin: 15px 0; border-top: 1px dashed rgba(5, 5, 5, 0.06);"></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <table>
                                                ${scholarship.map(item => `
                                                <tr>
                                                    <td>
                                                        <div style="font-size: 16px;">
                                                            <a href="https://sfms.pages.dev/hoc-bong/${item.id}" target="_blank" style="text-decoration: none;"> ${item.name}</a>
                                                        </div>
                                                        <div style="font-size: 14px;">${item.location}</div>
                                                        <div style="font-size: 14px;">${item.value}</div>
                                                        <div>
                                                            <span style="font-size: 14px;">Ngành Học: ${item.major.join(' - ')}</span>
                                                        </div>
                                                        <div>
                                                            <span style="font-size: 14px;">Cấp Bậc: ${item.level.join(' - ')}</span>
                                                        </div>
                                                        <div style="font-size: 14px; background-color: #e0f7fa; padding: 10px; border-radius: 5px;">
                                                            <div style="font-weight: bold;">Yêu cầu học bổng</div>
                                                            <div>Ielts: ${item.ielts}</div>
                                                            <div>GPA: ${item.GPA}</div>
                                                            <div>Chi phí sinh hoạt mỗi tháng: ${item.pay}$</div>
                                                        </div>
                                                        <div style="margin: 15px 0; border-top: 1px dashed rgba(5, 5, 5, 0.06);"></div>
                                                    </td>
                                                </tr>`).join('')}
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="text-align: center;">
                                            <a href="https://sfms.pages.dev/" target="_blank" style="display: inline-block; width: 100%; height: 40px; line-height: 40px; cursor: pointer; border-radius: 5px; background-color: #ea1e30; color: white; border: none; outline: none; text-decoration: none; font-size: 16px;">
                                                Xem thêm học bổng tại SFMS
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <div style="padding-top: 20px; text-align: left; font-size: 16px;">Cheers,</div>
                                            <div style="text-align: left; font-size: 16px;">SFMS.</div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
          });
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}


