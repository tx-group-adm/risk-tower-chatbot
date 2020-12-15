import { ICompany, IDetectIntentResponseData, IGetEntityInfoParameters, IParameter, IType } from '../../interfaces';
import DataService from '../../services/DataService';
import SlackService from '../../services/SlackService';
import { createEntityInfoBlock } from '../../slack/blocks/createEntityInfoBlock';
import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../../slack/blocks/createQuickReplyBlock';

export async function handleGetEntityInfo(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const parameters = response.parameters as IGetEntityInfoParameters;
	const allRequiredParamsPresent: boolean = response.allRequiredParamsPresent;
	const missingParameters: Array<IParameter> = response.missingParameters;

	// check if slot filling is needed, if yes show quick reply block
	if (!allRequiredParamsPresent) {
		const message = response.messages.join('\n');
		const options = getQuickReplyOptionsFor(missingParameters[0]);
		const blocks = createQuickReplyBlock(message, options);

		await slackService.postMessage('', blocks);

		return;
	}

	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;

	const info = await DataService.getEntityInfo(type, company);
	const blocks = createEntityInfoBlock(info);

	await slackService.postMessage('', blocks);
}
