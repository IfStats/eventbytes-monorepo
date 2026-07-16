import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient {
    constructor();
    $transaction: PrismaClient['$transaction'];
    organizer: PrismaClient extends {
        organizer: infer T;
    } ? T : any;
    user: PrismaClient['user'];
    event: PrismaClient['event'];
    ticketTier: PrismaClient['ticketTier'];
}
