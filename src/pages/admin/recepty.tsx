import { type Recepty } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import RecipeForm from "../../components/newRecipeForm";
import { api } from "../../utils/api";
import AdminWrapper from "./AdminWrapper";

const Recepty = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: recepty } = api.recipes.getAll.useQuery();
  const [recipes, setRecipes] = useState<Recepty[]>();
  const delRecipe = api.recipes.delete.useMutation({
    onSuccess(data) {
      const filteredRecipes = recipes?.filter((recept) => {
        return recept.id != data.deletedRecipe.id;
      });
      setRecipes(filteredRecipes);
    },
  });

  const recipeDel = (id: string) => {
    delRecipe.mutate(id);
  };

  if (recepty && !recipes) {
    setRecipes([...recepty]);
  }

  const getData = (data: Recepty) => {
    if (recipes) {
      setRecipes([...recipes, data]);
    }
  };
  return (
    <AdminWrapper>
      <RecipeForm isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={getData} />
      <h2 className="my-3 text-5xl font-bold uppercase tracking-wide text-violet-400">
        Seznam receptu
      </h2>
      <button
        className="my-4 rounded-xl bg-purple-600 px-4 py-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        Přidat recept
      </button>
      <ul className="flex list-none flex-col">
        {recipes &&
          recipes.map((recept) => {
            return (
              <li
                key={recept.id}
                className="mb-2 flex flex-row items-center justify-between gap-4 rounded-xl bg-white/40 py-2 px-4 text-lg font-semibold"
              >
                <span>{recept.title}</span>
                <div className="flex flex-row gap-2">
                  <button onClick={() => recipeDel(recept.id)}>
                    <FaTrash />
                  </button>
                  <Link href="/">
                    <FaEye />
                  </Link>
                </div>
              </li>
            );
          })}
      </ul>
    </AdminWrapper>
  );
};

export default Recepty;