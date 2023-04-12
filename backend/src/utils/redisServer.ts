import {createClient, RedisClientType} from 'redis';
import {EmergencyWordsTransit} from '../requests/emergencywords.input';
import {SocketServer} from './socketServer';
import cron from 'node-cron';
import {createTransport, Transporter} from 'nodemailer';

export class RedisServer {
  private static instance: RedisServer;
  private client: RedisClientType;
  private transporter: Transporter;

  private constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT),
      },
    });

    this.transporter = createTransport({
      service: process.env.MAIL_SVC,
      auth: {
        user: process.env.MAIL_ACC,
        pass: process.env.MAIL_PASS,
      },
    });

    this.client.connect().then(() => {
      console.log('redis server connected');
    });
    this.client.on('error', err => console.log('Redis Client Error', err));
  }

  static getInstance(): RedisServer {
    if (!RedisServer.instance) {
      RedisServer.instance = new RedisServer();
    }

    return RedisServer.instance;
  }

  async removeEmergencyWords(val: EmergencyWordsTransit) {
    await this.client.zRem('emergency_words', JSON.stringify(val));
  }

  async setEmergencyWords(
    expire: number,
    val: EmergencyWordsTransit
  ): Promise<void> {
    await this.client.zAdd('emergency_words', [
      {score: Date.now() + expire * 1000 * 60 * 60, value: JSON.stringify(val)},
    ]);
  }

  private async handleEmergencyWords(): Promise<void> {
    const words: string[] = await this.client.zRangeByScore(
      'emergency_words',
      0,
      Date.now()
    );

    if (words) {
      words.forEach(async words => {
        const emergency: EmergencyWordsTransit = JSON.parse(words);
        await this.client.zRem('emergency_words', words);

        if (emergency.email && emergency.email !== '') {
          const mailOption = {
            from: process.env.MAIL_ACC,
            to: emergency.email,
            subject: 'Emergency Words!',
            text: emergency.content,
          };

          await this.transporter.sendMail(mailOption);
        }

        SocketServer.getInstance().sendEmergencyWordsChange();
      });
    }
  }

  startListening() {
    cron.schedule('* * * * * *', () => {
      this.handleEmergencyWords();
    });
  }
}
