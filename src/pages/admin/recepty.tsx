import type { Recepty } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaPen, FaPlus, FaTrash } from "react-icons/fa";
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
      <h2 className="my-3 text-3xl font-bold uppercase tracking-wide text-primary-100 lg:text-5xl">
        Seznam receptů
      </h2>
      <button
        className="my-4 flex flex-row items-center justify-center gap-2 rounded-xl bg-orange-400 px-4 py-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaPlus />
        Přidat recept
      </button>
      <ul className="grid list-none grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {recipes &&
          recipes.map((recept) => {
            return (
              <li
                key={recept.id}
                className="mb-2 flex flex-col items-center justify-between rounded-lg bg-white/40 py-2 px-4 text-lg font-semibold"
              >
                <div className="relative h-52 w-full object-cover">
                  <Image
                    src={recept.imgUrl}
                    alt={recept.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-2 flex flex-row items-center justify-center gap-4">
                  <span>{recept.title}</span>
                  <div className="flex flex-row gap-2 ">
                    <button
                      onClick={() => recipeDel(recept.id)}
                      className="rounded-xl border-2 border-red-600 bg-red-400 p-3 text-red-600 transition-all hover:bg-red-700 hover:text-red-200"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => (
                        setOpenEdit([...openEdit, recept.id]),
                        setEditId(recept.id)
                      )}
                      className="rounded-xl border-2 border-blue-600 bg-blue-400 p-3 text-blue-600 transition-all hover:bg-blue-700 hover:text-blue-200"
                    >
                      <FaPen />
                    </button>
                    <Link
                      href={`/recipe/${recept.id}`}
                      className="rounded-xl border-2 border-green-600 bg-green-400 p-3 text-green-600 transition-all hover:bg-green-700 hover:text-green-200"
                    >
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
