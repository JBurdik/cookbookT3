/* eslint-disable @next/next/no-img-element */
import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import { FiImage } from "react-icons/fi";
import RecipeRichEditor from "../../../components/RecipeRichEditor";
import { api } from "../../../utils/api";

export interface EditFormData {
  id: string;
  title: string;
  content: string;
  ingredients: string;
}

function RecipeEdit(props: {
  recipeId: string;
  setEditId: (id: string) => void;
  recipeContent: string;
}) {
  const { recipeId, setEditId } = props;
  const [content, setContent] = useState<string>();
  const [file, setFile] = useState<File>();
  const [recipe, setRecipe] = useState<EditFormData>({
    id: "",
    title: "",
    content: "",
    ingredients: "",
  });
  const recept = api.recipes.getOne.useQuery(recipeId);
  const editRecipe = api.recipes.update.useMutation({
    onSuccess(data) {
      setRecipe(data.editedRecipe);
      setEditId("");
    },
  });
  const upPhoto = api.recipes.uploadPhoto.useMutation();

  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  if (!recept.data) return <div>loading</div>;
  if (recept.data && !recipe) {
    console.log(recept.data);
    setRecipe(recept.data.recept);
    setContent(recept.data.recept.content);
  }
  const handleFileChange = (file: File) => {
    setFile(file);
  };
  const uplodadImage = async (file: File) => {
    const { url } = await uploadToS3(file, {
      endpoint: {
        request: {
          headers: {
            "Content-Type": file.type,
          },
          body: {
            receptId: recipeId,
            folder: "recepty",
          },
        },
      },
    });
    upPhoto.mutate({ id: recipeId, imgUrl: url });
  };
  function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (file) {
      uplodadImage(file).catch((err) => console.log(err));
    }
    if (!recipe || !recipeId) return;
    setRecipe({
      ...recipe,
      id: recipeId,
    });
    editRecipe.mutate(recipe);
  }
  return (
    <div
      className={`fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/80`}
    >
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={() => setEditId("")}
      ></div>
      <div className="z-20 flex flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-bl from-[#2e026d] to-[#15162c] p-8 shadow-xl">
        <h1>Editace receptu</h1>
        <form
          onSubmit={handleForm}
          className="flex flex-col items-center justify-center gap-2"
        >
          <label className="form-label" htmlFor="title">
            Název receptu
          </label>
          <input
            className="form-input"
            type="text"
            name="title"
            id="title"
            value={recipe?.title}
            onChange={(e) =>
              recipe && setRecipe({ ...recipe, title: e.target.value })
            }
          />
          <label className="form-label" htmlFor="content">
            Popis receptu
          </label>
          {/* <textarea
            className="form-input"
            name="content"
            id="content"
            value={recipe?.content}
            onChange={(e) =>
              recipe && setRecipe({ ...recipe, content: e.target.value })
            }
          /> */}

          <RecipeRichEditor content={content} setContent={setContent} />
          <label className="form-label" htmlFor="ingredients">
            Ingredience
          </label>
          <input
            type="text"
            className="form-input"
            name="ingredients"
            id="ingredients"
            value={recipe?.ingredients}
            onChange={(e) =>
              recipe && setRecipe({ ...recipe, ingredients: e.target.value })
            }
          />

          <input
            type="submit"
            value="Uložit"
            className="flex w-fit cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-purple-500 p-2 shadow-md shadow-black/50"
          />
        </form>

        <FileInput onChange={handleFileChange} />
        <button
          onClick={openFileDialog}
          className="flex w-fit flex-row items-center justify-center gap-2 rounded-md bg-purple-500 p-2 shadow-md shadow-black/50"
        >
          <FiImage /> Vybrat obrázek
        </button>
      </div>
    </div>
  );
}

export default RecipeEdit;