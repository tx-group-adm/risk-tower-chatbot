import { slackevent } from '../../handler';
import { Context } from 'aws-lambda';

describe('Testing handler function', () => {
	it('should return the default 200 OK response', () => {
		const event: { body: string } = {
			body: JSON.stringify({
				message: 'Hello World',
			}),
		};

		expect(slackevent(event, {} as Context)).toEqual({
			statusCode: 200,
			body: '',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	});
});
