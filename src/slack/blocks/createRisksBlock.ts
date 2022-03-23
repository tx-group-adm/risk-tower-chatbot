import { Button, KnownBlock } from '@slack/web-api';
import { IAssessment, ICompany, IOrganisation, IType } from '../../interfaces';
import { getRiskLevelEmojiByColor } from '../blocks/data/emoji';

export function createRisksBlock(
	type: IType,
	company: ICompany,
	url: string,
	children: Array<IOrganisation | IAssessment>,
	parentName: string | null
): KnownBlock[] {
	const _type = type.charAt(0).toUpperCase() + type.slice(1);
	const options: Array<{
		displayText: string;
		value: string;
		color: string;
	}> = children.map((child) => {
		switch (child.type) {
			case 'organisation':
				return {
					displayText: child.name,
					value: `Show me ${type} risks for ${child.name}.`,
					color: child.ratingColor,
				};

			case 'entity':
				return {
					displayText: child.name,
					value: `Show me ${type} risk chart for ${child.name}.`,
					color: child.ratingColor,
				};

			default:
				throw new Error(`unknown type: ${child.type}`);
		}
	});

	const elements: Button[] = options.map(
		(option, index): Button => ({
			type: 'button',
			text: {
				type: 'plain_text',
				text: `${getRiskLevelEmojiByColor(option.color)} ${option.displayText}`,
			},
			value: option.value,
			action_id: `quickreply_${index}`,
		})
	);

	if (parentName) {
		const drillUpButton: Button = {
			type: 'button',
			style: 'danger',
			text: {
				type: 'plain_text',
				text: '← Back',
			},
			value: `Show me ${type} risks for ${parentName}`,
			action_id: `quickreply_${elements.length}`,
		};
		elements.unshift(drillUpButton);
	}

	return [
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: `${_type} risks for ${company}`,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'image',
			image_url: url,
			alt_text: 'risks chart',
		},
		{
			type: 'divider',
		},
		{
			type: 'actions',
			elements,
		},
	];
}
