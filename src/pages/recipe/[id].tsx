import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { api } from "../../utils/api";
const Recipe = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <Layout>Loading...</Layout>;
  const recept = api.recipes.getOne.useQuery(id.toString()).data?.recept;
  if (!recept) return <Layout>Loading</Layout>;
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
            <p>{recept.content}</p>
            <p>{recept.ingredients}</p>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Recipe;
