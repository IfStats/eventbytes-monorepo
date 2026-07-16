import { BadRequestException, Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
	constructor(private readonly webhooksService: WebhooksService) {}

	@Post('paystack')
	async paystackWebhook(
		@Headers('x-paystack-signature') signature: string,
		@Body() payload: any,
	) {
		if (!signature) {
			throw new BadRequestException('Missing payload verification signature.');
		}

		const rawBody = JSON.stringify(payload);
		const isValid = this.webhooksService.verifySignature(signature, rawBody);

		if (!isValid) {
			throw new BadRequestException('Invalid paystack webhook signature.');
		}

		return this.webhooksService.handlePaystackPayment(payload);
	}
}
