import { createCanvas } from 'canvas';
import fs from 'fs';
import { IDiagramOptions } from '../interfaces';

const _defaultOptions: IDiagramOptions = {
	fileName: 'diagram.png',
	impact: 0,
	probability: 0,
	width: 800,
	height: 440,
	margin: 40,
	size: 20,
	lineWidth: 2,
	fillStyle: '#FFFFFF',
	strokeStyle: '#000000',
	itemColor: '#FF8000',
};

export const createDiagram = async (options: Partial<IDiagramOptions>): Promise<string> => {
	const config: IDiagramOptions = {
		..._defaultOptions,
		...options,
	};

	const canvas = createCanvas(config.width, config.height);
	const ctx = canvas.getContext('2d');

	// setup
	ctx.lineWidth = config.lineWidth;
	ctx.fillStyle = config.fillStyle;
	ctx.strokeStyle = config.strokeStyle;

	// draw lines
	ctx.fillRect(0, 0, config.width, config.height);

	ctx.lineTo(config.margin, config.margin);
	ctx.lineTo(config.margin, config.height - config.margin);
	ctx.lineTo(config.width - config.margin, config.height - config.margin);
	ctx.stroke();

	// draw circle
	ctx.fillStyle = config.itemColor;
	ctx.beginPath();
	ctx.arc((config.width / 12) * config.impact, (config.height / 12) * config.probability, config.size, 0, 2 * Math.PI);
	ctx.fill();

	// save canvas to file
	const buffer = canvas.toBuffer();
	await fs.promises.writeFile(`/tmp/${config.fileName}`, buffer);
	return config.fileName;
};
