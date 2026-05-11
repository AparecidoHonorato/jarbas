import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('search')
  async search(@Body() body: { keyword: string }) {
    return this.jobsService.searchJobs(body.keyword);
  }

  @Post('cover-letter')
  async coverLetter(@Body() body: { jobTitle: string; company: string }) {
    return this.jobsService.generateCoverLetter(body.jobTitle, body.company);
  }
}