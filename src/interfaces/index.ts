export interface HandlerResponse {
	statusCode: number;
	headers?: {
		[header: string]: string | number | boolean;
	};
	multiValueHeaders?: {
		[headerName: string]: Array<string>;
	};
	body?: string | false;
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
	type: string;
	channel: string;
	user: string;
	text: string;
	ts: string;
	event_ts: string;
	channel_type: string;
	bot_id?: string;
	upload?: boolean;
}

export interface ISLackProfile {
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
