import { Bot } from 'grammy';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TelegramService {
  private logger = new Logger(TelegramService.name);
  private key = this.configService.get<string>('TELEGRAM_KEY');
  private bot: Bot;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    if (this.key) {
      this.bot = new Bot(this.key);
      this.bot.command('start', ctx => ctx.reply('Welcome to Basil!'));
      this.bot.command('pair', async ctx => {
        const userToken = ctx.match;
        const user = await this.usersService.findOne({
          telegramToken: userToken,
        });
        if (user) {
          if (user.telegramId) {
            await ctx.reply(
              `Telegram account already paired to user ${user.email}`,
            );
          } else {
            try {
              await this.usersService.setTelegramId(user.id, ctx.from.id);
              await ctx.reply(`Telegram account paired to user ${user.email}`);
            } catch (e) {
              await ctx.reply(
                `There was an error while pairing your Telegram account`,
              );
            }
          }
        }
      });
      this.bot.start();
      this.logger.log('Telegram Bot listening');
    } else {
      this.logger.warn('Missing Telegram API Key, cannot setup bot');
    }
  }
}
