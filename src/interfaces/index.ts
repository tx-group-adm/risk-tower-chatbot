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

export interface IWarmupEvent {
	source: string;
}

export type IEvent = ISlackEvent | IWarmupEvent;

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

export interface ISlackEventOnUsersBehalf {
	type: 'event_on_users_behalf';
	event: ISlackMessageIMEvent;
	displayText: string;
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

export type IParameter = 'tx_company' | 'tx_assessment_type' | 'tx_assessment_category';

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
	[index: string]: string | undefined;
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

export interface IHelpData {
	title: string;
	message: string;
	hasImage: boolean;
	image?: string;
}

export type IAssessmentCategory = 'entity info' | 'risk chart' | 'risk ratings' | 'risk epics';
