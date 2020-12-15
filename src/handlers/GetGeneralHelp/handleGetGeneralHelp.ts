import { createHelpMessageBlock } from '../../slack/blocks/createHelpMessageBlock';
import { IDetectIntentResponseData } from '../../interfaces';
import SlackService from '../../services/SlackService';

export async function handleGetGeneralHelp(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const messages: string[] = response.messages;
	const message = messages.join('\n');

	const blocks = createHelpMessageBlock(message);

	await slackService.postMessage('', blocks);
}
