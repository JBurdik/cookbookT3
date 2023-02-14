import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import LayooutNoCenter from "../../components/LayoutNoCenter";
import { api } from "../../utils/api";
const Recipe = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <Layout>Loading...</Layout>;
  const recept = api.recipes.getOne.useQuery(id.toString()).data?.recept;
  if (!recept) return <Layout>Error</Layout>;
  return (
    <LayooutNoCenter>
      <div>
        {recept && (
          <>
            <h1>{recept.title}</h1>
            <p>{recept.content}</p>
            <p>{recept.ingredients}</p>
          </>
        )}
      </div>
    </LayooutNoCenter>
  );
};

export default Recipe;
