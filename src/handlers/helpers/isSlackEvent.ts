import { IEvent, ISlackEvent } from '../../interfaces';

export const isSlackEvent = (event: IEvent): event is ISlackEvent => {
	if ((event as ISlackEvent).body) {
		return true;
	}
	return false;
};
