export const formatDate = (date: Date | null): string => {
	if (!date) return "Unknown";
	try {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	} catch (e) {
		return "00/00/0000";
	}
};

