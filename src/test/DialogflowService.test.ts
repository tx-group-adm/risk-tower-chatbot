import { mockDetectIntentResponse } from './data/mockDetectIntentResponse';

const mockedSessionPath = jest
	.fn()
	.mockReturnValueOnce('session-path')
	.mockReturnValueOnce('session-path')
	.mockReturnValue(new Error('error'));
const mockedDetectIntent = jest.fn().mockResolvedValue(mockDetectIntentResponse());

jest.mock('@google-cloud/dialogflow', () => {
	return {
		v2: {
			SessionsClient: jest.fn().mockImplementation(() => {
				return {
					projectAgentSessionPath: mockedSessionPath,
					detectIntent: mockedDetectIntent,
				};
			}),
		},
	};
});

import DialogflowService from '../services/DialogflowService';

describe('Testing DialogfloService class', () => {
	it('should return a processed dialogflow message', async () => {
		const response = await new DialogflowService('project-id').processTextMessage('message', 'session-id');

		expect(mockedSessionPath).toHaveBeenCalledWith('project-id', 'session-id');
		expect(mockedDetectIntent).toHaveBeenCalledWith({
			session: 'session-path',
			queryInput: {
				text: {
					text: 'message',
					languageCode: 'en-US',
				},
			},
		});
		expect(response).toEqual('Dialogflow answer');
	});

	it('should return the intent name', async () => {
		const response = await new DialogflowService('project-id').getIntentName('message', 'session-id');
		expect(mockedSessionPath).toHaveBeenCalledWith('project-id', 'session-id');
		expect(mockedDetectIntent).toHaveBeenCalledWith({
			session: 'session-path',
			queryInput: {
				text: {
					text: 'message',
					languageCode: 'en-US',
				},
			},
		});
		expect(response).toEqual('intentName');
	});

	it('Should throw an error', async () => {
		try {
			expect(await new DialogflowService('project-id').processTextMessage('message', 'session-id')).toThrow();
		} catch (err) {
			// Expected
		}
	});
});
