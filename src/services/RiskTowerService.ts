import { IAssessment, ICompany, IHierarchyTreeItem, IOrganisation, IType } from '../interfaces';
import DataService from './DataService';

export default class RiskTowerService {
	static async companyHasAssessment(company: ICompany, type: IType): Promise<boolean> {
		const hierarchyTree = await DataService.getHierarchyTree();
		// get company from hierarchy tree
		const companyFromTree = hierarchyTree.filter((item: IHierarchyTreeItem) => item.name === company)[0];
		// check if company has assessment of the provided type
		const hasAssessment = companyFromTree.hasAssessment && companyFromTree.assessmentType.includes(type);

		return hasAssessment;
	}

	static async getTopLevelCompanyForUser(user: string): Promise<ICompany> {
		const roles = await DataService.getRolesForUser(user);

		// TODO: implement role system

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

	static async getParentNode(parentId: number): Promise<IHierarchyTreeItem> {
		const hierarchy = await DataService.getHierarchyTree();
		const parent = hierarchy.filter((item: IHierarchyTreeItem) => item.id == parentId)[0];
		if (!parent) {
			throw new Error(`no parent found for id ${parentId}`);
		} else {
			return parent;
		}
	}

	static async getParentName(parentId: number | null): Promise<string | null> {
		if (parentId) {
			const parent = await RiskTowerService.getParentNode(parentId);
			return parent.name;
		} else {
			return null;
		}
	}

	static async getGrandParentName(parentId: number | null): Promise<string | null> {
		if (parentId) {
			const parent = await RiskTowerService.getParentNode(parentId);
			const grandParentId = parent.parentId;
			if (grandParentId) {
				const grandParent = await RiskTowerService.getParentNode(grandParentId);
				return grandParent.name;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
}
