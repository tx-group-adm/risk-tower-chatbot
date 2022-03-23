import { ChartConfiguration } from 'chart.js';
import { IAssessment, IQuickchartConfig } from '../../interfaces';
import axios from 'axios';

export async function createSingleBarChart(data: IAssessment): Promise<string> {
	const value = Number(data.rating.toFixed(2));
	const backgroundColor = data.ratingColor;

	const config: ChartConfiguration = {
		type: 'bar',
		data: {
			datasets: [
				{
					data: [value],
					backgroundColor,
					borderWidth: 1,
					borderColor: '#000000',
					barThickness: 120,
				},
			],
		},
		options: {
			legend: {
				display: false,
				align: 'center',
			},
			responsive: false,
			scales: {
				xAxes: [
					{
						ticks: {
							fontSize: 50,
							maxRotation: 0,
							minRotation: 0,
						},
						scaleLabel: {
							display: true,
							fontSize: 20,
							fontColor: '#000000',
							labelString: `${value}%`,
						},
					},
				],
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							stepSize: 10,
							min: 0,
							max: 100,
						},
					},
				],
			},
		},
	};

	const requestData: IQuickchartConfig = {
		backgroundColor: 'transparent',
		width: 400,
		height: 240,
		format: 'png',
		chart: config,
	};

	const response = (await axios.post('https://quickchart.io/chart/create', requestData)).data;

	if (response.success) {
		return response.url;
	} else {
		throw new Error('Error with quickchart.io');
	}
}
