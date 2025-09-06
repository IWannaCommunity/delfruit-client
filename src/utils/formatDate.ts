export const formatDate = (date: Date | null, includeTime = false): string => {

	if (!date) return "Unknown";

	try {
		if (includeTime) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date);
    }

		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	} catch (e) {
		return "00/00/0000";
	}

};