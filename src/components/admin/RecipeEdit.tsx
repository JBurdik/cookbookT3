/* eslint-disable @next/next/no-img-element */
import { useS3Upload } from "next-s3-upload";
import React, { useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import { api } from "../../utils/api";
import RecipeRichEditor from "../RecipeRichEditor";

export interface EditFormData {
  id: string;
  title: string;
  content: string;
  ingredients: string;
}

function RecipeEdit(props: {
  recipeId: string;
  setEditId: (id: string) => void;
}) {
  const refFileInput = useRef<HTMLInputElement>(null);
  const { recipeId, setEditId } = props;
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [recipe, setRecipe] = useState<EditFormData>();
  const recept = api.recipes.getOne.useQuery(recipeId).data?.recept;

  const editRecipe = api.recipes.update.useMutation({
    onSuccess(data) {
      alert(`Editace receptu: ${data.editedRecipe.title} byla úspěšná!`);
      setRecipe(data.editedRecipe);
      setEditId("");
    },
  });

  // useMemo(() => console.log(content), [content])

  //show hidden file input

  const openSelectFile = () => {
    if (refFileInput.current) {
      refFileInput.current.click();
    }
  };

  const upPhoto = api.recipes.uploadPhoto.useMutation({
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.error(error);
    },
  });

  const { uploadToS3 } = useS3Upload();
  if (!recept) return <div>loading</div>;
  if (recept && !recipe) {
    console.log(recept);
    setRecipe(recept);
    setContent(recept.content);
  }
  // const handleFileChange = (file: File) => {
  //   setFile(file);
  // };
  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    setFile(file);
    console.log(file);
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
    editRecipe.mutate({
      id: recipeId,
      title: recipe.title,
      ingredients: recipe.ingredients,
      content: content,
    });
  }
  return (
    <div
      className={`fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/80`}
    >
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={() => setEditId("")}
      ></div>
      <div className="relative z-20 m-4 flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-bl from-[#2e026d] to-[#15162c] shadow-xl">
        <form
          onSubmit={(e) => handleForm(e)}
          className="flex h-full w-full flex-col justify-center gap-2 overflow-y-scroll p-4 shadow-xl"
        >
          <h1 className="mb-4 text-center text-xl font-thin uppercase tracking-widest text-white">
            Editace receptu
          </h1>
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

          <RecipeRichEditor
            content={content && content}
            setContent={setContent}
          />
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
            type="file"
            ref={refFileInput}
            className="hidden"
            onChange={(e) => handleFile(e.target.files && e.target.files[0])}
          />
          <button
            type="button"
            onClick={openSelectFile}
            className=" mx-auto flex w-fit flex-row items-center justify-center gap-2 rounded-md bg-purple-500 p-2 shadow-md shadow-black/50"
          >
            <FiImage /> {file ? file.name : "Vybrat obrázek"}
          </button>

          <button
            type="submit"
            className="mt-4 cursor-pointer rounded-xl bg-purple-400 p-2 font-light uppercase tracking-widest transition-all hover:bg-purple-700"
          >
            Uložit
          </button>
        </form>

        {/* <FileInput onChange={handleFileChange} /> */}
      </div>
    </div>
  );
}

export default RecipeEdit;
