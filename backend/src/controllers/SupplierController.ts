import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SupplierController {
    async list(req: Request, res: Response) {
        const userId = req.userId;

        const suppliers = await prisma.supplier.findMany({
            where: {
                managerId: userId,
            },
            include: {
                _count: {
                    select: { products: true, purchaseCycles: true },
                },
            },
        });

        return res.json(suppliers);
    }

    async create(req: Request, res: Response) {
        // const userId = Number(req.userId); // No longer auto-assigning to creator
        const {
            tradeName, corporateName, cnpj, email, address,
            phone1, phone2, contactName1, contactName2, notes,
            managerId // Now passed from frontend selection
        } = req.body;

        // Basic Validation
        if (!tradeName || !cnpj || !managerId) {
            return res.status(400).json({ error: 'Nome Fantasia, CNPJ and Manager (Responsável) are required.' });
        }

        try {
            const supplier = await prisma.supplier.create({
                data: {
                    tradeName,
                    corporateName: corporateName || tradeName,
                    cnpj,
                    email,
                    address,
                    phone1,
                    phone2,
                    contactName1,
                    contactName2,
                    notes,
                    managerId: Number(managerId),
                },
            });

            return res.status(201).json(supplier);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create supplier.' });
        }
    }
    async toggleActive(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const supplier = await prisma.supplier.findUnique({ where: { id: Number(id) } });

            if (!supplier) {
                return res.status(404).json({ error: 'Supplier not found' });
            }

            const updatedSupplier = await prisma.supplier.update({
                where: { id: Number(id) },
                data: { isActive: !supplier.isActive },
            });

            return res.json(updatedSupplier);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update supplier status.' });
        }
    }
}
