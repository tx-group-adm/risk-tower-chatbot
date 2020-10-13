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

export type IEvent = ISlackEvent | IWarmupEvent;

export interface ISlackEvent {
	body: string;
}

export interface ISlackUrlVerificationEvent {
	token: string;
	challenge: string;
	type: 'url_verification';
}

export interface ISlackEventCallback {
	type: 'event_callback';
	event: ISlackMessageIMEvent;
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	[index: string]: any;
}

export interface ISlackMessageEvent {
	type: string;
	channel: string;
	user: string;
	text: string;
	ts: string;
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	[index: string]: any;
}

export interface ISlackMessageIMEvent extends ISlackMessageEvent {
	event_ts: string;
	channel_type: string;
}

export interface IWarmupEvent {
	source: string;
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
