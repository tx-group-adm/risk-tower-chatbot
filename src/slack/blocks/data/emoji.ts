export const EMOJI = {
	INFORMATION_SOURCE: ':information_source:',
	RISKLEVEL_LOW: ':risklevel_low:',
	RISKLEVEL_MEDIUM: ':risklevel_medium:',
	RISKLEVEL_HIGH: ':risklevel_high:',
	RISKLEVEL_NO_DATA: ':risklevel_no_data:',
};

export function getRatingColorEmoji(ratingColor: string): string {
	if (!ratingColor) {
		ratingColor = '#FFFFFF';
	}
	switch (ratingColor.toLocaleUpperCase()) {
		case '#6AA84F':
			return EMOJI.RISKLEVEL_LOW;

		case '#FFA93F':
			return EMOJI.RISKLEVEL_MEDIUM;

		case '#EA2E2E':
			return EMOJI.RISKLEVEL_HIGH;

		case '#FFFFFF':
			return EMOJI.RISKLEVEL_NO_DATA;

		default:
			throw new Error(`unknown rating color ${ratingColor}`);
	}
}
