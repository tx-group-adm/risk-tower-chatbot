import { ActionsBlock, PlainTextElement, SectionBlock } from '@slack/web-api';
import { ChartConfiguration } from 'chart.js';

export interface HandlerResponse {
	statusCode: number;
	body: string;
	headers: {
		[header: string]: string | number | boolean;
	};
	isBase64Encoded: boolean;
}
export interface ISlackEvent {
	body: string;
}

export interface ISlackEventCallback {
	api_app_id: string;
	authed_users: Array<string>;
	event: ISlackMessageIMEvent;
	event_id: string;
	event_time: number;
	team_id: string;
	token: string;
	type: 'event_callback';
}

export type SlackEventType = ISlackEventCallback | ISlackBlockActionsEvent;

export type ISlackBlockActionsEvent = ISlackBlockActionsButtonEvent | ISlackBlockActionsSelectEvent;

export interface ISlackBlockActionsButtonEvent {
	type: 'block_actions';
	user: {
		id: string;
		username: string;
		name: string;
		team_id: string;
	};
	api_app_id: string;
	token: string;
	container: {
		type: string;
		message_ts: string;
		channel_id: string;
		is_ephemeral: boolean;
	};
	trigger_id: string;
	team: {
		id: string;
		domain: string;
	};
	channel: {
		id: string;
		name: string;
	};
	message: {
		bot_id: string;
		type: string;
		text: string;
		user: string;
		ts: string;
		team: string;
		blocks: Array<SectionBlock | ActionsBlock>;
	};
	response_url: string;
	actions: BlockAction[];
}

// use block_id = static_select_help_block, action_id = static_select_help_action

export interface ISlackBlockActionsSelectEvent {
	type: 'block_actions';
	user: {
		id: string;
		username: string;
		name: string;
		team_id: string;
	};
	api_app_id: string;
	token: string;
	container: {
		type: string;
		text: string;
	};
	trigger_id: string;
	team: {
		id: string;
		domain: string;
	};
	channel: {
		id: string;
		name: string;
	};
	message: {
		bot_id: string;
		type: string;
		text: string;
		user: string;
		ts: string;
		team: string;
		blocks: Array<SectionBlock | ActionsBlock>;
	};
	enterprise: null;
	is_enterprise_install: boolean;
	state: {
		values: {
			static_select_help_block: {
				static_select_help_action: {
					type: 'static_select';
					selected_option: {
						text: PlainTextElement;
						value: string;
					};
				};
			};
		};
	};
	response_url: string;
	actions: BlockAction[];
}

export interface BlockAction {
	type: string;
	block_id: string;
	action_id: string;
	text: {
		type: 'plain_text';
		text: string;
		emoji: true;
	};
	action_ts: string;
	value: string;
}

export interface ISlackMessageIMEvent {
	type: 'message';
	channel: string;
	user: string;
	text: string;
	ts: string;
	event_ts: string;
	channel_type: 'im';
	bot_id?: string;
	upload?: boolean;
}

export interface ISlackProfile {
	title: string;
	phone: string;
	skype: string;
	real_name: string;
	real_name_normalized: string;
	display_name: string;
	display_name_normalized: string;
	fields: {
		[index: string]: {
			value: string;
			alt: string;
		};
	};
	status_text: string;
	status_emoji: string;
	status_expiration: number;
	avatar_hash: string;
	image_original: string;
	is_custom_image: boolean;
	email: string;
	first_name: string;
	last_name: string;
	image_24: string;
	image_32: string;
	image_48: string;
	image_72: string;
	image_192: string;
	image_512: string;
	image_1024: string;
	status_text_canonical: string;
}

export interface ISLackProfileResponse {
	ok: boolean;
	profile: ISlackProfile;
	response_metadata: {
		scopes: Array<string>;
		acceptedScopes: Array<string>;
	};
}

export interface IDiagramOptions {
	impact: number;
	probability: number;
	width: number;
	height: number;
	margin: number;
	size: number;
	lineWidth: number;
	fillStyle: string;
	strokeStyle: string;
	itemColor: string;
}

export interface IValue {
	numberValue?: number;
	stringValue?: string;
	boolValue?: boolean;
	listValue?: {
		values: IValue[];
	};
}

export interface IDialogflowResponsePayload {
	[index: string]: IValue & { kind: string };
}

export interface IDetectIntentResponseData {
	messages: Array<string>;
	parameters: {
		[index: string]: string;
	};
	allRequiredParamsPresent: boolean;
	missingParameters: Array<IParameter>;
	intentName: string;
}

export type IParameter = 'tx_company' | 'tx_assessment_type' | 'tx_assessment_category' | 'date_time';

export interface IAssessment {
	assessmentId: string;
	name: ICompany;
	highlight: boolean;
	id: number;
	type: string;
	parentId: number | null;
	hasAssessment: boolean;
	children: Array<IAssessment>;
	impact: number;
	probability: number;
	rating: number;
	ratingColor: string;
	lastAccessed: string;
	user: string;
	weight: number;
}

export type ICompany =
	| 'TX Group'
	| 'TX Markets'
	| 'Group and Services'
	| 'Tamedia'
	| 'Goldbach Group'
	| '20 Minuten'
	| 'Technology Services'
	| 'TX Ventures'
	| 'Corporate Services'
	| 'IT'
	| 'Logistics and Printing'
	| 'Paid Media'
	| 'Goldbach';

export type IType = 'security' | 'privacy' | 'technology';

export type ICategory = 'entity info' | 'risk chart' | 'risk ratings' | 'risk epics';

export interface DateTime {
	endDate: string;
	startDate: string;
}

export type IDateTime = DateTime | '';

export interface IQuickchartConfig {
	backgroundColor: 'transparent';
	width: number;
	height: number;
	format: 'png';
	chart: ChartConfiguration;
}

export interface IJiraTicket {
	area: string;
	epicLink: string;
	status: string;
	epicKey: string;
	name: string;
	assessmentName: string;
}

export interface ITopFindingData {
	count: number;
	company: Array<ICompany>;
	criticality: number;
	configName: Array<string>;
	stories: Array<{
		name: string;
		description: string;
	}>;
}

export type ITopFinding = [string, ITopFindingData];

export interface ITopMeasureData {
	count: number;
	company: Array<ICompany>;
	criticality: number;
	configName: Array<string>;
	stories: Array<{
		name: string;
		description: string;
	}>;
}

export type ITopMeasure = [string, ITopMeasureData];

export interface IHierarchyTreeItem {
	id: number;
	parentId: number;
	name: ICompany;
	companyType: 'entity' | 'organisation';
	hasAssessment: boolean;
	assessmentType: Array<string>;
}

export type IRoles = [RoleType, ICompany | undefined];
export type RoleType =
	| 'admin'
	| 'read_only'
	| 'admin_security'
	| 'read_security'
	| 'admin_privacy'
	| 'read_privacy'
	| 'admin_technology'
	| 'read_technology';

export interface IOrganisation {
	name: ICompany;
	highlight: boolean;
	id: number;
	type: 'organisation';
	parentId: number | null;
	hasAssessment: boolean;
	children: Array<IOrganisation | IAssessment>;
	impact: number;
	probability: number;
	rating: number;
	ratingColor: string;
}

export type IRiskResponse = IRiskOrganisationResponse | IRiskEntityResponse;

export interface IRiskOrganisationResponse {
	type: 'organisation';
	children: Array<IOrganisation | IAssessment>;
}

export interface IRiskEntityResponse {
	type: 'entity';
	assessment: IAssessment;
}

export interface RiskArea {
	config: {
		name: string;
		ratings: RiskRating[];
		type: string;
	};
	rating: number;
	ratingIndex: number;
	ratingType: string;
}

export interface RiskRatingData {
	assessment: {
		areas: {
			[index: number]: RiskArea;
		};
		createdAt: number;
		dataType: string;
		entityName: ICompany;
		id: string;
		sourceType: IType;
		updatedAt: number;
		user: string;
		weight: number;
	};
	companies: Array<{
		entityName: ICompany;
		id: string;
	}>;
	history: Array<{
		dataType: string;
		date: string;
		id: string;
	}>;
	ratings: {
		impact: number;
		probability: number;
	};
}

export interface RiskRating {
	areaAssessment: string;
	criticality: number;
	epicKey: string;
	epicLink: string;
	epicProposal: {
		description: string;
		name: string;
		stories: Array<{
			description: string;
			name: string;
		}>;
	};
	epicStatus: string;
	stories: string[];
}

export interface IIntentParameters {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[index: string]: any;
}

export interface IGetAssessmentDataParameters extends IIntentParameters {
	tx_assessment_type: IType;
	tx_company: ICompany;
	tx_assessment_category: ICategory;
}

export interface IGetRiskChartParameters extends IIntentParameters {
	tx_assessment_type: IType;
	tx_company: ICompany;
}

export interface IGetRisksParameters extends IIntentParameters {
	tx_assessment_type: IType;
	tx_company?: ICompany;
}

export interface IGetTopFindingsParameters extends IIntentParameters {
	tx_assessment_type: IType;
}

export interface IGetTopMeasuresParameters extends IIntentParameters {
	tx_assessment_type: IType;
}

export interface IGetEntityInfoParameters extends IIntentParameters {
	tx_assessment_type: IType;
	tx_company: ICompany;
}

export interface IGetRiskEpicsParameters extends IIntentParameters {
	tx_assessment_type: IType;
	tx_company: ICompany;
}

export interface IGetRiskRatingsParameters extends IIntentParameters {
	tx_assessment_type: IType;
	tx_company: ICompany;
}

export interface IGetIncidentsParameters extends IIntentParameters {
	tx_compamy: ICompany;
	date_time: IDateTime;
}

export interface IGetHighlightsParameters extends IIntentParameters {
	tx_compamy: ICompany;
	date_time: IDateTime;
}

export interface IGetNewsParameters extends IIntentParameters {
	tx_compamy: ICompany;
	date_time: IDateTime;
}

export interface IHelpData {
	title: string;
	message: string;
	hasImage: boolean;
	image?: string;
}

export type IAssessmentCategory = 'entity info' | 'risk chart' | 'risk ratings' | 'risk epics';

export interface Incident {
	id: string;
	type: 'incident';
	date: string;
	text: string;
}

export interface Highlight {
	id: string;
	type: 'highlight';
	date: string;
	text: string;
}

export type TypeFilter = 'all' | 'incident' | 'highlight';
export type DateFilter = /*'all' | */ 'currentMonth' | 'previousMonth' | 'currentYear' | 'previousYear';

export interface GetNewsResponseItem {
	name: ICompany;
	id: number;
	type: 'entity' | 'organization';
	parentId: number;
	incidents: (Incident | Highlight)[];
	currentMonthIncidents: number;
	currentMonthHighlights: number;
	incidentsCount: number;
	highLightCount: number;
}

export interface GetIncidentsResponseItem {
	name: ICompany;
	id: number;
	type: 'entity' | 'organization';
	parentId: number;
	incidents: Incident[];
	currentMonthIncidents: number;
	currentMonthHighlights: number;
	incidentsCount: number;
	highLightCount: number;
}

export interface GetHighlightsResponseItem {
	name: ICompany;
	id: number;
	type: 'entity' | 'organization';
	parentId: number;
	incidents: Highlight[];
	currentMonthIncidents: number;
	currentMonthHighlights: number;
	incidentsCount: number;
	highLightCount: number;
}

export type GetNewsResponse = GetNewsResponseItem[];
export type GetIncidentsResponse = GetIncidentsResponseItem[];
export type GetHighlightsResponse = GetHighlightsResponseItem[];

export interface OktaAccessTokenResponse {
	token_type: 'Bearer';
	expires_in: number;
	access_token: string;
	scope: 'groups';
}
