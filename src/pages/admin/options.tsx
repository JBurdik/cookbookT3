import { useState } from "react";
import { api } from "../../utils/api";
import AdminWrapper from "./AdminWrapper";
const Options = () => {
  const options = api.options.getAll.useQuery().data;
  const updateOptions = api.options.update.useMutation({
    onSuccess() {
      alert("Uloženo");
    },
  });
  // forms values
  const [title, setTitle] = useState<string | undefined>();
  const [meta, setMeta] = useState<string | undefined>();
  const [underCons, setUnderCons] = useState<boolean | undefined>();
  const [showNews, setShowNews] = useState<boolean | undefined>();
  const [name, setName] = useState<string | undefined>();

  if (!options) return <AdminWrapper>Loading...</AdminWrapper>;

  if (options && !title) {
    setTitle(options.title);
    setMeta(options.meta);
    setUnderCons(options.underConstruction);
    setShowNews(options.showNews);
    setName(options.name);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && name) {
      updateOptions.mutate({
        title,
        meta: meta ? meta : "",
        underConstruction: underCons ? underCons : false,
        showNews: showNews ? showNews : false,
        name: name,
        id: options.id,
      });
    }
  };

  return (
    <AdminWrapper>
      <h1 className="my-5 text-4xl font-bold uppercase tracking-widest text-primary-100">
        Options
      </h1>
      <form className="opt-form" onSubmit={(e) => handleSubmit(e)}>
        <div className="input-group">
          <span>Name:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => (e.preventDefault(), setName(e.target.value))}
          />
        </div>
        <div className="input-group">
          <span>title:</span>
          <input
            type="text"
            value={title}
            onChange={(e) => (e.preventDefault(), setTitle(e.target.value))}
          />
        </div>
        <div className="input-group">
          <span>Meta:</span>
          <input
            type="text"
            value={meta}
            onChange={(e) => (e.preventDefault(), setMeta(e.target.value))}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <span>Under Construction:</span>
          <input
            type="checkbox"
            checked={underCons}
            onClick={() => setUnderCons(!underCons)}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <span>Show News:</span>
          <input
            type="checkbox"
            checked={showNews}
            onClick={() => setShowNews(!showNews)}
          />
        </div>
        <button
          className="rounded-lg bg-primaryS-600 px-4 py-2 font-semibold uppercase tracking-widest"
          type="submit"
        >
          Uložit
        </button>
      </form>
    </AdminWrapper>
  );
};

export default Options;
