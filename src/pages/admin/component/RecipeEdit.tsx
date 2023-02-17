/* eslint-disable @next/next/no-img-element */
import type { Recepty } from "@prisma/client";
import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import { api } from "../../../utils/api";

function RecipeEdit(props: { recipeId: string }) {
  const { recipeId } = props;
  const [imageUrl, setImageUrl] = useState<string>();
  const [recipe, setRecipe] = useState<Recepty>();
  const recept = api.recipes.getOne.useQuery(recipeId).data;
  const upPhoto = api.recipes.uploadPhoto.useMutation();

  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const handleFileChange = async (file: File) => {
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
    setImageUrl(url);
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Editace receptu</h1>
      <form className="flex flex-col text-white">
        <label htmlFor="title">Název receptu</label>
        <input type="text" name="title" id="title" />
        <label htmlFor="content">Popis receptu</label>
        <textarea name="content" id="content" />
        <label htmlFor="ingredients">Ingredience</label>
        <input type="text" name="ingredients" id="ingredients" />
        <label htmlFor="image">Obrázek</label>

        <FileInput onChange={handleFileChange} />

        <button onClick={openFileDialog}>Upload file</button>

        {imageUrl && <img alt="sakdf" src={imageUrl} />}
        <input type="submit" value="Uložit" />
      </form>
    </div>
  );
}

export default RecipeEdit;
