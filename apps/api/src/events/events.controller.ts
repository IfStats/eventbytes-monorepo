import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('events')
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get('featured')
	async getFeatured() {
		return this.eventsService.getFeaturedEvents();
	}

	@UseGuards(AuthGuard)
	@Post()
	async create(@Body() dto: CreateEventDto, @Request() req: any) {
		// req.user is set by our AuthGuard after verification
		const organizerId = req.user.sub;
		return this.eventsService.createEvent(dto, organizerId);
	}
}
