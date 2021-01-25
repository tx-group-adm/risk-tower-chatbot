import axios, { AxiosError } from 'axios';
import { TreeItemNotFoundError } from '../errors/TreeItemNotFoundError';
import {
	IAssessment,
	ICompany,
	IHierarchyTreeItem,
	IJiraTicket,
	IRole,
	IType,
	ITopFinding,
	ITopMeasure,
	IOrganisation,
	IRiskResponse,
	RiskRatingData,
	RiskArea,
} from '../interfaces';

const URL_PREFIX = process.env.STAGE === 'prod' ? 'security' : 'security-dev';
const BASE_URL = `https://${URL_PREFIX}.tx.group/api`;
const CONFIG = { headers: { 'Content-Type': 'application/json' } };

import RiskTowerService from './RiskTowerService';

export default class DataService {
	static async getHierarchyTree(): Promise<IHierarchyTreeItem[]> {
		const url = `${BASE_URL}/entity/hierarchy/tree`;

		try {
			const response = await axios.get(url, CONFIG);
			return response.data as IHierarchyTreeItem[];
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getRolesForUser(email: string): Promise<IRole[]> {
		const url = `${BASE_URL}/user/roles?email=${email}`;

		try {
			const response = await axios.get(url, CONFIG);
			return response.data as IRole[];
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getAssessmentData(type: IType, roles: IRole[], company: ICompany): Promise<IAssessment> {
		const url = `${BASE_URL}/entity/assessments`;

		try {
			const response = await axios.post(url, { type, roles, company }, CONFIG);
			return response.data.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getAllAssessmentTypes(): Promise<IType[]> {
		const url = `${BASE_URL}/all-types`;

		try {
			const response = await axios.get(url, CONFIG);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getJiraTickets(company: ICompany, type: IType): Promise<IJiraTicket[]> {
		const url = `${BASE_URL}/jira-tickets?companyName=${company}&type=${type}`;

		console.log(`Getting jira tickes. company:${company}, type:${type}`);

		try {
			const response = await axios.get(url, CONFIG);
			return response.data.jiraTickets as IJiraTicket[];
		} catch (err) {
			const error = err as AxiosError;
			console.log(error.response?.data.message);
			if (error.response?.data.message === "Jira tickets don't exist for set values") {
				return [];
			} else {
				throw err;
			}
		}
	}

	static async getRisks(type: IType, company: ICompany, roles: IRole[]): Promise<IRiskResponse> {
		const url = `${BASE_URL}/chart/assessments`;
		const response = await axios.post(url, {
			type,
			roles,
		});

		const tree = response.data.tree as IOrganisation | IAssessment;

		const topLevelCompany = RiskTowerService.getTreeItem(company, tree);
		if (!topLevelCompany) {
			throw new TreeItemNotFoundError(`${company} was not found in ${type} tree`);
		}
		switch (topLevelCompany.type) {
			case 'organisation':
				return {
					type: 'organisation',
					children: topLevelCompany.children,
				};

			case 'entity':
				return {
					type: 'entity',
					assessment: topLevelCompany,
				};

			default:
				throw new Error(`unknown type`);
		}
	}

	static async getTopFindings(type: IType, roles: IRole[]): Promise<ITopFinding[]> {
		const url = `${BASE_URL}/chart/assessments`;
		const response = await axios.post(url, {
			type,
			roles,
		});
		const findings = response.data.topEpics.sortedAreas as ITopFinding[];

		return findings;
	}

	static async getTopMeasures(type: IType, roles: IRole[]): Promise<ITopMeasure[]> {
		const url = `${BASE_URL}/chart/assessments`;
		const response = await axios.post(url, {
			type,
			roles,
		});
		const measures = response.data.topEpics.sortedEpics as ITopMeasure[];

		return measures;
	}

	static async getEntityInfo(
		type: IType,
		roles: IRole[],
		company: ICompany
	): Promise<{
		entityName: string;
		assessmentDate: string;
		assessorName: string;
		entityWeight: number;
	}> {
		console.log(`getting ${type} entity info about ${company}`);

		try {
			const data = await DataService.getAssessmentData(type, roles, company);

			console.log(JSON.stringify(data));

			return {
				entityName: data.name,
				assessmentDate: data.lastAccessed,
				assessorName: data.user,
				entityWeight: data.weight,
			};
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getRiskRatings(type: IType, company: ICompany, roles: IRole[]): Promise<RiskArea[]> {
		const url = `${BASE_URL}/chart/risk-ratings`;

		try {
			const assessment: IAssessment = await DataService.getAssessmentData(type, roles, company);

			console.log(JSON.stringify(assessment));

			const id = assessment.assessmentId;

			const riskRatings: RiskRatingData = (
				await axios.post(url, {
					type,
					roles,
					id,
				})
			).data;

			console.log(riskRatings);

			return Object.values(riskRatings.assessment.areas);
		} catch (err) {
			console.log(err);
			return [];
		}
	}
}
