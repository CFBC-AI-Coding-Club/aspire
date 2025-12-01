import { prisma } from '../db/prisma';

export async function cleanupPriceHistory() {
    
    const retentionLimit = new Date();
    retentionLimit.setTime(retentionLimit.getTime() - 24 * 60 * 60 * 1000);

    try {
        const result = await prisma.stockPrice.deleteMany({
            where: {
                timestamp: {
                    // Delete records where the timestamp is less than (before) the retention limit
                    lt: retentionLimit, 
                },
            },
        });
        
        console.log(`Cleaned up ${result.count} old price history records (older than 24 hours).`);
    } catch (error) {
        console.error("Error during price history cleanup:", error);
    }
}