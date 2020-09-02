import { HandlerResponse } from './interfaces';

export const handler = (event: { body: string }): HandlerResponse => {
	console.log(`Received event: ${JSON.stringify(event)}`);

	return {
		body: 'Hello from AWS Lambda',
		statusCode: 200,
		headers: {
			'Content-Type': 'applicaton/json',
		},
		isBase64Encoded: false,
	};
};
