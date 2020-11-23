import { KnownBlock, WebClient } from '@slack/web-api';
import { ISlackMessageIMEvent, ISLackProfileResponse } from '../interfaces';

const { SLACK_BOT_TOKEN } = process.env;

export default class SlackService {
	private webClient: WebClient;
	private event: ISlackMessageIMEvent;

	constructor(event: ISlackMessageIMEvent) {
		this.webClient = new WebClient(SLACK_BOT_TOKEN, { retryConfig: { retries: 0 } });
		this.event = event;
	}

	async postMessage(text: string, blocks?: Array<KnownBlock>): Promise<void> {
		await this.webClient.chat.postMessage({
			channel: this.event.channel,
			text,
			blocks,
		});
	}

	async getEmailForUser(): Promise<string> {
		const response = ((await this.webClient.users.profile.get({
			user: this.event.user,
		})) as unknown) as ISLackProfileResponse;

		return response.profile.email;
	}

	async uploadFile(file: Buffer): Promise<void> {
		await this.webClient.files.upload({
			channels: this.event.channel,
			file,
		});
	}

	async sendMessageOnUsersBehalf(message: string): Promise<void> {
		const text = `You chose: "${message}".`;
		await this.webClient.chat.postMessage({
			channel: this.event.channel,
			text,
		});
	}
}
