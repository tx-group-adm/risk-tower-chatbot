import { slackevent } from '../../handler';
import { Context } from 'aws-lambda';
import { ISlackEventCallback, HandlerResponse } from '../interfaces';

describe('Testing handler function', () => {
	it('should return the default 200 OK response', async () => {
		const event: { body: string } = {
			body: JSON.stringify({
				type: 'event_callback',
				event: { body: '' },
			} as ISlackEventCallback),
		};

		const expectedEventCallbackResponse: HandlerResponse = {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
			},
			isBase64Encoded: false,
			body: '',
		};
		expect(await slackevent(event, {} as Context)).toEqual(expectedEventCallbackResponse);
	});
});
