import { Module } from '@nestjs/common';
import { MessaggesController } from './messagges.controller';

@Module({
  controllers: [MessaggesController],
})
export class MensaggesModule {}
