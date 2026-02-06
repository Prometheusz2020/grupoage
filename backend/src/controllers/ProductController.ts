import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductController {
    async list(req: Request, res: Response) {
        const { supplierId } = req.query;

        const where: any = {};
        if (supplierId) {
            where.supplierId = Number(supplierId);
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                supplier: {
                    select: { tradeName: true }
                }
            },
            orderBy: {
                name: 'asc',
            }
        });

        return res.json(products);
    }

    async create(req: Request, res: Response) {
        const { supplierId, name, costPrice, salePrice, itemsPerBox, boxPrice } = req.body;

        if (!supplierId || !name) {
            return res.status(400).json({ error: 'Supplier and Name are required.' });
        }

        try {
            const product = await prisma.product.create({
                data: {
                    supplierId: Number(supplierId),
                    name,
                    costPrice: Number(costPrice || 0),
                    salePrice: Number(salePrice || 0),
                    itemsPerBox: Number(itemsPerBox || 1),
                    boxPrice: Number(boxPrice || 0),
                },
            });

            return res.status(201).json(product);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create product.' });
        }
    }
}
