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

  return (
    <div className="flex flex-col gap-2">
      Tags:
      <div className="flex flex-wrap gap-2">
        {tagQuery.data?.map((tag) => (
          <div
            key={tag.name}
            className={`
            ${isActive(tag.name) ? "bg-primary-200" : ""}
            cursor-pointer rounded-md border-2 border-primary-100 p-2
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
