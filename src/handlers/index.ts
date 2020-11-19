export const INTENTS = {
	GET_ASSESSMENT_DATA: 'GetAssessmentData',
	GET_HELP: 'GetHelp',
	GET_RISKS: 'GetRisks',
	GET_TOP_FINDINGS: 'GetTopFindings',
	GET_TOP_MEASURES: 'GetTopMeasures',
	DEFAULT_WELCOME: 'Default Welcome Intent',
	DEFAULT_FALLBACK: 'Default Fallback Intent',
};

export { handleGetAssessmentData } from './handleGetAssessmentData';
export { handleGetHelp } from './handleGetHelp';
export { handleGetRisks } from './handleGetRisks';
export { handleGetTopFindings } from './handleGetTopFindings';
export { handleGetTopMeasures } from './handleGetTopMeasures';
