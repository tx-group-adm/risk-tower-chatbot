import { IDetectIntentResponseData, IParameter, RoleType } from '../interfaces';
import DataService from '../services/DataService';
import SlackService from '../services/SlackService';
import {
	createDateDropdownBlock,
	createQuickReplyBlock,
	getQuickReplyOptionsFor,
} from '../slack/blocks/createQuickReplyBlock';

export const INTENTS = {
	DEFAULT_WELCOME: 'Default Welcome Intent',
	DEFAULT_FALLBACK: 'Default Fallback Intent',
	SMALL_TALK: 'SmallTalk',
	GET_RISK_CHART: 'GetRiskChart',
	GET_ASSESSMENT_DATA: 'GetAssessmentData',
	GET_RISKS: 'GetRisks',
	GET_TOP_FINDINGS: 'GetTopFindings',
	GET_TOP_MEASURES: 'GetTopMeasures',
	GET_ENTITY_INFO: 'GetEntityInfo',
	GET_RISK_EPICS: 'GetRiskEpics',
	GET_RISK_RATINGS: 'GetRiskRatings',
	GET_INCIDENTS: 'GetIncidents',
	GET_HIGHLIGHTS: 'GetHighlights',
	GET_NEWS: 'GetNews',
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
	UPDATE_COMPANIES: 'Update Companies',
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
	const options = await getQuickReplyOptionsFor(missingParameters[0], response.parameters);
	const blocks = createQuickReplyBlock(message, options);

	await slackService.postMessage('', blocks);
}

export async function showDateDropdown(response: IDetectIntentResponseData, slackService: SlackService): Promise<void> {
	const message = response.messages.join('\n');
	const blocks = createDateDropdownBlock(message);

	await slackService.postMessage('', blocks);
}

export async function isUserTopLevelAdmin(email: string): Promise<boolean> {
	const roles = await DataService.getRolesForUser(email);
	const roleType: RoleType = roles[0];
	const validRoles: RoleType[] = ['admin', 'admin_security', 'read_only', 'read_security'];

	// does user have rights to see security data

	if (validRoles.includes(roleType)) {
		return true;
	} else {
		return false;
	}
}
