import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@age26.com' },
        update: {},
        create: {
            email: 'admin@age26.com',
            name: 'Admin User',
            password: 'managed_hash_password', // In production use bcrypt
        },
    });

    // Create Store Owner
    const owner = await prisma.user.upsert({
        where: { email: 'loja01@age26.com' },
        update: {},
        create: {
            email: 'loja01@age26.com',
            name: 'Dono Loja 01',
            password: 'password123',
        },
    });

    // Create Store
    const store = await prisma.store.create({
        data: {
            name: 'Loja Exemplo 01',
            ownerId: owner.id,
        },
    });

    // Create Supplier managed by Admin
    const supplier = await prisma.supplier.create({
        data: {
            tradeName: 'Fornecedor Atacadista A',
            corporateName: 'Atacadista A LTDA',
            cnpj: '00.000.000/0001-00',
            phone1: '11999999999',
            contactName1: 'João Silva',
            managerId: admin.id,
            products: {
                create: [
                    {
                        name: 'Produto A1 (Caixa)',
                        costPrice: 15.00,
                        salePrice: 25.00,
                        itemsPerBox: 10,
                        boxPrice: 150.00,
                        stock: 100,
                        active: true
                    },
                    {
                        name: 'Produto B2 (Unidade)',
                        costPrice: 12.50,
                        salePrice: 20.00,
                        itemsPerBox: 1,
                        boxPrice: 12.50,
                        stock: 500,
                        active: true
                    },
                ],
            },
        },
    });

    console.log({ admin, owner, store, supplier });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
