import type { Recepty } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import RecipeEdit from "../../components/admin/RecipeEdit";
import RecipeForm from "../../components/admin/newRecipeForm";
import { api } from "../../utils/api";
import AdminWrapper from "./AdminWrapper";

const Recipes = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: recepty } = api.recipes.getAll.useQuery();
  const [recipes, setRecipes] = useState<Recepty[]>();
  const [openEdit, setOpenEdit] = useState<Array<string>>([]);
  const [editId, setEditId] = useState<string>("");
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
        {recepty &&
          recepty.map((recept) => {
            return (
              <li
                key={recept.id}
                className="mb-2 flex flex-col items-center justify-between gap-4 rounded-xl bg-white/40 py-2 px-4 text-lg font-semibold"
              >
                <div className="flex flex-row items-center justify-center gap-4">
                  <span>{recept.title}</span>
                  <div className="flex flex-row gap-2">
                    <button onClick={() => recipeDel(recept.id)}>
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => (
                        setOpenEdit([...openEdit, recept.id]),
                        setEditId(recept.id)
                      )}
                    >
                      <FaPen />
                    </button>
                    <Link href={`/recipe/${recept.id}`}>
                      <FaEye />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
      {editId && <RecipeEdit recipeId={editId} setEditId={setEditId} />}
    </AdminWrapper>
  );
};

export default Recipes;
