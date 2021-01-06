import { KnownBlock } from '@slack/web-api';
import { IHelpData } from '../../interfaces';
import { createHelpMessageMenu } from './createHelpMessageBlock';
import { createNavigationButtons } from './createNavigationButtons';

const IMAGE_URL = 'https://herafame.sirv.com/Images/';

export function createHelpDataBlock(helpData: IHelpData): KnownBlock[] {
	const blocks: KnownBlock[] = [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: helpData.title,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: helpData.message,
			},
		},
	];

	if (helpData.hasImage && helpData.image) {
		blocks.push({
			type: 'image',
			image_url: IMAGE_URL + helpData.image,
			alt_text: "image couldn't load",
		});
	}

	const navigationButtons = createNavigationButtons(helpData);
	const helpMenu = createHelpMessageMenu();

	return [...blocks, ...navigationButtons, ...helpMenu];
}
