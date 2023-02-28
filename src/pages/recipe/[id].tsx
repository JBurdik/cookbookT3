import type { Recepty } from "@prisma/client";
import { Role } from "@prisma/client";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import type { JSONObject } from "superjson/dist/types";
import Layout from "../../components/Layout";
import RecipeEdit from "../../components/admin/RecipeEdit";
import { api } from "../../utils/api";
const Recipe = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <Layout>Loading...</Layout>;
  const recept = api.recipes.getOne.useQuery(id.toString()).data;
  if (!recept) return <Layout>Loading</Layout>;

  const generateContent = (json: JSONObject) => {
    const output = generateHTML(json, [StarterKit]);
    console.log(output);
    return output;
  };
  const output = generateContent(JSON.parse(recept.content) as JSONObject);
  return (
    <Layout>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {recept && (
          <>
            {session?.user &&
              (recept.authorId === session.user.id ||
                session.user.role === Role.ADMIN) &&
              recept && <EditBar recipe={recept} />}
            <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg p-2 nm-flat-gray-900-lg">
              <div className="relative h-96 w-full overflow-hidden rounded-3xl">
                <Image
                  src={recept.imgUrl}
                  fill
                  className="overflow-hidden rounded-xl object-cover"
                  alt={recept.title}
                />
              </div>

              <h1 className="mt-2 ml-2">{recept.title}</h1>
              <div
                className="container flex max-w-4xl flex-col justify-start py-3 pl-6 text-white"
                dangerouslySetInnerHTML={{ __html: output }}
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
    <div className="fixed inset-x-0 top-0">
      <div className="mx-6 mt-6 flex flex-row justify-end gap-2">
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
        <Link
          href=""
          className="rounded-xl border-2 border-green-600 bg-green-400 p-3 text-green-600 transition-all hover:bg-green-700 hover:text-green-200"
        >
          <FaEye />
        </Link>
      </div>
      {editId && <RecipeEdit recipeId={editId} setEditId={setEditId} />}
    </div>
  );
};

export default Recipe;
