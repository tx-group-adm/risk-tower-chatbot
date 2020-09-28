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

export interface ISlackUrlVerificationEvent {
	token: string;
	challenge: string;
	type: 'url_verification';
}

export interface ISlackEventCallback {
	type: 'event_callback';
	event: ISlackEvent;
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	[index: string]: any;
}

export type IEvent = ISlackEvent | IWarmupEvent;

export interface ISlackEvent {
	body: string;
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
