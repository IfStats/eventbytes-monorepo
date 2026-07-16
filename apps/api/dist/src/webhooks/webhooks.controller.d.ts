import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    paystackWebhook(signature: string, payload: any): Promise<{
        status: string;
    }>;
}
