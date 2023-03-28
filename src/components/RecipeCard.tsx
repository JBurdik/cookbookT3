import type { Recepty } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

// dayjs plugins
import cs from "dayjs/locale/cs";
import relativeTime from "dayjs/plugin/relativeTime";

const RecipeCard = ({ recipe }: { recipe: Recepty }) => {
  dayjs.extend(relativeTime);
  dayjs.locale(cs);
  const Dificulty = (dificulty: string) => {
    switch (dificulty) {
      case "EASY":
        return "Snadná";
      case "MEDIUM":
        return "Střední";
      case "HARD":
        return "Těžká";
      case "EXTRAHARD":
        return "Extrémně těžká";
    }
  };
  return (
    <Link href={`/recipe/${recipe.id}`} className="w-full" key={recipe.id}>
      <div className="group relative flex justify-start gap-4 overflow-hidden rounded-lg  p-4 transition-all nm-flat-bgCol-xs md:h-80 md:grid-cols-2">
        <div className="relative h-48 w-48 overflow-hidden rounded-xl shadow-md shadow-black">
          <Image
            src={recipe.imgUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex grow flex-col items-start">
          <h2>{recipe.title}</h2>
          <span className=" text-xs">
            {dayjs(recipe.createdAt).format("D. MMMM. YY")}
          </span>
          <div className="grid grid-cols-3 place-items-center items-center justify-center gap-2">
            <p>{recipe.time}</p>
            <p>{recipe.difficulty}</p>
            <p>{recipe.portions}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
