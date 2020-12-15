import axios, { AxiosError } from 'axios';
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
	RiskRatingData,
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

		console.log(`Getting jira tickes. company:${company}, type:${type}`);

		try {
			const response = await axios.get(url, CONFIG);
			return (response.data.jiraTickets || []) as IJiraTicket[];
		} catch (err) {
			console.log(err);
			const error = err as AxiosError;
			console.log(JSON.stringify(error.response?.data));

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

	static async getEntityInfo(
		type: IType,
		company: ICompany
	): Promise<{
		entityName: string;
		assessmentDate: string;
		assessorName: string;
		entityWeight: string;
	}> {
		return {
			entityName: company,
			assessmentDate: '01.01.2020',
			assessorName: 'Jira: GEN JiraAPI-PMD',
			entityWeight: 'medium',
		};
	}

	static async getRiskRatings(type: IType, company: ICompany, roles: IRole[]): Promise<RiskRatingData> {
		console.log(type, company, roles);

		// TODO: Implement API call
		// 1. get type, company and roles
		// 2. get assessment data with type, company and roles
		// 3. get assessment id
		// 4. get risk ratings with type, assessment id and roles

		// const assessment: IAssessment = await DataService.getAssessmentData(type, roles, company);
		// const assessmentId = assessment.assessmentId;

		// api call goes here

		const mockData: RiskRatingData = {
			assessment: {
				areas: {
					0: {
						config: {
							name: 'Mock Risks 1',
							ratings: [
								{
									areaAssessment: 'Mock Risks',
									criticality: 1,
									epicKey: 'MOCK-KEY',
									epicLink: 'https://jira.tx.group',
									epicProposal: {
										description: 'Mock description',
										name: 'Mock name',
										stories: [
											{
												name: 'Do mock stuff 1',
												description: 'do mock stuff description 1',
											},
											{
												name: 'Do mock stuff 2',
												description: 'do mock stuff description 2',
											},
										],
									},
									epicStatus: 'To Do',
									stories: ['MOCK-STORY-1', 'MOCK-STORY-2'],
								},
							],
							type: 'impact',
						},
						rating: 1,
						ratingIndex: 0,
						ratingType: 'impact',
					},
					1: {
						config: {
							name: 'Mock Risks 2',
							ratings: [
								{
									areaAssessment: 'Mock Risks',
									criticality: 1,
									epicKey: 'MOCK-KEY',
									epicLink: 'https://jira.tx.group',
									epicProposal: {
										description: 'Mock description',
										name: 'Mock name',
										stories: [
											{
												name: 'Do mock stuff 3',
												description: 'do mock stuff description 3',
											},
											{
												name: 'Do mock stuff 4',
												description: 'do mock stuff description 4',
											},
										],
									},
									epicStatus: 'To Do',
									stories: ['MOCK-STORY-1', 'MOCK-STORY-2'],
								},
							],
							type: 'impact',
						},
						rating: 1,
						ratingIndex: 0,
						ratingType: 'impact',
					},
				},
				createdAt: 123,
				dataType: 'latest',
				entityName: 'TX Group',
				id: 'mock-id-123',
				sourceType: 'security',
				updatedAt: 123,
				user: 'Mock user',
				weight: 1,
			},
			companies: [{ entityName: 'TX Group', id: 'mock-id-123' }],
			history: [],
			ratings: {
				impact: 1,
				probability: 1,
			},
		};

		return mockData;
	}
}
