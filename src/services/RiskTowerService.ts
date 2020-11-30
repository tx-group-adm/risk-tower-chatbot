import { IAssessment, ICompany, IHierarchyItem, IOrganisation, IType } from '../interfaces';
import DataService from './DataService';

export default class RiskTowerService {
	static async companyHasAssessment(company: ICompany, type: IType): Promise<boolean> {
		const hierarchyTree = await DataService.getHierarchyTree();
		// get company from hierarchy tree
		const companyFromTree = hierarchyTree.filter((item: IHierarchyItem) => item.name === company)[0];
		// check if company has assessment of the provided type
		const hasAssessment = companyFromTree.hasAssessment && companyFromTree.assessmentType.includes(type);

		return hasAssessment;
	}

	static async getTopLevelCompanyForUser(user: string): Promise<ICompany> {
		const roles = await DataService.getRolesForUser(user);

		console.log(`roles for ${user}: ${roles}`);

		// get top level company based on access roles
		// for the moment just return TX Group

		return 'TX Group';
	}

	static getTreeItem(name: ICompany, node: IOrganisation | IAssessment): IOrganisation | IAssessment | null {
		if (node.name === name) {
			return node;
		} else {
			let match: IOrganisation | IAssessment | null = null;
			for (let i = 0; i < node.children.length; i++) {
				match = RiskTowerService.getTreeItem(name, node.children[i]);
				if (match) {
					break;
				}
			}

			return match;
		}
	}
}
