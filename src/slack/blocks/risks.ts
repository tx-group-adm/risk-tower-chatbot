import { Button, KnownBlock } from '@slack/web-api';
import { IAssessment, ICompany, IOrganisation, IType } from '../../interfaces';

export function createRisksBlock(
	type: IType,
	company: ICompany,
	url: string,
	children: Array<IOrganisation | IAssessment>
): Array<KnownBlock> {
	const _type = type.charAt(0).toUpperCase() + type.slice(1);
	const options: Array<{
		displayText: string;
		value: string;
	}> = children.map((child) => {
		switch (child.type) {
			case 'organisation':
				return {
					displayText: child.name,
					value: `Show me ${type} risks for ${child.name}.`,
				};

			case 'entity':
				return {
					displayText: child.name,
					value: `Show me ${type} assessment data for ${child.name}.`,
				};

			default:
				throw new Error(`unknown type: ${child.type}`);
		}
	});

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
			elements: options.map(
				(option): Button => ({
					type: 'button',
					text: {
						type: 'plain_text',
						text: option.displayText,
					},
					value: option.value,
				})
			),
		},
	];
}
