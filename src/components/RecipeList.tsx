import type { Recepty } from "@prisma/client";
import RecipeCardVertical from "./RecipeCardVertical";

interface RecipeListProps {
  recipes: Recepty[];
}

const RecipeList = ({ recipes }: RecipeListProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      {recipes.map((recipe) => (
        <RecipeCardVertical recipe={recipe} key={recipe.id} />
      ))}
    </div>
  );
};

export default RecipeList;
