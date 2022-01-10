import { Bot } from 'grammy';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TelegramService {
  private logger = new Logger(TelegramService.name);
  private key = this.configService.get<string>('TELEGRAM_KEY');
  private readonly bot: Bot;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    if (this.key) {
      this.bot = new Bot(this.key);
      this.bot.api.setMyCommands([
        {
          command: 'pair',
          description: 'Pair your Telegram account to your Basil account',
        },
        {
          command: 'unpair',
          description: 'Unpair your Telegram account from your Basil account',
        },
      ]);
      this.bot.command('start', ctx =>
        ctx.reply(
          `👋 *Welcome to Basil!*

To pair your Basil account, send your token to the /pair command. You can find your token in your profile page.

\`/pair <token here>\``,
          {
            parse_mode: 'Markdown',
          },
        ),
      );
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
      this.bot.command('unpair', async ctx => {
        const user = await this.usersService.findOne({
          telegramId: ctx.from.id,
        });
        if (!user) {
          await ctx.reply(
            `Your Telegram account is not paired to any Basil account`,
          );
          return;
        }
        try {
          await this.usersService.setTelegramId(user.id, null);
          await ctx.reply('Basil account disconnected from Telegram');
        } catch (e) {
          await ctx.reply(
            'There was an error while unpairing your Basil account, try again later',
          );
        }
      });
      this.bot.start();
      this.logger.log('Telegram Bot listening');
    } else {
      this.logger.warn('Missing Telegram API Key, cannot setup bot');
    }
  }

  async send(message: string, to: User) {
    if (this.key && this.bot && to.telegramId) {
      return this.bot.api.sendMessage(to.telegramId, message, {
        parse_mode: 'Markdown',
      });
    }
  }
}
