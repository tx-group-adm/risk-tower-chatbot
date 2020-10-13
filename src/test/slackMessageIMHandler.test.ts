jest.mock('../services/DialogflowService');

const postMessage = jest.fn();

jest.mock('@slack/web-api', () => {
	return {
		WebClient: jest.fn().mockImplementation(() => {
			return {
				chat: {
					postMessage,
				},
				users: {
					profile: {
						get: jest.fn(),
					},
				},
			};
		}),
	};
});

import { slackMessageIMHandler } from '../handlers/slackMessageIMHandler';
import { mockSlackMessageIMEvent } from './data/mockSlackMessageIMEvent';
import DialogflowService from '../services/DialogflowService';

const old_env = process.env;

const MockedDialogflowService = DialogflowService as jest.Mocked<typeof DialogflowService>;
MockedDialogflowService.prototype.processTextMessage = jest
	.fn()
	.mockResolvedValue('Dear __user__, welcome to the channel __channel__!');

describe('Testing the slackMessageIMHandler function', () => {
	beforeEach(() => {
		jest.resetModules();
		process.env = old_env;
		delete process.env.DIALOGFLOW_PROJECT_ID;
		delete process.env.SLACK_BOT_TOKEN;
	});

	afterEach(() => {
		process.env = old_env;
	});

	it('Should receive an event, process it and send back an answer to the user', async () => {
		process.env.DIALOGFLOW_PROJECT_ID = '123';
		process.env.SLACK_BOT_TOKEN = 'token';

		const mockedIMEvent = mockSlackMessageIMEvent();

		await slackMessageIMHandler(mockedIMEvent);

		expect(MockedDialogflowService.prototype.processTextMessage).toHaveBeenCalledWith(
			mockedIMEvent.text,
			mockedIMEvent.user,
			'user@tx.group'
		);

		expect(postMessage).toHaveBeenCalledWith({
			channel: mockedIMEvent.channel,
			text: `Dear <@${mockedIMEvent.user}>, welcome to the channel <#${mockedIMEvent.channel}>!`,
		});
	});

	it('should ignore message events which are from the bot himself', async () => {
		process.env.DIALOGFLOW_PROJECT_ID = '123';
		process.env.SLACK_BOT_TOKEN = 'token';
		const fakeLog = jest.fn();
		global.console.log = fakeLog;
		const botEvent = mockSlackMessageIMEvent();
		botEvent.bot_id = '123';

		await slackMessageIMHandler(botEvent);

		expect(fakeLog).toHaveBeenCalledWith('ignore bot event');
	});
});
