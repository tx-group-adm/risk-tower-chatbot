export interface HandlerResponse {
	statusCode?: number;
	headers?: {
		//eslint-disable-next-line @typescript-eslint/no-explicit-any
		[header: string]: any;
	};
	body?: string;
	challenge?: string;
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
	message: string;
}
