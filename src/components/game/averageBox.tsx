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