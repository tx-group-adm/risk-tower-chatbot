import { ChartConfiguration } from 'chart.js';
import { IQuickchartConfig } from '../../interfaces';
import axios from 'axios';

export async function createBarChart(
	labels: Array<string>,
	data: Array<number>,
	backgroundColor: Array<string>
): Promise<string> {
	const max = Math.max(...data);
	const stepSize = Math.round(max / 4);

	const chartConfig: ChartConfiguration = {
		type: 'bar',
		data: {
			labels,
			datasets: [
				{
					data,
					backgroundColor,
					borderWidth: 1,
					categoryPercentage: 1,
				},
			],
		},
		options: {
			legend: {
				display: false,
			},
			responsive: false,
			scales: {
				yAxes: [
					{
						ticks: { beginAtZero: true, stepSize, max },
					},
				],
			},
		},
	};

	const requestData: IQuickchartConfig = {
		backgroundColor: 'transparent',
		width: 500,
		height: 300,
		format: 'png',
		chart: chartConfig,
	};

	const response = (await axios.post('https://quickchart.io/chart/create', requestData)).data;

	if (response.success) {
		return response.url;
	} else {
		throw new Error('Êrror with quickchart.io');
	}
}
