import { EventsService } from './events.service';
export declare class EventsController {
    private eventsService;
    constructor(eventsService: EventsService);
    createEvent(dto: any): Promise<any>;
    registerAttendee(dto: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
