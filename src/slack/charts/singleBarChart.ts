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
	const barHeight = CHART_HEIGHT * Number(rating.toFixed(3)) - 1;

	// distance from container to chart + distance from chart container to bar
	const barPositionY = (SIZE - CHART_HEIGHT) / 2 + (CHART_HEIGHT - barHeight);

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
        x="200"
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
        x="200"
        y="${barPositionY}"
        width="99px"
        height="${barHeight}"
        fill="${ratingColor}"
      />
      <text
        class="value-label"
        x="235"
        y="395"
        fill="black"
        fill-opacity="0.5"
        font-family="Open Sans"
        font-size="20px"
      >
        60%
      </text>
      <text
        class="text-label"
        x="130"
        y="155"
        fill="black"
        font-family="Open Sans"
        font-size="13px"
      >
        High
      </text>
      <text
        class="text-label"
        x="340"
        y="155"
        fill="black"
        font-family="Open Sans"
        font-size="13px"
      >
        80%
      </text>
      <line
        class="line-label line-high"
        x1="130"
        y1="160"
        x2="370"
        y2="160"
        stroke="black"
        stroke-width="1"
      />
      <text
        class="text-label"
        x="130"
        y="245"
        fill="black"
        font-family="Open Sans"
        font-size="13px"
      >
        Medium
      </text>
      <text
        class="text-label"
        x="340"
        y="245"
        fill="black"
        font-family="Open Sans"
        font-size="13px"
      >
        50%
      </text>
      <line
        class="line-label line-medium"
        x1="130"
        y1="250"
        x2="370"
        y2="250"
        stroke="black"
        stroke-width="1"
      />
      <text
        class="text-label"
        x="130"
        y="335"
        fill="black"
        font-family="Open Sans"
        font-size="13px"
      >
        Low
      </text>
      <text
        class="text-label"
        x="340"
        y="335"
        fill="black"
        font-family="Open Sans"
        font-size="13px"
      >
        20%
      </text>
      <line
        class="line-label line-low"
        x1="130"
        y1="340"
        x2="370"
        y2="340"
        stroke="black"
        stroke-width="1"
      />
    </svg>
	`;

	return svg;
}
