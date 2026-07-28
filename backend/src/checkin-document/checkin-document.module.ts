import { Module } from '@nestjs/common';
import { CheckinDocumentController } from './checkin-document.controller';
import { CheckinDocumentService } from './checkin-document.service';

@Module({
  controllers: [CheckinDocumentController],
  providers: [CheckinDocumentService],
})
export class CheckinDocumentModule {}
