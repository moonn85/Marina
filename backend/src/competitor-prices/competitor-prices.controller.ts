import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CompetitorPricesService } from './competitor-prices.service';
import { SearchCompetitorPricesDto } from './dto/search-competitor-prices.dto';

@Controller('competitor-prices')
export class CompetitorPricesController {
  constructor(
    private readonly competitorPricesService: CompetitorPricesService,
  ) {}

  @Get('hotels')
  @HttpCode(HttpStatus.OK)
  async searchHotels(@Query() query: SearchCompetitorPricesDto) {
    const data = await this.competitorPricesService.searchHotels(query);

    return {
      success: true,
      message: 'Lấy dữ liệu so sánh giá thành công',
      code: HttpStatus.OK,
      data,
    };
  }
}
