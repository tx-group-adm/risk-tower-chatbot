import SlackService from '../../services/SlackService';

export async function errorHandler(slackService: SlackService): Promise<void> {
	const errorMessage =
		':warning:Oops, something went wrong there!:warning:\nWe are trying to fix the problem, please try again later.:hammer_and_wrench:';
	await slackService.postMessage(errorMessage);
}
