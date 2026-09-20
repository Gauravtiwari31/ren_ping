import { Request, Response } from 'express';
import prisma from '../config/db';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { name, url } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const service = await prisma.service.create({
      data: {
        name,
        url,
        userId,
      },
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getServices = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const services = await prisma.service.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getServiceById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const service = await prisma.service.findFirst({
      where: { id, userId },
      include: {
        pingLogs: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      }
    });

    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const existingService = await prisma.service.findFirst({ where: { id, userId } });
    if (!existingService) return res.status(404).json({ success: false, message: 'Service not found' });

    const updatedService = await prisma.service.update({
      where: { id },
      data: { name, url },
    });

    res.status(200).json({ success: true, service: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const existingService = await prisma.service.findFirst({ where: { id, userId } });
    if (!existingService) return res.status(404).json({ success: false, message: 'Service not found' });

    await prisma.service.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
