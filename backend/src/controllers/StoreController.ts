import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StoreController {
    async list(req: Request, res: Response) {
        const stores = await prisma.store.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        return res.json(stores);
    }

    async create(req: Request, res: Response) {
        const { name, ownerId } = req.body;

        if (!name || !ownerId) {
            return res.status(400).json({ error: 'Name and Owner ID are required' });
        }

        try {
            const store = await prisma.store.create({
                data: {
                    name,
                    ownerId: Number(ownerId)
                }
            });
            return res.status(201).json(store);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create store' });
        }
    }
}
