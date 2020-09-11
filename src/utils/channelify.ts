export const channelify = (text: string, channel: string): string => {
	return text.replace(/__channel__/gi, `<#${channel}>`);
};
