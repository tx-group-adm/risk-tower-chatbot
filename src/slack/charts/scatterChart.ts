import { ChartConfiguration } from 'chart.js';
import { IAssessment, IQuickchartConfig } from '../../interfaces';
import axios from 'axios';

export async function createScatterChart(data: IAssessment): Promise<string> {
	const x = data.impact;
	const y = data.probability;
	const pointBackgroundColor = data.ratingColor;

	const chartConfig: ChartConfiguration = {
		type: 'scatter',
		data: {
			datasets: [
				{
					data: [
						{
							x,
							y,
						},
					],
					pointRadius: 15,
					pointBackgroundColor,
				},
			],
		},
		options: {
			legend: {
				display: false,
			},
			scales: {
				xAxes: [
					{
						ticks: {
							beginAtZero: true,
							stepSize: 3,
							max: 12,
						},
					},
				],
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							stepSize: 3,
							max: 12,
						},
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
