import Image from "next/image";
import Whitespace from "../whitespace";
import { GameExt } from "delfruit-swagger-cg-sdk";
import Tag from "./tag";
import React from "react";
import Link from "next/link";

type GameInfoProps = {
  game: GameExt;
};

function getColor(value: number, min: number, max: number, startColor: string, endColor: string): string {
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

function AverageBox({label, value, max, description, bgColor}: {
  label: string;
  value: number;
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
					{value === -1 ? "N/A" : `${value} / ${max}`}
				</span>
        <br />
        <span className="description">{description}</span>
      </div>
    </div>
  );
}

export default function GameInfo({ game }: GameInfoProps): JSX.Element {
	
  return (
    <div className="w-[50%] float-left">
      <h1 className="break-words">{game.name}</h1>

      <h2 id="creator-label" className="mb-[13px]">
				Creator:{" "}
				{game.author.map((author, index) => (
					<React.Fragment key={author}>
						<Link href="/">{author}</Link>
						{index < game.author.length - 1 && ", "}
					</React.Fragment>
				))}
			</h2>

      {/* Average Boxes */}
      <div className="w-[380px] m-auto h-[80px]">
        <AverageBox
          label="Average Rating"
          value={game.rating}
          max={10}
          description="Good"
          bgColor={getColor(game.rating, 0, 10, "#ff8080", "#7fff80")}
        />
        <AverageBox
          label="Average Difficulty"
          value={game.difficulty}
          max={100}
          description="Good"
          bgColor={getColor(game.difficulty, 0, 100, "#8080ff", "#ff807f")}
        />
      </div>

      {/* Download link */}
      {game.url ? (
        <Link
          target="_blank"
          className="standalone"
          id="game-link"
          href={game.url}
        >
          <Image
            src="/images/download.png"
            className="absolute ml-[2px]"
            width={14}
            height={14}
            alt="Download Game"
          />
          <span>&nbsp;&nbsp;&nbsp;&nbsp; Download Game</span>
        </Link>
      ) : (
        <span id="no-link" className="inline-block pb-[1em]">
          [Download Not Available]
        </span>
      )}

      <br />
      <Link className="standalone" href="/">
        <Image
          src="/images/camera.png"
          className="absolute ml-[2px]"
          width={14}
          height={14}
          alt="Upload Screenshot"
        />
        <span>&nbsp;&nbsp;&nbsp;&nbsp; Upload a Screenshot</span>
      </Link>
      <br />
      <Link className="standalone" href="/">
        Report Game or Suggest Edit
      </Link>
      <br />

      {/* Checkboxes */}
      <input type="checkbox" id="chk_favourite" />
      <span> Favourite </span>
      <span className="favourite_alert hidden"></span>
      <br />

      <input type="checkbox" id="chk_clear" />
      <span> Cleared </span>
      <span className="clear_alert hidden"></span>
      <br />

      <input type="checkbox" id="chk_bookmark" />
      <span> Bookmark </span>
      <span className="bookmark_alert hidden"></span>
      <br />

      <p>0 people favourited this game!</p>
      <p>Date Submitted: {game.dateCreated}</p>

      {/* Tags */}
      <div>
        <h2>Tags:</h2>
        {game.tags.map((tag) => (
          <Tag key={tag.id} name={tag.name} count={game.tags.length} />
        ))}
      </div>
    </div>
  );
}