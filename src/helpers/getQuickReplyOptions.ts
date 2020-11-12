import { ICompany, IType, IParameter } from '../interfaces';

const QUICKREPLIES: {
	TX_COMPANY: Array<ICompany>;
	TX_ASSESSMENT_TYPE: Array<IType>;
} = {
	TX_COMPANY: ['20 Minuten', 'Doodle', 'Ricardo', 'Tamedia', 'Tutti'],
	TX_ASSESSMENT_TYPE: ['compliance', 'privacy', 'security', 'soc2', 'technology'],
};

export const getQuickReplyOptions = (missingParameter: IParameter): Array<string> => {
	switch (missingParameter) {
		case 'tx_company':
			return QUICKREPLIES.TX_COMPANY;

		case 'tx_assessment_type':
			return QUICKREPLIES.TX_ASSESSMENT_TYPE;
	}
};
