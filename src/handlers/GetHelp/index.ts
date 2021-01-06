import { IHelpData } from '../../interfaces';

export function getHelpDataForIntent(intentName: string): IHelpData {
	const helpDataForIntent: IHelpData = HELP_DATA[intentName];
	if (!helpDataForIntent) {
		throw new Error(`Couldn't find help data for ${intentName}`);
	} else {
		return helpDataForIntent;
	}
}

const HELP_DATA: {
	[intentName: string]: IHelpData;
} = {
	GetHelpAssessmentFindingsEpics: {
		title: 'What are Assessment Findings and Epics?',
		message:
			'Each Risk Area consists of a minimum of two maturity levels (4 is the worst, 0 the best). One maturity level includes an Assessment Finding (e.g. no Detection) and a Risk Epic (Detection needs to be implemented), so what needs to be done to remediate the finding.',
		hasImage: false,
	},
	GetHelpBoardType: {
		title: 'What is a Board Type?',
		message:
			'The main backend of the Risk Tower are Kanban boards. Currently Jira Cloud, Jira Datacenter or Asana are supported as backends. For each Risk Type a sepparate board is created with a "ToDo", "In Progress" and "Done" bucket. The board can be configured within the Entity Management. Once the initial assessment is done in the Risk Tower, the according stories (tasks) and epics are pushed to the configured board automatically. The status of single stories and epics are reflected back to the Risk Tower.',
		hasImage: false,
	},
	GetHelpEntity: {
		title: 'What is a Entity?',
		message:
			'An Entity is the department/company/subsidiary or team where you actually perform your assessment. The assessment reflects back a "green", "orange" or "red" value that indicates the maturity of the assessed entity. Entity results are aggregated to the next layer usually an organization.',
		hasImage: false,
	},
	GetHelpKanbanBoard: {
		title: 'What is a Kanban Board?',
		message:
			'For each Risk Type a separate board is created with a "ToDo", "In Progress" and "Done" bucket. The board can be configured within the Entity Management. Once the initial assessment is done in the Risk Tower, the according stories (tasks) and epics are pushed to the configured board automatically. The status of single stories and epics are reflected back to the Risk Tower.',
		hasImage: false,
		image: 'board_kanban.png',
	},
	GetHelpOrganisation: {
		title: 'What is an Organization?',
		message:
			'Assessments are always done on the entities, you could compare it with a spreadsheet containing the real findings. Organizations can be compared like folders. You can put organizations in organizations as well as entities in an organization. All assessment results on entity level are aggregated up to the next level until the root organization (folder) is reached. If a manager has several entities and should see the aggregated risk score out of all assessments, the manager can be granted risk_type read role for this organization.',
		hasImage: false,
	},
	GetHelpPrequisites: {
		title: 'What are prerequisites to use it?',
		message: '< text >',
		hasImage: false,
	},
	GetHelpRiskAreas: {
		title: 'What are Risk Areas?',
		message:
			'To show the risk on a map a Risk Type consists of a min of two Risk Areas. One is put on the probability bar, the other one on the impact bar. This is just a visual configuration and does not meat probability or impact, it just puts it on the correct X and Y bar of the map. You can add more Risk Areas (e.g. Detection on probability, Vulnerability Management on probability, Organization on impact and Processes on impact).',
		hasImage: false,
	},
	GetHelpRiskTower: {
		title: 'What is the Risk Tower?',
		message:
			'At TX Group we aim to measure the resilience of our departments and companies in an agile, qualitative way leveraging existing tools like Jira or Asana. The Risk Tower itself is a web application optimized for desktop, mobile and you are using the interactive Slack Bot interface.',
		hasImage: false,
	},
	GetHelpRiskType: {
		title: 'What is a Risk Type?',
		message:
			'A Risk Type is a scope you would like to assess. This could be security, privacy, compliance or others. The risk tower works in maturity levels but still tries to show a risk indicator on a risk map (with probability and impact). The Risk Type consists of Risk Areas, these include the according Assessment Finding and Epic and each Assessment Finding/Epic contain a minimum of one Story (Task).',
		hasImage: false,
		image: 'risk_type.png',
	},
	GetHelpShowAssessment: {
		title: 'How can you show assessment?',
		message: '< text >',
		hasImage: false,
	},
	GetHelpShowFindings: {
		title: 'How can you show findings?',
		message: '< text >',
		hasImage: false,
	},
	GetHelpShowMeasures: {
		title: 'How can you show measures?',
		message: '< text >',
		hasImage: false,
	},
	GetHelpShowRisks: {
		title: 'How can you show risks?',
		message: '< text >',
		hasImage: false,
	},
	GetHelpStories: {
		title: 'What are Stories?',
		message:
			'In Agile projects an Epic is a large Story that is split into smaller Stories. The Story is comparable to the single tasks that need to be done to complete the Epic and with that remediate the Assessment Finding. An example would be to have a Risk Area "Detection" with three maturity levels:',
		hasImage: false,
		image: 'stories.png',
	},
};
