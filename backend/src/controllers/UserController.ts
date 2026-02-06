import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class UserController {
    async list(req: Request, res: Response) {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                _count: {
                    select: {
                        stores: true,
                        managedSuppliers: true
                    }
                }
            }
        });
        return res.json(users);
    }

    async create(req: Request, res: Response) {
        const { name, email, password, role } = req.body;

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 8);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                role: role || 'USER'
            }
        });

        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
    }
}
