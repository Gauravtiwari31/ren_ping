import axios from 'axios';
import axiosRetry from 'axios-retry';
import prisma from '../config/db';
import { sendAlertEmail } from './email.service';

const pingClient = axios.create({ timeout: 10000 });
axiosRetry(pingClient, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export const pingService = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service) return;

  const startTime = Date.now();
  let isSuccess = false;
  let statusCode = null;

  try {
    const response = await pingClient.get(service.url);
    statusCode = response.status;
    isSuccess = statusCode >= 200 && statusCode < 400;
  } catch (error: any) {
    statusCode = error.response?.status || 500;
    isSuccess = false;
  }

  const responseTime = Date.now() - startTime;

  // Log the ping
  await prisma.pingLog.create({
    data: {
      serviceId: service.id,
      responseTime,
      statusCode,
      isSuccess,
    },
  });

  // Calculate new uptime percentage (rough estimation logic)
  const totalPings = await prisma.pingLog.count({ where: { serviceId: service.id } });
  const successfulPings = await prisma.pingLog.count({ where: { serviceId: service.id, isSuccess: true } });
  const uptimePercentage = totalPings > 0 ? (successfulPings / totalPings) * 100 : 100.0;

  // Update service status
  let lastDownAt = service.lastDownAt;
  const now = new Date();

  if (isSuccess) {
    lastDownAt = null; // Reset downtime tracker
  } else {
    if (!lastDownAt) {
      lastDownAt = now; // Mark as down just now
    } else {
      // Check if it's been down for > 30 minutes
      const diffMins = (now.getTime() - lastDownAt.getTime()) / (1000 * 60);
      if (diffMins >= 30) {
        // Trigger alert if not already resolved recently
        const recentAlert = await prisma.alertLog.findFirst({
          where: { serviceId: service.id, resolved: false },
        });

        if (!recentAlert) {
          const alertEmail = process.env.ALERT_EMAIL || process.env.SMTP_USER || 'admin@localhost';
          await sendAlertEmail(alertEmail, service.name, service.url, 'Service has been down for over 30 minutes.');
          await prisma.alertLog.create({
            data: {
              serviceId: service.id,
              message: 'Service down > 30 mins',
            },
          });
        }
      }
    }
  }

  await prisma.service.update({
    where: { id: service.id },
    data: {
      status: isSuccess ? 'ONLINE' : 'OFFLINE',
      lastPingAt: now,
      lastDownAt,
      uptimePercentage,
    },
  });
};
