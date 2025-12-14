
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = '83f49469-8ba1-4599-ba9e-13eb1480ec2f';

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    });

    console.log('User:', user);
    console.log('Profile:', user?.profile);

    if (user?.profile?.portfolioImages) {
        console.log('Portfolio Images Raw:', user.profile.portfolioImages);
        let portfolioImages = [];
        try {
            const parsed = JSON.parse(user.profile.portfolioImages);
            console.log('First parse result:', parsed, 'Type:', typeof parsed);

            if (Array.isArray(parsed)) {
                portfolioImages = parsed;
            } else if (typeof parsed === 'string') {
                console.log('Detected string, attempting double parse...');
                try {
                    const doubleParsed = JSON.parse(parsed);
                    console.log('Second parse result:', doubleParsed, 'Is Array:', Array.isArray(doubleParsed));
                    if (Array.isArray(doubleParsed)) {
                        portfolioImages = doubleParsed;
                    }
                } catch (e) {
                    console.log('Double parse failed:', e);
                }
            }
        } catch (e) {
            console.log('Error parsing portfolio images:', e);
        }
        console.log('Final portfolioImages:', portfolioImages);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
