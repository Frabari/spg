import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  private logger = new Logger(SendgridService.name);
  private key = this.configService.get<string>('SEND_GRID_KEY');

  constructor(private readonly configService: ConfigService) {
    if (!this.key) {
      this.logger.warn('Missing SendGrid API Key, email will not be sent');
      return;
    }
    SendGrid.setApiKey(this.key);
  }

  async send(mail: SendGrid.MailDataRequired) {
    if (!this.key) {
      return;
    }
    const transport = await SendGrid.send(mail);
    this.logger.log(`E-Mail sent to ${mail.to}`);
    return transport;
  }
}
