/* eslint-disable @next/next/no-img-element */
import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import Layout from "../components/Layout";
import Tiptap from "../components/TipTap";
import { api } from "../utils/api";

function Test() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [id, setId] = useState<string>("");
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
  const recepty = api.recipes.getAllTitles.useQuery().data;
  const upPhoto = api.recipes.uploadPhoto.useMutation();

  const handleFileChange = async (file: File) => {
    const { url } = await uploadToS3(file, {
      endpoint: {
        request: {
          headers: {
            "Content-Type": file.type,
          },
          body: {
            receptId: id,
            folder: "recepty",
          },
        },
      },
    });
    upPhoto.mutate({ id: id, imgUrl: url });
    setImageUrl(url);
  };
  return (
    <Layout>
      {/* <h1>Upload obrazku pro recept</h1>

      <form>
        <select
          name="recipe"
          className="text-black"
          onChange={(e) => setId(e.target.value)}
        >
          <option value="">Vyber recept</option>
          {recepty?.map((recept) => {
            return (
              <option key={recept.id} value={recept.id}>
                {recept.title}
              </option>
            );
          })}
        </select>
      </form>

      <div>
        <FileInput onChange={handleFileChange} />

        <button onClick={openFileDialog}>Upload file</button>

        {imageUrl && <img alt="sakdf" src={imageUrl} />}
      </div> */}
      <Tiptap></Tiptap>
    </Layout>
  );
}

export default Test;
