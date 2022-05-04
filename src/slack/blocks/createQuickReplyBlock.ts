import { Button, KnownBlock } from '@slack/web-api';
import { ICategory, IParameter, IType } from '../../interfaces';
import DataService from '../../services/DataService';

const QUICKREPLIES: {
	tx_assessment_type: IType[];
	tx_assessment_category: ICategory[];
} = {
	tx_assessment_type: ['privacy', 'security', 'technology'],
	tx_assessment_category: ['entity info', 'risk chart', 'risk ratings', 'risk epics'],
};

export async function getQuickReplyOptionsFor(
	missingParameter: IParameter,
	parameters: { [index: string]: string }
): Promise<string[]> {
	if (missingParameter === 'date_time') return [];
	if (missingParameter === 'tx_company') {
		// Get all companies
		const interestingCompanies = (await DataService.getHierarchyTree())
			// Only keep companies that have assessment, that have assessment of the provided type and that are not the top level company
			.filter(
				(company) =>
					company.hasAssessment && company.assessmentType.includes(parameters.tx_assessment_type) && !!company.parentId
			)
			// Sort these companies by parentId so the biggest ones come first
			.sort((first, second) => first.parentId - second.parentId)
			// Take the names of the companies
			.map((company) => company.name)
			// Take the first 5 names
			.slice(0, 5);

		return interestingCompanies;
	}
	return QUICKREPLIES[missingParameter];
}

export const createQuickReplyBlock = (message: string, options: Array<string>): Array<KnownBlock> => {
	return [
		{
			type: 'section',
			text: {
				type: 'plain_text',
				text: message,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'actions',
			elements: options.map(
				(option, i): Button => ({
					action_id: `quickreply_${i}`,
					type: 'button',
					text: {
						type: 'plain_text',
						text: option,
					},
					value: option,
				})
			),
		},
	];
};

export const createDateDropdownBlock = (message: string): KnownBlock[] => {
	return [
		{
			type: 'section',
			text: {
				type: 'plain_text',
				text: message,
			},
		},
		{
			type: 'actions',
			elements: [
				{
					action_id: 'date_dropdown',
					type: 'static_select',
					placeholder: {
						type: 'plain_text',
						text: 'Choose a time span',
					},
					options: [
						{
							text: {
								type: 'plain_text',
								text: 'Current month',
							},
							value: 'current month',
						},
						{
							text: {
								type: 'plain_text',
								text: 'Last month',
							},
							value: 'last month',
						},
						{
							text: {
								type: 'plain_text',
								text: 'Current year',
							},
							value: 'current year',
						},
						{
							text: {
								type: 'plain_text',
								text: 'Last year',
							},
							value: 'last year',
						},
					],
				},
			],
		},
	];
};
