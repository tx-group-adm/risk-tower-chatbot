import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { URLSearchParams } from 'url';
import { TreeItemNotFoundError } from '../errors/TreeItemNotFoundError';
import {
	IAssessment,
	ICompany,
	IHierarchyTreeItem,
	IJiraTicket,
	IType,
	ITopFinding,
	ITopMeasure,
	IOrganisation,
	IRiskResponse,
	RiskRatingData,
	RiskArea,
	IRoles,
	Incident,
	Highlight,
	DateFilter,
	TypeFilter,
	GetNewsResponse,
	GetIncidentsResponse,
	GetHighlightsResponse,
	OktaAccessTokenResponse,
} from '../interfaces';

const URL_PREFIX = process.env.STAGE === 'prod' ? 'security' : 'security-dev';
const BASE_URL = `https://${URL_PREFIX}.tx.group/api`;

import RiskTowerService from './RiskTowerService';

export default class DataService {
	static async getHierarchyTree(): Promise<IHierarchyTreeItem[]> {
		const url = `${BASE_URL}/entity/hierarchy/tree`;

		try {
			const config = await DataService.getAxiosConfig();
			const response = await axios.get(url, config);
			return response.data as IHierarchyTreeItem[];
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getRolesForUser(email: string): Promise<IRoles> {
		const url = `${BASE_URL}/user/roles?email=${email}`;

		try {
			const config = await DataService.getAxiosConfig();
			const response = await axios.get(url, config);
			return response.data as IRoles;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getAssessmentData(type: IType, roles: IRoles, company: ICompany): Promise<IAssessment> {
		const url = `${BASE_URL}/entity/assessments`;

		try {
			const config = await DataService.getAxiosConfig();
			const response = await axios.post(url, { type, roles, company }, config);
			return response.data.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getAllAssessmentTypes(): Promise<IType[]> {
		const url = `${BASE_URL}/all-types`;

		try {
			const config = await DataService.getAxiosConfig();
			const response = await axios.get(url, config);
			return response.data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	static async getJiraTickets(company: ICompany, type: IType): Promise<IJiraTicket[]> {
		const url = `${BASE_URL}/jira-tickets?companyName=${company}&type=${type}`;

		try {
			const config = await DataService.getAxiosConfig();
			const response = await axios.get(url, config);
			return response.data.jiraTickets as IJiraTicket[];
		} catch (err) {
			const error = err as AxiosError;
			if (error.response?.data.message === "Jira tickets don't exist for set values") {
				return [];
			} else {
				console.log(err);
				throw err;
			}
		}
	}

	static async getRisks(type: IType, company: ICompany, roles: IRoles): Promise<IRiskResponse> {
		const url = `${BASE_URL}/chart/assessments`;
		const config = await DataService.getAxiosConfig();
		const response = await axios.post(
			url,
			{
				type,
				roles,
			},
			config
		);

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

	static async getTopFindings(type: IType, roles: IRoles): Promise<ITopFinding[]> {
		const url = `${BASE_URL}/chart/assessments`;
		const config = await DataService.getAxiosConfig();
		const response = await axios.post(
			url,
			{
				type,
				roles,
			},
			config
		);
		const findings = response.data.topEpics.sortedAreas as ITopFinding[];

		return findings;
	}

	static async getTopMeasures(type: IType, roles: IRoles): Promise<ITopMeasure[]> {
		const url = `${BASE_URL}/chart/assessments`;
		const config = await DataService.getAxiosConfig();
		const response = await axios.post(
			url,
			{
				type,
				roles,
			},
			config
		);
		const measures = response.data.topEpics.sortedEpics as ITopMeasure[];

		return measures;
	}

	static async getEntityInfo(
		type: IType,
		roles: IRoles,
		company: ICompany
	): Promise<{
		entityName: string;
		assessmentDate: string;
		assessorName: string;
		entityWeight: number;
	}> {
		try {
			const data = await DataService.getAssessmentData(type, roles, company);

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

	static async getRiskRatings(type: IType, company: ICompany, roles: IRoles): Promise<RiskArea[]> {
		const url = `${BASE_URL}/chart/risk-ratings`;

		try {
			const config = await DataService.getAxiosConfig();
			const assessment: IAssessment = await DataService.getAssessmentData(type, roles, company);
			const id = assessment.assessmentId;

			const riskRatings: RiskRatingData = (
				await axios.post(
					url,
					{
						type,
						roles,
						id,
					},
					config
				)
			).data;

			return Object.values(riskRatings.assessment.areas);
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	static async getNews(company: ICompany, dateFilter: DateFilter): Promise<(Incident | Highlight)[]> {
		const typeFilter: TypeFilter = 'all';
		const url = `${BASE_URL}/public/incidents?typeFilter=${typeFilter}&dateFilter=${dateFilter}`;

		try {
			const config = await DataService.getAxiosConfig();
			const response: GetNewsResponse = (await axios.get(url, config)).data;
			console.log(`response for "GET ${url}"`, response);
			const news = response.filter((entity) => entity.name === company)[0].incidents;

			return news;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	static async getIncidents(company: ICompany, dateFilter: DateFilter): Promise<Incident[]> {
		const typeFilter: TypeFilter = 'incident';
		const url = `${BASE_URL}/public/incidents?typeFilter=${typeFilter}&dateFilter=${dateFilter}`;

		try {
			const config = await DataService.getAxiosConfig();
			const response: GetIncidentsResponse = (await axios.get(url, config)).data;
			console.log(`response for "GET ${url}"`, response);
			const incidents = response.filter((entity) => entity.name === company)[0].incidents;

			return incidents;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	static async getHighlights(company: ICompany, dateFilter: DateFilter): Promise<Highlight[]> {
		const typeFilter: TypeFilter = 'highlight';
		const url = `${BASE_URL}/public/incidents?typeFilter=${typeFilter}&dateFilter=${dateFilter}`;

		try {
			const config = await DataService.getAxiosConfig();
			const response: GetHighlightsResponse = (await axios.get(url, config)).data;
			console.log(`response for "GET ${url}"`, response);
			const highlights = response.filter((entity) => entity.name === company)[0].incidents;

			return highlights;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	public static async getOktaAccessToken(): Promise<OktaAccessTokenResponse> {
		const url = 'https://login.tx.group/oauth2/aus4ulq2jdMwScBQ40i7/v1/token';

		const params = new URLSearchParams();
		params.append('grant_type', 'client_credentials');
		params.append('scope', 'groups');

		const oktaClientIdAndSecretBase64 = Buffer.from(
			`${process.env.OKTA_CLIENT_ID}:${process.env.OKTA_CLIENT_SECRET}`
		).toString('base64');

		const config: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${oktaClientIdAndSecretBase64}`,
			},
		};
		const response: OktaAccessTokenResponse = (await axios.post(url, params, config)).data;

		return response;
	}

	private static async getAxiosConfig(): Promise<AxiosRequestConfig> {
		const { access_token } = await DataService.getOktaAccessToken();
		const config: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		};

		return config;
	}
}
