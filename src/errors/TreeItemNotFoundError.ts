export class TreeItemNotFoundError extends Error {
	constructor(message: string | undefined) {
		super(message);
		Object.setPrototypeOf(this, TreeItemNotFoundError.prototype);
	}
}
