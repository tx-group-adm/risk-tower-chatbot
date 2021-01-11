export const EMOJI = {
	INFORMATION_SOURCE: ':information_source:',
	GREEN_CIRCLE: ':green_circle:',
	ORANGE_CIRCLE: ':orange_circle:',
	RED_CIRCLE: ':red_circle:',
};

export function getRatingColorEmoji(ratingColor: string): string {
	switch (ratingColor.toLocaleUpperCase()) {
		case '#6AA84F':
			return EMOJI.GREEN_CIRCLE;

		case '#FFA93F':
			return EMOJI.ORANGE_CIRCLE;

		case '#EA2E2E':
			return EMOJI.RED_CIRCLE;

		default:
			throw new Error('unknown rating color');
	}
}
