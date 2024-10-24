import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { ConfigModule } from '@nestjs/config';
import { SendgridClientService } from './services/send-grid.service';

@Module({
  providers: [EmailService, SendgridClientService],
  imports: [ConfigModule],
  exports: [EmailService, SendgridClientService],
})
export class EmailModule {}
