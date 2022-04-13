import { HandlerResponse } from '../../interfaces';
import DataService from '../../services/DataService';
import dialogflow from '@google-cloud/dialogflow';
import { ClientOptions } from '../../interfaces/dialogflow';

export async function handler(): Promise<HandlerResponse> {
	try {
		console.log('Updating the company entity in dialogflow based on the companies currently in the risk tower');

		const options: ClientOptions = {
			credentials: {
				private_key: (process.env.DIALOGFLOW_PRIVATE_KEY as string).replace(/\\n/gm, '\n'),
				client_email: process.env.DIALOGFLOW_CLIENT_EMAIL as string,
			},
		};
		const entities = new dialogflow.v2beta1.EntityTypesClient(options);
		const entityList = (
			await entities.listEntityTypes({
				parent: `projects/risk-tower-solution${process.env.STAGE === 'prod' ? '' : '-dev'}/agent`,
			})
		)[0];
		const companyEntity = entityList.filter((entity) => entity.displayName === 'tx_company')[0];
		companyEntity.entities = [];

		const tree = await DataService.getHierarchyTree();
		const companies = tree.map((item) => item.name);

		for (const company of companies) {
			const entity = {
				synonyms: [company],
				value: company,
			};
			companyEntity.entities.push(entity);
		}

		const updateSchema = {
			entityType: companyEntity,
		};

		const insertResponse = await entities.updateEntityType(updateSchema);
		console.log(insertResponse);

		return {
			statusCode: 200,
			body: 'Updated companies successfuly!',
		};
	} catch (err) {
		console.error(err);
		return {
			statusCode: 500,
			body: 'Error while updating companies, check the logs in cloudwatch',
		};
	}
}
