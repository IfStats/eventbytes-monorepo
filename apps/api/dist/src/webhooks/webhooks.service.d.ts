import { PrismaService } from '../prisma/prisma.service';
export declare class WebhooksService {
    private prisma;
    constructor(prisma: PrismaService);
    verifySignature(signature: string, rawBody: string): boolean;
    handlePaystackPayment(eventData: any): Promise<{
        status: string;
    }>;
}
