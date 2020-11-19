const mockedGetEmailForUser = jest.fn().mockReturnValue('email');

const mockedSlackService = jest.fn().mockImplementation(() => ({
	getEmailForUser: mockedGetEmailForUser,
}));

jest.mock('../services/SlackService', () => mockedSlackService);

const mockedGetAssessmentDataResponse: Partial<IDetectIntentResponseData> = {
	intentName: 'GetAssessmentData',
};

const mockedGetHelpResponse: Partial<IDetectIntentResponseData> = {
	intentName: 'GetHelp',
};

const mockedGetRisksResponse: Partial<IDetectIntentResponseData> = {
	intentName: 'GetRisks',
};

const mockedGetTopFindingsResponse: Partial<IDetectIntentResponseData> = {
	intentName: 'GetTopFindings',
};

const mockedGetTopMeasuresResponse: Partial<IDetectIntentResponseData> = {
	intentName: 'GetTopMeasures',
};

const mockedProcessTextMessage = jest
	.fn()
	.mockReturnValueOnce(mockedGetAssessmentDataResponse)
	.mockReturnValueOnce(mockedGetHelpResponse)
	.mockReturnValueOnce(mockedGetRisksResponse)
	.mockReturnValueOnce(mockedGetTopFindingsResponse)
	.mockReturnValueOnce(mockedGetTopMeasuresResponse);

const mockedDialogflowService = jest.fn().mockImplementation(() => ({
	processTextMessage: mockedProcessTextMessage,
}));

jest.mock('../services/DialogflowService', () => mockedDialogflowService);

import { IDetectIntentResponseData, ISlackMessageIMEvent } from '../interfaces';

const { INTENTS } = jest.requireActual('../handlers');
const mockedHandleGetAssessmentData = jest.fn();
const mockedHandleGetHelp = jest.fn();
const mockedHandleGetRisks = jest.fn();
const mockedHandleGetTopFindings = jest.fn();
const mockedHandleGetTopMeasures = jest.fn();

jest.mock('../handlers', () => ({
	INTENTS,
	handleGetAssessmentData: mockedHandleGetAssessmentData,
	handleGetHelp: mockedHandleGetHelp,
	handleGetRisks: mockedHandleGetRisks,
	handleGetTopFindings: mockedHandleGetTopFindings,
	handleGetTopMeasures: mockedHandleGetTopMeasures,
}));

import { slackMessageHandler } from '../slack/handlers/slackMessageHandler';

describe('Testing the slackMessageHandler function', () => {
	it('should ignore the bot event and return', async () => {
		const botEvent: Partial<ISlackMessageIMEvent> = {
			bot_id: 'bot123',
		};

		await slackMessageHandler(botEvent as ISlackMessageIMEvent);

		expect(mockedGetEmailForUser).not.toHaveBeenCalled();
	});

	it('should ignore the upload event and return', async () => {
		const uploadEvent: Partial<ISlackMessageIMEvent> = {
			upload: true,
		};

		await slackMessageHandler(uploadEvent as ISlackMessageIMEvent);

		expect(mockedGetEmailForUser).not.toHaveBeenCalled();
	});

	it('should call the handleGetAssessmentData function', async () => {
		const event: Partial<ISlackMessageIMEvent> = {
			user: 'user',
			text: 'text',
		};

		await slackMessageHandler(event as ISlackMessageIMEvent);

		expect(mockedHandleGetAssessmentData).toHaveBeenCalledWith(
			mockedGetAssessmentDataResponse,
			new mockedSlackService()
		);
	});

	it('should call the handleGetHelp function', async () => {
		const event: Partial<ISlackMessageIMEvent> = {
			user: 'user',
			text: 'text',
		};

		await slackMessageHandler(event as ISlackMessageIMEvent);

		expect(mockedHandleGetHelp).toHaveBeenCalledWith(mockedGetHelpResponse, new mockedSlackService());
	});

	it('should call the handleGetRisks function', async () => {
		const event: Partial<ISlackMessageIMEvent> = {
			user: 'user',
			text: 'text',
		};

		await slackMessageHandler(event as ISlackMessageIMEvent);

		expect(mockedHandleGetRisks).toHaveBeenCalledWith(mockedGetRisksResponse, new mockedSlackService());
	});

	it('should call the handleGetTopFindings function', async () => {
		const event: Partial<ISlackMessageIMEvent> = {
			user: 'user',
			text: 'text',
		};

		await slackMessageHandler(event as ISlackMessageIMEvent);

		expect(mockedHandleGetTopFindings).toHaveBeenCalledWith(mockedGetTopFindingsResponse, new mockedSlackService());
	});

	it('should call the handleGetTopMeasures function', async () => {
		const event: Partial<ISlackMessageIMEvent> = {
			user: 'user',
			text: 'text',
		};

		await slackMessageHandler(event as ISlackMessageIMEvent);

		expect(mockedHandleGetTopMeasures).toHaveBeenCalledWith(mockedGetTopMeasuresResponse, new mockedSlackService());
	});
});
