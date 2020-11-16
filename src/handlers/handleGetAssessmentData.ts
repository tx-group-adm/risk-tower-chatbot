import { WebClient } from '@slack/web-api';
import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';
import { createDiagram } from '../helpers/createDiagram';
import { IAssessment, IDetectIntentResponseData, IParameter, ISlackMessageIMEvent } from '../interfaces';

export async function handleGetAssessmentData(
	response: IDetectIntentResponseData,
	event: ISlackMessageIMEvent,
	webClient: WebClient
): Promise<void> {
	const payload: IAssessment = (response.payload as unknown) as IAssessment;
	const messages: Array<string> = response.messages;
	const allRequiredParamsPresent: boolean = response.allRequiredParamsPresent;
	const missingParameters: Array<IParameter> = response.missingParameters;

	const message = messages.join('\n');

	// check if slot filling is needed, if yes show quick reply block
	if (!allRequiredParamsPresent) {
		const options = getQuickReplyOptionsFor(missingParameters[0]);
		const blocks = createQuickReplyBlock(message, options);

		await webClient.chat.postMessage({
			channel: event.channel,
			text: '',
			blocks,
		});

		return;
	}

	// respond with assessment data
	await webClient.chat.postMessage({
		channel: event.channel,
		text: message,
	});

	const chartData: { impact: number; probability: number } = {
		impact: payload.impact,
		probability: payload.probability,
	};
	const diagram = await createDiagram(chartData);

	await webClient.files.upload({
		file: diagram,
		channels: event.channel,
	});
}
