export interface HandlerResponse {
	isBase64Encoded: boolean;
	statusCode: number;
	headers: {
		//eslint-disable-next-line @typescript-eslint/no-explicit-any
		[header: string]: any;
	};
	body: string;
}
