import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [..., JobsModule],
})