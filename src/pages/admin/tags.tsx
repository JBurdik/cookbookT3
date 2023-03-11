import { Tags } from "@prisma/client";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { api } from "../../utils/api";
import AdminWrapper from "./AdminWrapper";

const Tags = () => {
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<Tags[]>([]);
  const tagsQuery = api.tags.getAll.useQuery();
  const tagCreateMutation = api.tags.new.useMutation({
    onSuccess: async () => {
      const refetched = await tagsQuery.refetch();
      if (refetched.data) {
        setTags(refetched.data);
      }
    },
  });
  const tagDeleteMutation = api.tags.delete.useMutation({
    onSuccess: async () => {
      const refetched = await tagsQuery.refetch();
      if (refetched.data) {
        setTags(refetched.data);
      }
    },
  });
  const hangleDelete = (name: string) => {
    tagDeleteMutation.mutate(name);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tagCreateMutation.mutate(tag);
  };
  return (
    <AdminWrapper>
      <h1>Kategorie</h1>
      <form className="mt-4" onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="tag">
          Název:
        </label>
        <input
          className="mt-1 block rounded-md bg-white/70 py-2 px-4 text-white shadow-md shadow-black outline-none"
          type="text"
          name="tag"
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button
          type="submit"
          className="m-4 flex w-fit items-center justify-center gap-2 rounded-lg p-4 nm-flat-slate-900-lg"
        >
          <FaPlusCircle />
          Přidat kategorii
        </button>
      </form>
      <div className="flex flex-col gap-4">
        <h2 className="text-center"> Kategorie:</h2>
        {tagsQuery.data?.length !== 0
          ? tagsQuery.data?.map((tag) => (
              <div
                key={tag.name}
                onClick={() => hangleDelete(tag.name)}
                className="flex cursor-pointer items-center justify-between rounded-lg p-4 nm-flat-slate-900-lg"
              >
                <p>{tag.name}</p>
              </div>
            ))
          : "Žádne kategorie"}
      </div>
    </AdminWrapper>
  );
};

export default Tags;
