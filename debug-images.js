const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const id = '91e9a9e4-e2bd-4b6e-ba2f-fbb163f87d43';
    const request = await prisma.request.findUnique({
        where: { id },
        select: { images: true, title: true }
    });
    console.log('--- DEBUG INFO ---');
    console.log('ID:', id);
    console.log('Title:', request?.title);
    console.log('Images raw value:', request?.images);
    console.log('Type of images:', typeof request?.images);
    console.log('------------------');
}

main().finally(() => prisma.$disconnect());
