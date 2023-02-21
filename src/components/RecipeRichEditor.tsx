import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaBold, FaHeading } from "react-icons/fa";

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
        onClick={(e) => (
          e.preventDefault(), editor.chain().focus().toggleBold().run()
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
        onClick={(e) => (
          e.preventDefault(),
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        )}
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
        onClick={(e) => (
          e.preventDefault(),
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        )}
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
        onClick={(e) => (
          e.preventDefault(),
          editor.chain().focus().toggleHeading({ level: 5 }).run()
        )}
      >
        <FaHeading />
        <span className="text-xs">sm</span>
      </button>
    </div>
  );
};

const RecipeRichEditor = ({
  content,
  setContent,
}: {
  setContent: (value: string) => void;
  content: string;
}) => {
  console.log(content);
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
    onUpdate: ({ editor }) => {
      setContent(JSON.stringify(editor.getJSON()));
    },
    content: "<p>Zde vepiš obsah receptu</p>",
  });

  return (
    <>
      <div className="relative flex w-full flex-col gap-4 border border-white bg-white/40 p-4">
        <MenuBar
          editor={editor}
          className=" absolute inset-x-0 top-0 m-0 flex flex-row bg-white text-black"
        />
        <EditorContent
          editor={editor}
          onChange={() => alert("Change textEditor")}
          className="mt-6"
        />
      </div>
    </>
  );
};

export default RecipeRichEditor;