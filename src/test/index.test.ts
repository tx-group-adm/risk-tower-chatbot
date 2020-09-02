import { handler } from '../index';

describe('Testing index handler function', () => {
	it('should return the default 200 OK response', () => {
		const event: { body: string } = {
			body: JSON.stringify({
				message: 'Hello World',
			}),
		};

		expect(handler(event)).toEqual({
			body: 'Hello from AWS Lambda',
			statusCode: 200,
			headers: {
				'Content-Type': 'applicaton/json',
			},
			isBase64Encoded: false,
		});
	});
});
