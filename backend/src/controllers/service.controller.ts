import { Request, Response } from 'express';
import prisma from '../config/db';

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, url } = req.body;

    const service = await prisma.service.create({
      data: {
        name,
        url,
      },
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findFirst({
      where: { id },
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

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url } = req.body;

    const existingService = await prisma.service.findFirst({ where: { id } });
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

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingService = await prisma.service.findFirst({ where: { id } });
    if (!existingService) return res.status(404).json({ success: false, message: 'Service not found' });

    await prisma.service.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
