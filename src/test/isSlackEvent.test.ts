import { IEvent } from '../interfaces';
import { isSlackEvent } from '../slack/isSlackEvent';

describe('Testing isSlackEvent function', () => {
	it('should return true', () => {
		const event: IEvent = {
			body: 'bla',
		};

		expect(isSlackEvent(event)).toEqual(true);
	});
	it('should return false', () => {
		const event: IEvent = {
			source: 'bla',
		};
		expect(isSlackEvent(event)).toEqual(false);
	});
});
