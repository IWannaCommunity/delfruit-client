export function getRatingDescription(value: number | null): string {
  if (value === null) return "None";
	
  const floored = Math.floor(value);

  const descriptions: { [key: number]: string } = {
    0: "Atrocious",
    1: "Awful",
    2: "Bad",
    3: "Poor",
    4: "Lacking",
    5: "Decent",
    6: "Good",
    7: "Great",
    8: "Amazing",
    9: "Brilliant",
    10: "Perfect"
  };

  return descriptions[floored] ?? "";
}

export function getDifficultyDescription(value: number | null): string {
  if (value === null) return "None";
	if (value < 0) return "";
  if (value < 10) return "There's a Way!";
  if (value < 20) return "Walk in The Park";
  if (value < 30) return "Beginner";
  if (value < 40) return "Beginner Challenge";
  if (value < 50) return "Novice";
  if (value < 60) return "Novice Challenge";
  if (value < 70) return "Advanced";
  if (value < 80) return "Veteran";
  if (value < 90) return "Expert";
  if (value < 100) return "Master";
  if (value === 100) return "There's No Way!";

  return "";
}
