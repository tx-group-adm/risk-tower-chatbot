import { slackify } from '../utils/slackify';
import { mockSlackMessageIMEvent } from './data/mockSlackMessageIMEvent';

describe('Testing slackify util function', () => {
	it('Should return a string with the embeded user and channel', () => {
		const mockedIMEvent = mockSlackMessageIMEvent();
		const message = slackify(mockedIMEvent.text, mockedIMEvent);
		expect(message).toEqual('Dear <@Testuser123>, welcome to the channel <#my-channel>!');
	});
});
