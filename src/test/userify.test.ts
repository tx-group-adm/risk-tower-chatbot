import { userify } from '../utils/userify';
import { mockSlackMessageIMEvent } from './data/mockSlackMessageIMEvent';

describe('Testing userify util function', () => {
	it('Should return a string with the embeded user', () => {
		const mockedIMEvent = mockSlackMessageIMEvent();
		expect(userify(mockedIMEvent.text, mockedIMEvent.user)).toEqual(
			'Dear <@Testuser123>, welcome to the channel __channel__!'
		);
	});
});
