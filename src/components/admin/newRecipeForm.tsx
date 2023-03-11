import type { Tags } from "@prisma/client";
import { Difficulty, type Recepty } from "@prisma/client";
import type { FormEvent } from "react";
import { useRef, useState } from "react";

import { useS3Upload } from "next-s3-upload";
import { FaTimes } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { api } from "../../utils/api";
import RecipeRichEditor from "../RecipeRichEditor";
import TagSelect from "./TagSelect";

export interface FormData {
  title: string;
  content: string;
  ingredients: string;
  portions: number;
  time: number;
  difficulty: Difficulty;
  tags: Tags[];
}

const RecipeForm = (props: {
  onSubmit: (data: Recepty) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const refFileInput = useRef<HTMLInputElement>(null);
  const tagsQuery = api.tags.getAll.useQuery();
  const { isOpen, setIsOpen } = props;
  const [file, setFile] = useState<File>();
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<Tags[]>();
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    ingredients: "",
    portions: 0,
    time: 0,
    difficulty: "EASY",
    tags: [{ name: "" }],
  });
  const newRecipe = api.recipes.newRecipe.useMutation({
    onSuccess: async (data) => {
      if (file) {
        await uplodadImage(file, data.newRecipe.id);
      }
      props.onSubmit(data.newRecipe);
      alert(`Recept ${data.newRecipe.title} byl úspěšně přidán`);
      setIsOpen(false);
    },
  });
  const upPhoto = api.recipes.uploadPhoto.useMutation({
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.error(error);
    },
  });
  // if (tagsQuery.isFetched && !tags) {
  //   setTags(tagsQuery.data);
  // }
  function createRecipe(data: FormData) {
    if (content === "") {
      alert("Recept musí mít obsah");
      return;
    }
    data.tags = tags as Tags[];
    newRecipe.mutate(data);
    setForm({
      title: "",
      content: "",
      ingredients: "",
      portions: 0,
      time: 0,
      difficulty: "EASY",
      tags: [{ name: "" }],
    });
  }
  // file upload
  const openSelectFile = () => {
    if (refFileInput.current) {
      refFileInput.current.click();
    }
  };
  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    setFile(file);
  };
  const { uploadToS3 } = useS3Upload();
  const uplodadImage = async (file: File, recipeId: string) => {
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

  const handleSubmit = (e: FormEvent, data: FormData) => {
    e.preventDefault();

    createRecipe(data);
  };
  if (!isOpen) return <></>;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 py-4 `}
    >
      <div
        className="absolute inset-0 z-10"
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className="fixed right-4 top-6 z-50 cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        <FaTimes size={20} />
      </div>
      <div className="relative z-30 flex max-h-[90%] w-full justify-center gap-2 overflow-y-auto rounded-xl bg-gradient-to-bl from-[#2e026d] to-[#15162c] p-4 shadow-xl md:max-w-3xl">
        <div className="flex w-full flex-col  ">
          <h1 className="my-4 text-center text-lg font-thin uppercase tracking-widest text-white">
            Vytvořit Recept
          </h1>
          <form
            onSubmit={(e) => handleSubmit(e, { ...form, content })}
            className="flex h-auto flex-col gap-2"
          >
            <label className="form-label" htmlFor="title">
              Název Receptu:
            </label>
            <input
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              value={form.title}
              className="form-input"
              type="text"
              name="title"
            />
            <label className="form-label" htmlFor="ingredients">
              Ingredience oddělené čárkou:
            </label>
            <input
              onChange={(e) =>
                setForm({ ...form, ingredients: e.target.value })
              }
              value={form.ingredients}
              className="form-input"
              type="text"
              name="ingredients"
            />
            <label className="form-label">Tags:</label>
            <TagSelect tags={tags as Tags[]} setTags={setTags} />
            {/* <input
              type="text"
              className="form-input"
              value={form.tags[0]?.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: [...form.tags, { name: e.target.value }],
                })
              }
            /> */}
            <label className="form-label" htmlFor="difficulty">
              Obtížnost
            </label>
            <select
              className="form-input"
              onChange={(e) =>
                form &&
                setForm({
                  ...form,
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
                  value={form?.time}
                  onChange={(e) =>
                    form &&
                    setForm({
                      ...form,
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
                  value={form?.portions}
                  onChange={(e) =>
                    form &&
                    setForm({
                      ...form,
                      portions: e.target.valueAsNumber,
                    })
                  }
                  name="portions"
                />
              </span>
            </div>
            <label className="form-label">Popis Receptu:</label>
            <RecipeRichEditor content={content} setContent={setContent} />
            <input
              type="file"
              ref={refFileInput}
              className="hidden"
              onChange={(e) => handleFile(e.target.files && e.target.files[0])}
            />
            <button
              type="button"
              onClick={openSelectFile}
              className=" mx-auto mt-2 flex w-fit flex-row items-center justify-center gap-2 rounded-md bg-purple-500 p-2 shadow-md shadow-black/50"
            >
              <FiImage /> {file ? file.name : "Vybrat obrázek"}
            </button>
            <button
              type="submit"
              className="mt-4 cursor-pointer rounded-xl bg-purple-400 p-2 font-light uppercase tracking-widest transition-all hover:bg-purple-700"
            >
              Vytvorit Recept
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecipeForm;
