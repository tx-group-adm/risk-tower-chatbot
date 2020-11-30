import axios from 'axios';
import {
	IAssessment,
	ICompany,
	IHierarchyItem,
	IJiraTicket,
	IRole,
	IType,
	ITopFinding,
	ITopMeasure,
	IOrganisation,
	IRiskResponse,
} from '../interfaces';

const URL_PREFIX = process.env.STAGE === 'prod' ? 'security' : 'security-dev';
const BASE_URL = `https://${URL_PREFIX}.tx.group/api`;
const CONFIG = { headers: { 'Content-Type': 'application/json' } };

import RiskTowerService from './RiskTowerService';

export default class DataService {
	static async getHierarchyTree(): Promise<IHierarchyItem[]> {
		const url = `${BASE_URL}/entity/hierarchy/tree`;

		try {
			const response = await axios.get(url, CONFIG);
			return response.data as IHierarchyItem[];
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

		try {
			const response = await axios.get(url, CONFIG);
			return (response.data.jiraTickets || []) as IJiraTicket[];
		} catch (err) {
			console.log(err);
			throw err;
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
			throw new Error("Couldn't find item in tree");
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
}
