import { IDetectIntentResponseData } from '../../interfaces';
import SlackService from '../../services/SlackService';
import { Lambda } from 'aws-sdk';
import { InvocationRequest } from 'aws-sdk/clients/lambda';

export async function handleUpdateCompanies(
	response: IDetectIntentResponseData,
	slackService: SlackService
): Promise<void> {
	// invoke update-dialogflow-companies lambda
	const lambda = new Lambda({
		region: 'eu-central-1',
	});

	const eventsApiLambdaName = `risk-tower-chatbot-${process.env.STAGE}-slackevent`;
	const params: InvocationRequest = {
		FunctionName: eventsApiLambdaName,
		InvocationType: 'Event',
	};
	await lambda.invoke(params).promise();

	await slackService.postMessage('Successfuly updated the company entity in dialogflow!');
}
