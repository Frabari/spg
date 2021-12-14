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
    return this.schedulingService.getDate();
  }

  @Patch('date')
  setDate(@Body() dto: SetDateDto) {
    return this.schedulingService.setDate(dto.date);
  }
}
