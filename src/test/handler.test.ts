const mockedSlackMessageHandler = jest.fn();

jest.mock('../slack/handlers/slackMessageHandler', () => ({
	slackMessageHandler: mockedSlackMessageHandler,
}));

const mockedIsSlackEvent = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(false);

jest.mock('../slack/isSlackEvent', () => ({
	isSlackEvent: mockedIsSlackEvent,
}));

import { Context } from 'aws-lambda';
import { slackevent } from '../../handler';
import { ISlackEvent, ISlackEventCallback, IWarmupEvent } from '../interfaces';
import { mockSlackEventCallback } from './data/slackEventCallback';
import { HTTP200 } from '../responses';

describe('Testing slackevent handler function', () => {
	it('should call the slackMessageHandler and respond with a HTTP 200 OK response', () => {
		const mockedEventCallback: ISlackEventCallback = mockSlackEventCallback();
		const event: ISlackEvent = { body: JSON.stringify(mockedEventCallback) };
		const callback = jest.fn();
		const http200Response = HTTP200();

		slackevent(event, {} as Context, callback);

		expect(mockedSlackMessageHandler).toHaveBeenLastCalledWith(mockedEventCallback.event);
		expect(callback).toHaveBeenCalledWith(null, http200Response);
	});

	it('should ignore the warmup event and respond with a HTTP 200 OK response', () => {
		const mockedWarmupEvent: IWarmupEvent = { source: 'serverless-plugin-warmup' };
		const callback = jest.fn();
		const http200Response = HTTP200();

		slackevent(mockedWarmupEvent, {} as Context, callback);

		expect(callback).toHaveBeenCalledWith(null, http200Response);
	});
});
