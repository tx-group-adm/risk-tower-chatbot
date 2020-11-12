import { Struct } from 'pb-util';

export interface SessionsClientv2 {
	projectAgentSessionPath(project: string, session: string): string;
	detectIntent(
		request: DetectIntentRequest
		// eslint-disable-next-line @typescript-eslint/ban-types
	): Promise<[DetectIntentResponse, DetectIntentRequest | undefined, {} | undefined]>;
}

export interface ClientOptions {
	credentials: {
		private_key: string;
		client_email: string;
	};
	// eslint-disable-next-line @typescript-eslint/ban-types
	[index: string]: string | number | undefined | {};
}

export interface DetectIntentResponse {
	responseId?: string;
	queryResult: QueryResult;
	// webhookStatus?: google.rpc.IStatus | null;
	// outputAudio?: Uint8Array | string | null;
	// outputAudioConfig?: google.cloud.dialogflow.v2.IOutputAudioConfig | null;
}

export interface DetectIntentRequest {
	session?: string;
	queryParams?: QueryParameters;
	queryInput?: QueryInput;
	// outputAudioConfig?: OutputAudioConfig;
	// outputAudioConfigMask?: FieldMask;
	// inputAudio?: Uint8Array | string;
}

export interface QueryParameters {
	timeZone?: string;
	resetContexts?: boolean;
	payload?: Struct;
	// sentimentAnalysisRequestConfig?: (google.cloud.dialogflow.v2.ISentimentAnalysisRequestConfig|null);
	// geoLocation?: (google.type.ILatLng|null);
	// contexts?: (google.cloud.dialogflow.v2.IContext[]|null);
	// sessionEntityTypes?: (google.cloud.dialogflow.v2.ISessionEntityType[]|null);
}

export interface QueryInput {
	text?: {
		text?: string;
		languageCode?: string;
	};
	// audioConfig?: (google.cloud.dialogflow.v2.IInputAudioConfig|null);
	// event?: (google.cloud.dialogflow.v2.IEventInput|null);
}

export interface QueryResult {
	queryText?: string;
	languageCode?: string;
	speechRecognitionConfidence?: number;
	action?: string;
	parameters: Struct;
	allRequiredParamsPresent: boolean;
	fulfillmentText?: string;
	fulfillmentMessages: Array<Message>;
	webhookSource?: string;
	webhookPayload: Struct;
	intentDetectionConfidence?: number;
	diagnosticInfo?: Struct;
	// outputContexts?: google.cloud.dialogflow.v2.IContext[] | null;
	// intent?: google.cloud.dialogflow.v2.IIntent | null;
	// sentimentAnalysisResult?: google.cloud.dialogflow.v2.ISentimentAnalysisResult | null;
}

export interface Message {
	text: {
		text?: string;
		languageCode?: string;
	};
	payload?: Struct;
	// image?: google.cloud.dialogflow.v2.Intent.Message.IImage | null;
	// quickReplies?: google.cloud.dialogflow.v2.Intent.Message.IQuickReplies | null;
	// card?: google.cloud.dialogflow.v2.Intent.Message.ICard | null;
	// simpleResponses?: google.cloud.dialogflow.v2.Intent.Message.ISimpleResponses | null;
	// basicCard?: google.cloud.dialogflow.v2.Intent.Message.IBasicCard | null;
	// suggestions?: google.cloud.dialogflow.v2.Intent.Message.ISuggestions | null;
	// linkOutSuggestion?: google.cloud.dialogflow.v2.Intent.Message.ILinkOutSuggestion | null;
	// listSelect?: google.cloud.dialogflow.v2.Intent.Message.IListSelect | null;
	// carouselSelect?: google.cloud.dialogflow.v2.Intent.Message.ICarouselSelect | null;
	// browseCarouselCard?: google.cloud.dialogflow.v2.Intent.Message.IBrowseCarouselCard | null;
	// tableCard?: google.cloud.dialogflow.v2.Intent.Message.ITableCard | null;
	// mediaContent?: google.cloud.dialogflow.v2.Intent.Message.IMediaContent | null;
	// platform?:
	// 	| google.cloud.dialogflow.v2.Intent.Message.Platform
	// 	| keyof typeof google.cloud.dialogflow.v2.Intent.Message.Platform
	// 	| null;
}
