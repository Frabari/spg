import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SetDateDto } from './dtos/change-date.dto';
import { SchedulingService } from './scheduling.service';

@Controller('scheduling')
@ApiTags('Scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get('date')
  getDate() {
    return { date: this.schedulingService.getDate() };
  }

  @Patch('date')
  async setDate(@Body() dto: SetDateDto) {
    return { date: await this.schedulingService.setDate(dto.date) };
  }
}
