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

  return descriptions[floored] ?? "Unknown";
}

export function getDifficultyDescription(value: number | null): string {
  if (value === null) return "None";
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

  return "Unknown";
}

export function getColor(
	value: number | null, 
	min: number, 
	max: number, 
	startColor: string, 
	endColor: string
): string {
	if (value === null) return "#ffffff";

  // clamp value between min and max
  const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);

  // parse hex colors into r/g/b
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${[r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")}`;
  };

  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

  // interpolate each channel
  const r = Math.round(start.r + (end.r - start.r) * ratio);
  const g = Math.round(start.g + (end.g - start.g) * ratio);
  const b = Math.round(start.b + (end.b - start.b) * ratio);

  return rgbToHex(r, g, b);
}

export default function AverageBox({label, value, max, description, bgColor}: {
  label: string;
  value: number | null;
  max: number;
  description: string;
  bgColor: string;
}) {
  return (
    <div 
			className={`rating bg-[var(--average-color)]`}
			style={{ ["--average-color" as any]: bgColor }}
		>
      <span>{label}</span>
      <div>
        <span>
					{value === null ? "N/A" : `${value} / ${max}`}
				</span>
        <br />
        <span className="description">{description}</span>
      </div>
    </div>
  );
}