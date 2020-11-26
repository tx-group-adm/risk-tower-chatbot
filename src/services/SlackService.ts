import { KnownBlock, WebClient } from '@slack/web-api';
import { ISlackMessageIMEvent, ISlackProfile, ISLackProfileResponse } from '../interfaces';

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

	async getProfile(): Promise<ISlackProfile> {
		const response = ((await this.webClient.users.profile.get({
			user: this.event.user,
		})) as unknown) as ISLackProfileResponse;

		return response.profile;
	}

	async getEmailForUser(): Promise<string> {
		const profile: ISlackProfile = await this.getProfile();

		return profile.email;
	}

	async uploadFile(file: Buffer): Promise<void> {
		await this.webClient.files.upload({
			channels: this.event.channel,
			file,
		});
	}

	async sendMessageOnUsersBehalf(event: ISlackMessageIMEvent, message: string): Promise<void> {
		message = message.replace(/\+/g, ' ');

		const { real_name, image_512 } = await this.getProfile();

		await this.webClient.chat.postMessage({
			channel: this.event.channel,
			text: message,
			username: real_name,
			icon_url: image_512,
			as_user: true,
		});
	}
}
