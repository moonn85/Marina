import { Module } from '@nestjs/common';
import { CustomItineraryController } from './custom-itinerary.controller';
import { CustomItineraryService } from './custom-itinerary.service';

@Module({
  controllers: [CustomItineraryController],
  providers: [CustomItineraryService],
  exports: [CustomItineraryService],
})
export class CustomItineraryModule {}
