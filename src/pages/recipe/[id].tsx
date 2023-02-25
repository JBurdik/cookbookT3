import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useRouter } from "next/router";
import type { JSONObject } from "superjson/dist/types";
import Layout from "../../components/Layout";
import { api } from "../../utils/api";
const Recipe = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <Layout>Loading...</Layout>;
  const recept = api.recipes.getOne.useQuery(id.toString()).data?.recept;
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

export default Recipe;
