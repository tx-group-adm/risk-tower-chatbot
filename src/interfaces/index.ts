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

export interface ISLackProfileResponse {
	ok: boolean;
	profile: {
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
	};
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
	payload: {
		[index: string]: unknown;
	};
	allRequiredParamsPresent: boolean;
	missingParameters: Array<IParameter>;
	intentName: string;
}

export type IParameter = 'tx_company' | 'tx_assessment_type';

export interface IAssessment {
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
}

export type ICompany =
	| 'TX Group'
	| 'Goldbach'
	| 'TX Markets'
	| 'Tutti'
	| 'Ricardo'
	| 'CarForYou'
	| 'Homegate'
	| 'Technology & Ventures'
	| 'TX Ventures'
	| 'Doodle'
	| 'Zattoo'
	| 'Olmero'
	| 'IT'
	| 'Digital Technology Services'
	| 'Coorporate Services'
	| '20 Minuten'
	| 'Tamedia'
	| 'Logistics & Printing'
	| 'Paid Media'
	| 'Goldbach entity'
	| 'Jobcloud'
	| 'Asana-test'
	| 'Neo Advertising'
	| 'DreiFive'
	| 'Corporate Services'
	| 'Paid Media';

export type IType = 'security' | 'privacy' | 'technology' | 'compliance' | 'soc2';
