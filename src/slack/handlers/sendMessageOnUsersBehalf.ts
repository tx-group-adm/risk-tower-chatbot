import { ISlackMessageIMEvent } from '../../interfaces';
import SlackService from '../../services/SlackService';

export async function sendMessageOnUsersBehalf(event: ISlackMessageIMEvent, displayText: string): Promise<void> {
	console.log('EVENT_ON_USERS_BEHALF');
	const slackService = new SlackService(event);

	await slackService.sendMessageOnUsersBehalf(event, displayText);
}
