import { channelify } from '../utils/channelify';
import { mockSlackMessageIMEvent } from './data/mockSlackMessageIMEvent';

describe('Testing channelify util function', () => {
	it('Should return a string with the embeded channel', () => {
		const mockedIMEvent = mockSlackMessageIMEvent();
		expect(channelify(mockedIMEvent.text, mockedIMEvent.channel)).toEqual(
			'Dear __user__, welcome to the channel <#my-channel>!'
		);
	});
});
