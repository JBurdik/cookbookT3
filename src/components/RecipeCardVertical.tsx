import type { Recepty } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaStar, FaUsers } from "react-icons/fa";

const RecipeCardVertical = ({ recipe }: { recipe: Recepty }) => {
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
  const color = (dificulty: string) => {
    switch (dificulty) {
      case "EASY":
        return "text-green-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "HARD":
        return "text-red-600";
      case "EXTRAHARD":
        return "text-purple-600";
    }
  };
  return (
    <Link href={`/recipe/${recipe.id}`} className="w-full" key={recipe.id}>
      <div className="group relative grid h-64 grid-cols-1 justify-start gap-4 overflow-hidden rounded-lg p-4 text-white shadow-lg shadow-black transition-all md:h-80 md:grid-cols-2">
        <div className="absolute inset-0 h-full w-full items-center justify-center">
          <Image
            src={recipe.imgUrl}
            fill
            className="rounded-xl object-cover transition-all duration-500 ease-in-out group-hover:scale-125 group-hover:blur-sm"
            alt={recipe.title}
          />
        </div>
        <div className="absolute bottom-0 grid h-1/2 w-full grid-cols-2 border-t border-t-primary-100 bg-gradient-to-t from-black to-primary-500/50 px-3 pt-4 backdrop-blur-0 md:h-1/3">
          <h1 className="text-xl text-primaryL-900">{recipe.title}</h1>
          <div className="row-span-2 my-4 grid grid-cols-3 place-items-start justify-items-center self-end rounded-md">
            <span className="flex flex-col items-center justify-center gap-1 text-sm font-thin">
              <FaClock size={20} />
              {recipe.time} min.
            </span>
            <span className="flex flex-col items-center justify-items-start gap-1 text-center text-sm font-thin">
              <FaStar size={20} className={color(recipe.difficulty)} />
              {Dificulty(recipe.difficulty)}
            </span>
            <span className="flex flex-col items-center justify-center gap-1 text-sm font-thin">
              <FaUsers size={20} />
              {recipe.portions}
            </span>
          </div>
          <p className="translate-y-4 text-xs font-thin uppercase tracking-wider opacity-0 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:text-primary-300 group-hover:opacity-100">
            Zobrazit recept
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCardVertical;
