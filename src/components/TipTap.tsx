import type { Editor } from "@tiptap/react";
import { EditorContent, generateHTML, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo, useState } from "react";
import { FaBold, FaHeading } from "react-icons/fa";
import type { JSONObject } from "superjson/dist/types";
import { api } from "../utils/api";

const MenuBar = ({
  editor,
  className,
}: {
  editor: Editor | null;
  className: string;
}) => {
  if (!editor) return null;

  return (
    <div className={className}>
      <button
        className={`p-1 ${
          editor.isActive("bold") ? "text-black" : "text-gray-400"
        }`}
        onClick={() => (
          editor.chain().focus().toggleBold().run(),
          console.log(editor.isActive("bold"))
        )}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <FaBold />
      </button>
      <button
        className={`flex flex-row p-1 ${
          editor.isActive("heading", { level: 1 })
            ? "text-black"
            : "text-gray-400"
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <FaHeading />
        <span className="text-xs">lg</span>
      </button>
      <button
        className={`flex flex-row p-1 ${
          editor.isActive("heading", { level: 2 })
            ? "text-black"
            : "text-gray-400"
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <FaHeading />
        <span className="text-xs">md</span>
      </button>
      <button
        className={`flex flex-row p-1 ${
          editor.isActive("heading", { level: 5 })
            ? "text-black"
            : "text-gray-400"
        }`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        <FaHeading />
        <span className="text-xs">sm</span>
      </button>
    </div>
  );
};

const Tiptap = () => {
  const [tiptap, setTiptap] = useState<JSONObject>();
  const output = useMemo(() => {
    if (!tiptap) return;
    return generateHTML(tiptap, [StarterKit]);
  }, [tiptap]);
  const saveTipTap = api.example.newTiptap.useMutation({
    onSuccess: (data) => (
      console.log(data),
      setTiptap(JSON.parse(data.tiptap.content) as JSONObject)
    ),
  });

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "focus:outline-none w-full min-h-[300px]",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 5],
        },
      }),
    ],
    content: "<p>Hello World! 🌎️</p>",
  });

  function handleSave(json: JSONObject | undefined) {
    if (!json) return;
    const content = JSON.stringify(json);
    saveTipTap.mutate(content);
  }

  return (
    <>
      <div className="relative flex w-full flex-col gap-4 border border-white bg-white/40 p-4">
        <MenuBar
          editor={editor}
          className=" absolute inset-x-0 top-0 m-0 flex flex-row bg-white text-black"
        />
        <EditorContent editor={editor} className="mt-6" />
        <button
          className="mx-auto w-fit rounded-lg bg-purple-400 px-4 py-2"
          onClick={() => handleSave(editor?.getJSON())}
        >
          Save
        </button>
      </div>
      {output && <div dangerouslySetInnerHTML={{ __html: output }}></div>}
    </>
  );
};

export default Tiptap;
