import { ISlackEventCallback, ISlackEventOnUsersBehalf } from '../interfaces';

export const isEventCallback = (
	event: ISlackEventCallback | ISlackEventOnUsersBehalf
): event is ISlackEventCallback => {
	if (event.type === 'event_callback') {
		return true;
	}
	return false;
};
