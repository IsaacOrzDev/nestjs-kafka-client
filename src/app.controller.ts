import {
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly appService: AppService,
    @Inject('MEDIUM_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['medium.rocks'].forEach((key) =>
      this.client.subscribeToResponseOf(`${key}`),
    );
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Get()
  testKafka() {
    return this.client.emit('medium.rocks', { foo: 'bar' });
  }

  @Get('response')
  testKafkaWithResponse() {
    return this.client.send('medium.rocks', {
      foo: 'bar',
      data: new Date().toString(),
    });
  }
}
