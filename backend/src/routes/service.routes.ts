import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services for logged in user
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/', getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a specific service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details with ping logs
 */
router.get('/:id', getServiceById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Add a new service to monitor
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created
 */
router.post('/', createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update an existing service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service updated
 */
router.put('/:id', updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.delete('/:id', deleteService);

export default router;
