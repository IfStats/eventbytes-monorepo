import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
	constructor(private prisma: PrismaService) {}

	verifySignature(signature: string, rawBody: string): boolean {
		const hash = crypto
			.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
			.update(rawBody)
			.digest('hex');

		return hash === signature;
	}

	async handlePaystackPayment(eventData: any) {
		if (eventData.event !== 'charge.success') {
			return { status: 'ignored' };
		}

		const { metadata } = eventData.data;
		const ticketTierId = metadata?.ticket_tier_id;

		await this.prisma.$transaction(async (tx) => {
			const ticketTierDelegate = (
				tx as typeof tx & {
					ticketTier?: { update: (args: any) => Promise<unknown> };
					ticket_tier?: { update: (args: any) => Promise<unknown> };
					ticketTiers?: { update: (args: any) => Promise<unknown> };
				}
			).ticketTier
				?? (tx as any).ticket_tier
				?? (tx as any).ticketTiers;

			if (!ticketTierDelegate) {
				throw new BadRequestException('Ticket tier model is not defined on Prisma transaction client. Check prisma/schema.prisma model naming.');
			}

			await ticketTierDelegate.update({
				where: { id: ticketTierId },
				data: {
					quantitySold: {
						increment: 1,
					},
				},
			});
		});

		return { status: 'success' };
	}
}
