import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { CheckinDocumentService } from './checkin-document.service';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

@Controller('checkin-document')
export class CheckinDocumentController {
  constructor(
    private readonly checkinDocumentService: CheckinDocumentService,
  ) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      limits: {
        files: 3,
        fileSize: MAX_IMAGE_SIZE,
      },
      fileFilter: (_req, file, callback) => {
        if (/^image\/(jpeg|png)$/.test(file.mimetype)) {
          callback(null, true);
          return;
        }

        callback(
          new BadRequestException(
            'Chỉ hỗ trợ ảnh JPG hoặc PNG / JPG or PNG only',
          ),
          false,
        );
      },
    }),
  )
  async analyze(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('documentType') documentType?: string,
  ) {
    const data = await this.checkinDocumentService.analyzeDocuments(
      files,
      documentType,
    );

    return {
      success: true,
      data,
    };
  }
}
