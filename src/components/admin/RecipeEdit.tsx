/* eslint-disable @next/next/no-img-element */
import type { Tags } from "@prisma/client";
import { Difficulty } from "@prisma/client";
import { useS3Upload } from "next-s3-upload";
import React, { useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { api } from "../../utils/api";
import RecipeRichEditor from "../RecipeRichEditor";
import TagSelect from "./TagSelect";

export interface EditFormData {
  id: string;
  title: string;
  content: string;
  ingredients: string;
  imgUrl: string;
  difficulty: Difficulty;
  portions: number;
  time: number;
  authorId: string;
  tags: Tags[];
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
  const recept = api.recipes.getOne.useQuery(recipeId).data;
  const [tags, setTags] = useState<Tags[]>();

  const editRecipe = api.recipes.update.useMutation({
    onSuccess(data) {
      alert(`Editace receptu: ${data.editedRecipe.title} byla úspěšná!`);
      // setRecipe(data.editedRecipe);
      setEditId("");
    },
    onError(error) {
      alert(error.message);
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
    setRecipe(recept);
    setContent(recept.content);
    setTags(recept.tags);
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
            id: recipeId,
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
      console.log("uploading file");
      uplodadImage(file).catch((err) => console.log(err));
    }
    if (!recipe || !recipeId || !recept) return;

    editRecipe.mutate({
      id: recipeId,
      title: recipe.title,
      ingredients: recipe.ingredients,
      content: content,
      difficulty: recipe.difficulty,
      portions: recipe.portions,
      time: recipe.time,
      authorId: recept.authorId,
      tags: tags as Tags[],
    });
  }
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 py-4 `}
    >
      <div
        className="absolute inset-0 z-50"
        onClick={() => setEditId("")}
      ></div>
      <div
        className="fixed right-4 top-6 z-50 cursor-pointer"
        onClick={() => setEditId("")}
      >
        <FaTimes size={20} />
      </div>
      <div className="relative z-50 flex max-h-[90%] w-full gap-2 overflow-y-auto rounded-xl bg-primary-800 p-4 shadow-xl md:max-w-3xl">
        <div className="flex h-full w-full flex-col">
          <h1 className="my-4 text-center text-lg font-thin uppercase tracking-widest text-white">
            Editace Receptu
          </h1>
          <form
            onSubmit={(e) => handleForm(e)}
            className="flex h-auto flex-col gap-2"
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
            <label className="form-label" htmlFor="difficulty">
              Obtížnost
            </label>
            <select
              className="form-input"
              onChange={(e) =>
                recipe &&
                setRecipe({
                  ...recipe,
                  difficulty: e.target.value as Difficulty,
                })
              }
              defaultValue={Difficulty.EASY}
              name=""
            >
              <option value={Difficulty.EASY}>Jednoduché</option>
              <option value={Difficulty.MEDIUM}>Střední</option>
              <option value={Difficulty.HARD}>Těžké</option>
              <option value={Difficulty.EXTRAHARD}>Extra Těžké</option>
            </select>
            {tags && <TagSelect tags={tags} setTags={setTags} />}
            <div className="form-group">
              <span className="flex w-full flex-col items-start gap-1">
                <label className="form-label" htmlFor="time">
                  Doba přípravy
                </label>
                <input
                  className="form-input"
                  type="number"
                  name="time"
                  id="time"
                  value={recipe?.time}
                  onChange={(e) =>
                    recipe &&
                    setRecipe({
                      ...recipe,
                      time: e.target.valueAsNumber,
                    })
                  }
                />
              </span>
              <span className="flex w-full flex-col items-start gap-1">
                <label className="form-label" htmlFor="portions">
                  Počet porcí
                </label>
                <input
                  className="form-input"
                  type="number"
                  value={recipe?.portions}
                  onChange={(e) =>
                    recipe &&
                    setRecipe({
                      ...recipe,
                      portions: e.target.valueAsNumber,
                    })
                  }
                  name="portions"
                />
              </span>
            </div>
            <label className="form-label" htmlFor="content">
              Popis receptu
            </label>
            <RecipeRichEditor
              content={content && content}
              setContent={setContent}
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
              className=" mx-auto mt-4 flex w-fit flex-row items-center justify-center gap-2 rounded-md bg-primary-100 p-2 shadow-md shadow-black/50"
            >
              <FiImage /> {file ? file.name : "Vybrat obrázek"}
            </button>

            <button
              type="submit"
              className="mt-4 cursor-pointer rounded-xl bg-primaryS-500 p-2 font-light uppercase tracking-widest transition-all hover:bg-primary-700"
            >
              Uložit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecipeEdit;
