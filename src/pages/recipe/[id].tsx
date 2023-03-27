import type { Recepty } from "@prisma/client";
import type { JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaHeart, FaPen, FaTrash } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import Layout from "../../components/Layout";
import RecipeEdit from "../../components/admin/RecipeEdit";
import { api } from "../../utils/api";

const LikeButton = ({ receptId }: { receptId: string }) => {
  const { data: isFaved } = api.users.isRecipeFav.useQuery(receptId);
  const ctx = api.useContext();
  const { mutate: fav } = api.recipes.favRecipe.useMutation({
    onSuccess: () => {
      void ctx.users.isRecipeFav.invalidate();
    },
  });
  const { mutate: unFav } = api.recipes.unfavRecipe.useMutation({
    onSuccess: () => {
      void ctx.users.isRecipeFav.invalidate();
    },
  });
  const handleFav = (type: string) => {
    if (type === "fav") fav(receptId);
    if (type === "unfav") unFav(receptId);
  };
  return (
    <div>
      {isFaved ? (
        <button
          onClick={() => handleFav("unfav")}
          className="rounded-xl border-2 border-orange-600 bg-orange-400/50 p-3 text-orange-600 transition-all hover:bg-orange-700 hover:text-orange-200"
        >
          <FaHeart />
        </button>
      ) : (
        <button
          onClick={() => handleFav("fav")}
          className="rounded-xl border-2 border-orange-600 bg-orange-400/50 p-3 text-orange-600 transition-all hover:bg-orange-700 hover:text-orange-200"
        >
          <FiHeart />
        </button>
      )}

      {/* {session?.user &&
                recept.authorId === session.user.id &&
                recept && <EditBar recipe={recept} />} */}
    </div>
  );
};

const Recipe = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(typeof window !== undefined ? true : false);
  }, []);
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <Layout>Loading...</Layout>;
  const receptQuery = api.recipes.getOne.useQuery(id as string);
  const recept = receptQuery.data;
  if (!recept) return <Layout>Loading</Layout>;
  const generateContent = (json: JSONContent) => {
    if (!isBrowser) return null;
    return generateHTML(json, [StarterKit]);
  };
  const output = generateContent(JSON.parse(recept.content) as JSONContent);
  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {recept && (
          <>
            {/* Edit bar */}
            {session?.user && (
              <div className="fixed inset-x-0 top-0 z-50 flex flex-row items-center justify-between bg-gradient-to-b from-black to-black/10 px-2 py-2 backdrop-blur-sm">
                <LikeButton receptId={id as string} />
                {recept.authorId === session.user.id && recept && (
                  <EditBar recipe={recept} />
                )}
              </div>
            )}

            {/* Recipe card */}
            <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg p-2 nm-flat-gray-900-lg">
              <div className="relative h-96 w-full overflow-hidden rounded-3xl">
                <Image
                  src={recept.imgUrl}
                  fill
                  className="overflow-hidden rounded-xl object-cover"
                  alt={recept.title}
                />
              </div>
              <div className="mx-2 mt-2 flex flex-row items-center justify-between">
                <h1 className="text-2xl font-bold tracking-wider">
                  {recept.title}
                </h1>
                <p className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-xs font-thin tracking-wider">
                    <Image
                      src={recept.author.image as string}
                      alt={recept.author.name as string}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    {recept.author.name}
                  </span>
                </p>
              </div>
              <div
                className="container flex max-w-4xl flex-col justify-start py-3 pl-6 text-white"
                dangerouslySetInnerHTML={{ __html: output as string }}
              ></div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const EditBar = ({ recipe }: { recipe: Recepty }) => {
  const [editId, setEditId] = useState<string>("");
  console.log(editId);
  return (
    <>
      {editId && <RecipeEdit recipeId={editId} setEditId={setEditId} />}
      <div className="flex flex-row justify-end gap-2">
        <button className="rounded-xl border-2 border-red-600 bg-red-400 p-3 text-red-600 transition-all hover:bg-red-700 hover:text-red-200">
          <FaTrash />
        </button>
        <button
          className="rounded-xl border-2 border-blue-600 bg-blue-400 p-3 text-blue-600 transition-all hover:bg-blue-700 hover:text-blue-200"
          onClick={() => {
            setEditId(recipe.id);
          }}
        >
          <FaPen />
        </button>
      </div>
    </>
  );
};

export default Recipe;
