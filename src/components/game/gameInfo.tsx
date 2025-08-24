import Image from "next/image";
import Whitespace from "../whitespace";
import { GameExt } from "delfruit-swagger-cg-sdk";
import Tag from "./tag";
import React from "react";
import { formatDate } from "@//utils/formatDate";
import Link from "next/link";

type GameInfoProps = {
  game: GameExt;
};

function AverageBox({label, value, max, description, bgColor}: {
  label: string;
  value: number;
  max: number;
  description: string;
  bgColor: string;
}) {
  return (
    <div className={`rating ${bgColor}`}>
      <span>{label}</span>
      <div>
        <span>{value !== -1 ? `${value} / ${max} ` : "N/A"}</span>
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
        Creator: <Link href="/">{game.author}</Link>
      </h2>

      {/* Average Boxes */}
      <div className="w-[380px] m-auto h-[80px]">
        <AverageBox
          label="Average Rating"
          value={game.ratings.rating}
          max={10}
          description="Good"
          bgColor="bg-[#a7d780]"
        />
        <AverageBox
          label="Average Difficulty"
          value={game.ratings.difficulty}
          max={100}
          description="Good"
          bgColor="bg-[#d480aa]"
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
      <span>Favourite </span>
      <span className="favourite_alert hidden"></span>
      <br />

      <input type="checkbox" id="chk_clear" />
      <span>Cleared </span>
      <span className="clear_alert hidden"></span>
      <br />

      <input type="checkbox" id="chk_bookmark" />
      <span>Bookmark </span>
      <span className="bookmark_alert hidden"></span>
      <br />

      <p>0 people favourited this game!</p>
      <p>Date Submitted: {formatDate(new Date(game.dateCreated))}</p>

      {/* Tags */}
      <div>
        <h2>Tags:</h2>
        {game.tags.map((tag) => (
          <Tag key={tag.id || tag.name} name={tag.name} count={1} />
        ))}
      </div>
    </div>
  );
}