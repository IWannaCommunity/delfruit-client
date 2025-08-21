export const formatDate = (date: Date | null): string => {
	if (!date) return "Unknown";
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
};