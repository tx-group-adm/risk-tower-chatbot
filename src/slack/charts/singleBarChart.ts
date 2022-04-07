import { IAssessment } from '../../interfaces';
import fs from 'fs';
import sharp from 'sharp';
import SlackService from '../../services/SlackService';

export async function createSingleBarChart(data: IAssessment, slackService: SlackService): Promise<void> {
	const svg = getBarChartSVG(data);
	await fs.promises.writeFile('/tmp/chart.svg', svg);
	const filePath = '/tmp/chart.svg';
	const sharpImage = sharp(filePath);
	await sharpImage.toFile('/tmp/chart.png');
	const buffer = await fs.promises.readFile('/tmp/chart.png');
	await slackService.uploadFile(buffer, `Risk chart for ${data.name}`);
}

function getBarChartSVG(data: IAssessment): string {
	const { rating, ratingColor } = data;
	const SIZE = 500;
	const CHART_HEIGHT = 300;

	// subtract 1 pixel so border of chart container is visible (doesn't change the representation of the chart)
	const barHeight = CHART_HEIGHT * (rating / 100) - 1;

	// distance from container to chart + distance from chart container to bar
	const barPositionY = (SIZE - CHART_HEIGHT) / 2 + (CHART_HEIGHT - barHeight) - 0.5;

	console.log(data);
	console.log(`barHeight: ${barHeight}`);
	console.log(`barPositionY: ${barPositionY}`);

	const svg = `
	<svg width="500" height="500">
      <rect
        class="container"
        width="500"
        height="500"
        fill="white"
        stroke="black"
        stroke-width="1"
      />
      <rect
        class="chart-container"
        x="230"
        y="100"
        width="100px"
        height="300px"
        fill="white"
        stroke="black"
        stroke-width="1"
        shape-rendering="crispEdges"
      />
      <rect 
        class="chart-value"
        x="230.5"
        y="${barPositionY}"
        width="99px"
        height="${barHeight}px"
        fill="${ratingColor}"
      />
      <text
        class="value-label"
        x="265"
        y="395"
        fill="black"
        fill-opacity="0.5"
        font-family="Source Sans"
        font-size="20px"
      >
        50%
      </text>
      <text
        class="text-label"
        x="130"
        y="140"
        fill="black"
        font-family="Source Sans"
        font-size="12px"
      >
        High Resilience
      </text>
      <text
        class="text-label"
        x="350"
        y="140"
        fill="black"
        font-family="Source Sans"
        font-size="12px"
      >
        75%
      </text>
      <line
        class="line-label line-high"
        x1="130"
        y1="175"
        x2="370"
        y2="175"
        stroke="black"
        stroke-width="1"
      />
      <text
        class="text-label"
        x="130"
        y="250"
        fill="black"
        font-family="Source Sans"
        font-size="12px"
      >
        Medium Resilience
      </text>
      <text
        class="text-label"
        x="130"
        y="365"
        fill="black"
        font-family="Source Sans"
        font-size="12px"
      >
        Low Resilience
      </text>
      <text
        class="text-label"
        x="350"
        y="365"
        fill="black"
        font-family="Source Sans"
        font-size="12px"
      >
        25%
      </text>
      <line
        class="line-label line-low"
        x1="130"
        y1="325"
        x2="370"
        y2="325"
        stroke="black"
        stroke-width="1"
      />
    </svg>
	`;

	return svg;
}
