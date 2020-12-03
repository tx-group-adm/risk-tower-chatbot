import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/quickReply';
import {
	IAssessment,
	ICompany,
	IDetectIntentResponseData,
	IGetAssessmentDataParameters,
	IParameter,
	IRole,
	IType,
} from '../interfaces';
import SlackService from '../services/SlackService';
import { createScatterChart } from '../slack/charts/scatterChart';
import { createAssessmentDataBlock } from '../slack/blocks/assessmentData';
import DataService from '../services/DataService';

export async function handleGetAssessmentData(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	const parameters = response.parameters as IGetAssessmentDataParameters;
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

	const email = await slackService.getEmailForUser();
	const roles: IRole[] = await DataService.getRolesForUser(email);
	const type: IType = parameters.tx_assessment_type;
	const company: ICompany = parameters.tx_company;
	const assessment: IAssessment = await DataService.getAssessmentData(type, roles, company);

	if (assessment.hasAssessment) {
		const assessmentMessage = `The ${type} chart for ${company} shows an impact of *${assessment.impact}* and a probability of *${assessment.probability}*`;
		const url = await createScatterChart(assessment);
		const blocks = createAssessmentDataBlock(assessment.name, assessmentMessage, url);
		await slackService.postMessage('', blocks);
	} else {
		const noAssessmentMessage = `Currently, there is no ${type} assessment data for ${company}.`;
		await slackService.postMessage(noAssessmentMessage);
	}
}
