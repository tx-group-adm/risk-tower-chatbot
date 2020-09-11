export const userify = (text: string, user: string): string => {
	return text.replace(/__user__/gi, `<@${user}>`);
};
