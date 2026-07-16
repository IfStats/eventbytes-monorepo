import { PrismaService } from '../prisma/prisma.service';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    createEvent(dto: {
        title: string;
        date: string;
        location: string;
        description: string;
    }): Promise<any>;
    registerAttendee(dto: {
        name: string;
        email: string;
        ticketType: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
