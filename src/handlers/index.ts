import { IDetectIntentResponseData, IParameter } from '../interfaces';
import DataService from '../services/DataService';
import SlackService from '../services/SlackService';
import { createQuickReplyBlock, getQuickReplyOptionsFor } from '../slack/blocks/createQuickReplyBlock';

export const INTENTS = {
	DEFAULT_WELCOME: 'Default Welcome Intent',
	DEFAULT_FALLBACK: 'Default Fallback Intent',
	GET_RISK_CHART: 'GetRiskChart',
	GET_ASSESSMENT_DATA: 'GetAssessmentData',
	GET_RISKS: 'GetRisks',
	GET_TOP_FINDINGS: 'GetTopFindings',
	GET_TOP_MEASURES: 'GetTopMeasures',
	GET_ENTITY_INFO: 'GetEntityInfo',
	GET_RISK_EPICS: 'GetRiskEpics',
	GET_RISK_RATINGS: 'GetRiskRatings',
	GET_GENERAL_HELP: 'GetGeneralHelp',
	GET_HELP_ASSESSMENT_FINDINGS_EPICS: 'GetHelpAssessmentFindingsEpics',
	GET_HELP_BOARD_TYPE: 'GetHelpBoardType',
	GET_HELP_ENTITY: 'GetHelpEntity',
	GET_HELP_KANBAN_BOARD: 'GetHelpKanbanBoard',
	GET_HELP_ORGANISATION: 'GetHelpOrganisation',
	GET_HELP_PREQUISITES: 'GetHelpPrequisites',
	GET_HELP_RISK_AREAS: 'GetHelpRiskAreas',
	GET_HELP_RISK_TOWER: 'GetHelpRiskTower',
	GET_HELP_RISK_TYPE: 'GetHelpRiskType',
	GET_HELP_SHOW_ASSESSMENT: 'GetHelpShowAssessment',
	GET_HELP_SHOW_FINDINGS: 'GetHelpShowFindings',
	GET_HELP_SHOW_MEASURES: 'GetHelpShowMeasures',
	GET_HELP_SHOW_RISKS: 'GetHelpShowRisks',
	GET_HELP_STORIES: 'GetHelpStories',
};

export { handleGetRiskChart } from './GetRiskChart/handleGetRiskChart';
export { handleGetGeneralHelp } from './GetGeneralHelp/handleGetGeneralHelp';
export { handleGetRisks } from './GetRisks/handleGetRisks';
export { handleGetTopFindings } from './GetTopFindings/handleGetTopFindings';
export { handleGetTopMeasures } from './GetTopMeasures/handleGetTopMeasures';

export async function showQuickReplies(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	console.log(JSON.stringify(response));
	const missingParameters: IParameter[] = response.missingParameters;
	const message = response.messages.join('\n');
	const options = getQuickReplyOptionsFor(missingParameters[0]);
	const blocks = createQuickReplyBlock(message, options);

	await slackService.postMessage('', blocks);
}

export async function userIsTopLevelAdmin(email: string): Promise<boolean> {
	try {
		const roles = await DataService.getRolesForUser(email);
		if (roles.length == 1 && roles[0] === 'admin') {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		console.log(err);
		return false;
	}
}

export async function handleMissingParameters(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<boolean> {
	let allRequiredParamsPresent = response.allRequiredParamsPresent;
	// set tx_assessment_type to 'security' if user is top level admin
	if (response.missingParameters.includes('tx_assessment_type')) {
		const email = await slackService.getEmailForUser();
		const isUserTopLevelAdmin = await userIsTopLevelAdmin(email);
		if (isUserTopLevelAdmin) {
			response.parameters['tx_assessment_type'] = 'security';
			response.missingParameters.splice(response.missingParameters.indexOf('tx_assessment_type'), 1);
			if (response.missingParameters.length == 0) {
				allRequiredParamsPresent = true;
			}
		}
	}
	if (!allRequiredParamsPresent) {
		showQuickReplies(response, slackService);
		return true;
	}
	return false;
}
