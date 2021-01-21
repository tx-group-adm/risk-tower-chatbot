import { ITopFinding, ITopMeasure } from '../../../interfaces';
import { getRiskLevelEmojiByCriticality } from './emoji';

function createTopFindingsOrMeasuresText(item: ITopFinding | ITopMeasure): string {
	const riskLevelEmoji = getRiskLevelEmojiByCriticality(item[1].criticality);
	const textValue = item[0];
	const configName = item[1].configName[0];

	const text = `${riskLevelEmoji} *${textValue}* _(${configName})_`;

	return text;
}

export const createTopFindingsText = createTopFindingsOrMeasuresText;
export const createTopMeasuresText = createTopFindingsOrMeasuresText;
