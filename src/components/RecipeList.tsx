import type { Recepty } from "@prisma/client";
import RecipeCard from "./RecipeCard";

interface RecipeListProps {
  recipes: Recepty[];
}

const RecipeList = ({ recipes }: RecipeListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} key={recipe.id} />
      ))}
    </div>
  );
};

export default RecipeList;
