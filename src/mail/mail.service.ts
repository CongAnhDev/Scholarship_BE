import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
    ISendAdmissionLetter,
    ISendInterviewInvitationLetter,
} from './mail.interface';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendInterviewInvitationLetter(payload: ISendInterviewInvitationLetter) {
        const {
            name,
            providerName,
            scholarshipName,
            receiverEmail,
            timeAndAddress,
        } = payload;

        const r = await this.mailerService.sendMail({
            to: receiverEmail,
            subject: `Thư Mời Phỏng Vấn – Học Bổng ${scholarshipName}`,
            template: 'interviewInvitationLetter.hbs',
            context: {
                name,
                providerName,
                scholarshipName,
                timeAndAddress,
            },
        });
        return r;
    }

    async sendAdmissionLetter(payload: ISendAdmissionLetter) {
        const { name, providerName, scholarshipName, receiverEmail, note } =
            payload;

        const r = await this.mailerService.sendMail({
            to: receiverEmail,
            subject: `Chúc mừng! Bạn đã trúng tuyển học bổng ${scholarshipName}`,
            template: 'admissionLetter.hbs',
            context: {
                name,
                providerName,
                scholarshipName,
                note,
            },
        });
        return r;
    }
}
