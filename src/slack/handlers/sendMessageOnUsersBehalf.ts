import { ISlackMessageIMEvent } from '../../interfaces';
import SlackService from '../../services/SlackService';

export async function sendMessageOnUsersBehalf(event: ISlackMessageIMEvent, displayText: string): Promise<void> {
	const slackService = new SlackService(event);

	console.log('Sendig message on users behalf');

	await slackService.sendMessageOnUsersBehalf(event, displayText);
}
