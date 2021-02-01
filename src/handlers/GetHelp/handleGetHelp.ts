import { getHelpDataForIntent } from '.';
import { IDetectIntentResponseData, IHelpData } from '../../interfaces';
import SlackService from '../../services/SlackService';
import { createHelpDataBlock } from '../../slack/blocks/createHelpDataBlock';

export async function handleGetHelp(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	const helpData: IHelpData = getHelpDataForIntent(response.intentName);
	const blocks = createHelpDataBlock(helpData);

	await slackService.postMessage('', blocks);
}
