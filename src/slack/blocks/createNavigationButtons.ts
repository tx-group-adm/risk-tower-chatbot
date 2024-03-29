import { ActionsBlock, Button, KnownBlock } from '@slack/web-api';
import { IHelpData } from '../../interfaces';
import { QUESTIONS } from './data';

export function createNavigationButtons(helpData: IHelpData): KnownBlock[] {
	const blocks: KnownBlock[] = [];
	const actionsBlock: ActionsBlock = {
		type: 'actions',
		elements: [],
	};

	if (QUESTIONS.indexOf(helpData.title) > 0) {
		const previousButton: Button = {
			type: 'button',
			text: {
				type: 'plain_text',
				text: '← Previous',
				emoji: true,
			},
			value: QUESTIONS[QUESTIONS.indexOf(helpData.title) - 1],
			action_id: 'previous-button',
		};
		actionsBlock.elements.push(previousButton);
	}

	if (QUESTIONS.indexOf(helpData.title) < QUESTIONS.length - 1) {
		const nextButton: Button = {
			type: 'button',
			text: {
				type: 'plain_text',
				text: 'Next →',
				emoji: true,
			},
			value: QUESTIONS[QUESTIONS.indexOf(helpData.title) + 1],
			action_id: 'next-button',
		};
		actionsBlock.elements.push(nextButton);
	}

	blocks.push(actionsBlock);

	return blocks;
}
