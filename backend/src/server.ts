import app from './app';
import { env } from './config/env';
import { startCronJobs } from './services/cronService';

const PORT = parseInt(env.PORT);

app.listen(PORT, () => {
  console.log(`🍼 SORAIA API running on port ${PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Frontend: ${env.FRONTEND_URL}`);
  
  // Start scheduled cron jobs
  startCronJobs();
});
