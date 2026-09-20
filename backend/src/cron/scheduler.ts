import cron from 'node-cron';
import prisma from '../config/db';
import { pingService } from '../services/ping.service';

// Run every 10 minutes
export const startCronJobs = () => {
  cron.schedule('*/10 * * * *', async () => {
    console.log('[CRON] Running keep-alive ping job...');
    try {
      const services = await prisma.service.findMany({
        select: { id: true },
      });

      // Map ping promises to run in parallel
      const pingPromises = services.map(service => pingService(service.id));
      await Promise.allSettled(pingPromises);
      
      console.log(`[CRON] Pinging completed for ${services.length} services.`);
    } catch (error) {
      console.error('[CRON] Error in cron job:', error);
    }
  });

  console.log('Cron scheduler started.');
};
