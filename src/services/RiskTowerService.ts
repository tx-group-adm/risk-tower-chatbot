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

	static async getParentName(parentId: number | null): Promise<string | null> {
		if (parentId) {
			const hierarchy = await DataService.getHierarchyTree();
			const parent = hierarchy.filter((item: IHierarchyTreeItem) => item.id == parentId)[0];

			if (!parent) {
				throw new Error(`no parent found for id ${parentId}`);
			}

			console.log(`got parent ${parent.name}`);

			return parent.name;
		} else {
			return null;
		}
	}

	// TODO: clean up functions
	// use a getParent function, from that use getParentName & getGrandParentName

	static async getGrandParentName(parentId: number | null): Promise<string | null> {
		if (parentId) {
			const hierarchy = await DataService.getHierarchyTree();
			const parent = hierarchy.filter((item: IHierarchyTreeItem) => item.id == parentId)[0];
			if (!parent) {
				throw new Error(`no parent found for id ${parentId}`);
			}
			const grandParent = hierarchy.filter((item: IHierarchyTreeItem) => item.id == parent.parentId)[0];
			if (grandParent) {
				return grandParent.name;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
}
