import { Module } from '@nestjs/common';
import { CompetitorPricesController } from './competitor-prices.controller';
import { CompetitorPricesService } from './competitor-prices.service';

@Module({
  controllers: [CompetitorPricesController],
  providers: [CompetitorPricesService],
})
export class CompetitorPricesModule {}
