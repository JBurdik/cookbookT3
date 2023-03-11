import type { Tags } from "@prisma/client";
import { api } from "../../utils/api";
const TagSelect = ({
  tags,
  setTags,
}: {
  tags: Tags[];
  setTags: (tags: Tags[]) => void;
}) => {
  const tagQuery = api.tags.getAll.useQuery();

  const isActive = (name: string) => {
    if (!tags) return false;
    return tags.find((tag) => tag.name === name);
  };

  const handleSelectTag = (name: string) => {
    if (isActive(name)) {
      const newTags = tags.filter((tag) => tag.name !== name);
      setTags(newTags);
    } else {
      tags ? setTags([...tags, { name: name }]) : setTags([{ name: name }]);
    }
  };

  // const handleAddTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   if (e.target.value === "Vyber tag") return;
  //   setTags([...tags, { name: e.target.value }]);
  // };

  return (
    <div className="flex flex-col gap-2">
      Tags:
      {/* {fileredTags && fileredTags.length > 0 && (
        <select onChange={handleAddTag} className="text-black">
          <option selected>Vyber tag</option>
          {fileredTags.map((tag, i) => (
            <option
              key={i}
              value={tag.name}
              className="flex items-center justify-center gap-2"
            >
              {tag.name}
            </option>
          ))}
        </select>
      )} */}
      <div className="flex flex-wrap gap-2">
        {tagQuery.data?.map((tag) => (
          <div
            key={tag.name}
            className={`
            ${isActive(tag.name) ? "bg-purple-500" : ""}
            cursor-pointer rounded-md border-2 border-purple-500 p-2
            `}
            onClick={() => handleSelectTag(tag.name)}
          >
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagSelect;
