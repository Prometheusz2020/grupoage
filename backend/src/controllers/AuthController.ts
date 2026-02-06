import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class AuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // PASSWORD BYPASS (Requested by User)
        // if (user.password !== password) {
        //   return res.status(400).json({ error: 'Invalid password' });
        // }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', {
            expiresIn: '7d',
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return res.json({
            user: userWithoutPassword,
            token,
        });
    }
}
