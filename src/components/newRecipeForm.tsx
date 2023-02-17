import type { FormEvent } from "react";
import { useState } from "react";

import type { Recepty } from "@prisma/client";
import { api } from "../utils/api";

interface FormData {
  title: string;
  content: string;
  ingredients: string;
}

const RecipeForm = (props: {
  onSubmit: (data: Recepty) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { isOpen, setIsOpen } = props;
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    ingredients: "",
  });
  const newRecipe = api.recipes.newRecipe.useMutation({
    onSuccess: (data) => {
      console.log("onSuccess: ", data);
      props.onSubmit(data.newRecipe);
      setIsOpen(false);
    },
  });
  function createRecipe(data: FormData) {
    newRecipe.mutate(data);
  }

  const handleSubmit = (e: FormEvent, data: FormData) => {
    e.preventDefault();
    createRecipe(data);
    setForm({ title: "", content: "", ingredients: "" });
  };
  if (!isOpen) return <></>;
  return (
    <div
      className={`fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/80`}
    >
      <div
        className="absolute inset-0 z-10"
        onClick={() => setIsOpen(false)}
      ></div>
      <form
        onSubmit={(e) => handleSubmit(e, form)}
        className="z-20 flex flex-col justify-center gap-2 rounded-xl bg-gradient-to-bl from-[#2e026d] to-[#15162c] p-8 shadow-xl"
      >
        <h1 className="mb-4 text-center text-xl font-thin uppercase tracking-widest text-white">
          Vytvořit Recept
        </h1>
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
        <label className="form-label" htmlFor="content">
          Popis receptu:
        </label>
        <textarea
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          value={form.content}
          className="form-input"
          name="content"
        ></textarea>
        <label className="form-label" htmlFor="ingredients">
          Ingredience oddělené čárkou:
        </label>
        <input
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          value={form.ingredients}
          className="form-input"
          type="text"
          name="ingredients"
        />
        <input
          type="submit"
          className="mt-4 cursor-pointer rounded-xl bg-purple-400 p-2 font-light uppercase tracking-widest transition-all hover:bg-purple-700"
          value="Vytvořit Recept"
        />
      </form>
    </div>
  );
};

export default RecipeForm;
