import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SchedulingService } from './scheduling.service';

@Controller('scheduling')
@ApiTags('Scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get('close-weekly-sales')
  endService() {
    return this.schedulingService.closeWeeklySales(true);
  }
}
