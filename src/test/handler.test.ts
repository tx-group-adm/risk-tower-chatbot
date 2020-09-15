import { handler } from '../index';

describe('Testing handler function', () => {
	it('should return the default 200 OK response', () => {
		const event: { body: string } = {
			body: JSON.stringify({
				message: 'Hello World',
			}),
		};

		expect(handler(event)).toEqual({
			statusCode: 200,
			body: '',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	});
});
