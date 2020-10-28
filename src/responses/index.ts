import { HandlerResponse } from '../interfaces';

const createResponse = (statusCode: number, body = '', headers?: { [headerName: string]: string }): HandlerResponse => {
	return {
		statusCode,
		body,
		headers: { 'Content-Type': 'application/json', ...headers },
		isBase64Encoded: false,
	};
};

export const HTTP200 = (body = '', headers?: { [headerName: string]: string }): HandlerResponse => {
	return createResponse(200, body, headers);
};

export const HTTP400 = (body = '', headers?: { [headerName: string]: string }): HandlerResponse => {
	return createResponse(400, body, headers);
};
