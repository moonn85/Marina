import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CustomItineraryModule } from './custom-itinerary/custom-itinerary.module';
import { CheckinDocumentModule } from './checkin-document/checkin-document.module';
import { CompetitorPricesModule } from './competitor-prices/competitor-prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? ['.env.production', '.env']
          : ['.env.development', '.env'],
    }),
    CustomItineraryModule,
    CheckinDocumentModule,
    CompetitorPricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
