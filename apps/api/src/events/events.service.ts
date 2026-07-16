import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getFeaturedEvents() {
    return this.prisma.event.findMany({
      take: 6,
      orderBy: { date: 'asc' },
      where: { date: { gte: new Date() } },
    });
  }

  // Create an event tied to the authenticated organizer
  async createEvent(dto: CreateEventDto, organizerId: number) {
    return this.prisma.event.create({
      data: {
        title: dto.title,
        date: new Date(dto.date),
        location: dto.location,
        description: dto.description,
        organizerId: organizerId,
      },
    });
  }
}
