import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomItineraryService } from './custom-itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';

@Controller('custom-itinerary')
export class CustomItineraryController {
  constructor(private readonly customItineraryService: CustomItineraryService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateItinerary(@Body() dto: CreateItineraryDto) {
    return await this.customItineraryService.generateItinerary(dto);
  }
}
