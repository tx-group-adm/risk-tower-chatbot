export const errorHandler = (err: Error, msg: string): void => {
	console.log(`Error: ${msg}`);
	console.error(err);
};
