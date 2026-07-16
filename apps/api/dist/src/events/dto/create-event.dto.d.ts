declare class TicketTierDto {
    name: string;
    price: number;
    capacity: number;
}
export declare class CreateEventDto {
    title: string;
    description?: string;
    venueName: string;
    startTime: string;
    endTime: string;
    ticketTiers: TicketTierDto[];
}
export {};
