import type { Recepty } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import RecipeEdit from "../../components/admin/RecipeEdit";
import RecipeForm from "../../components/admin/newRecipeForm";
import { env } from "../../env/client.mjs";
import { api } from "../../utils/api";
import AdminWrapper from "./AdminWrapper";

const Recipes = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const receptyQuery = api.recipes.getAll.useQuery();
  const { data: recepty } = receptyQuery;
  const [recipes, setRecipes] = useState<Recepty[]>();
  const [openEdit, setOpenEdit] = useState<Array<string>>([]);
  const [editId, setEditId] = useState<string>("");
  const deleteFromS3 = api.s3.delete.useMutation();
  const delRecipe = api.recipes.delete.useMutation({
    onSuccess(data) {
      console.log(data);
      const { imgUrl } = data.deletedRecipe;
      if (imgUrl.includes(env.NEXT_PUBLIC_S3_UPLOAD_URL)) {
        const key = imgUrl.replace(env.NEXT_PUBLIC_S3_UPLOAD_URL, "");
        deleteFromS3.mutate(key);
      }
      // const refetched = (await receptyQuery.refetch()).data;
      const filtered = recipes?.filter(
        (recipe) => recipe.id !== data.deletedRecipe.id
      );
      setRecipes(filtered);
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
