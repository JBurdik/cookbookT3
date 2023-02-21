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
      <div className="flex flex-col items-center justify-center gap-4">
        {recept && (
          <>
            <div className="relative flex h-64 w-96 items-center justify-center">
              <Image
                src={recept.imgUrl}
                fill
                className="rounded-xl object-cover"
                alt={recept.title}
              />
            </div>
            <h1>{recept.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: output }}></p>
            <p>{recept.ingredients}</p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Recipe;
