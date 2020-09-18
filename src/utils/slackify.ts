import { userify } from './userify';
import { channelify } from './channelify';
import { ISlackMessageIMEvent } from '../interfaces';

export const slackify = (text: string, event: ISlackMessageIMEvent): string => {
	return userify(channelify(text, event.channel), event.user);
};
