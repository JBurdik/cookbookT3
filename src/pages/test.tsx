/* eslint-disable @next/next/no-img-element */
import type { _Object } from "@aws-sdk/client-s3";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { RiUploadCloud2Fill } from "react-icons/ri";
import Layout from "../components/Layout";
import { api } from "../utils/api";
// Import required AWS SDK clients and commands for Node.js.

function Test() {
  // const bucketParams = { Bucket: process.env.S3_UPLOAD_BUCKET };
  // const data = s3Client.send(new ListObjectsCommand(bucketParams));
  const [file, setFile] = useState<File>();
  const [objectList, setObjectList] = useState<_Object[]>();
  const listQuery = api.example.getS3List.useQuery();
  const presignedUrl = api.example.createPresignedUrl.useQuery().data;
  const refetchFiles = async () => {
    const refetched = await listQuery.refetch();
    return refetched.data?.Contents;
  };
  const deleteObject = api.example.deleteFromS3.useMutation({
    async onSuccess() {
      setObjectList(undefined);
      const refetched = await refetchFiles();
      setObjectList(refetched);
    },
  });
  if (listQuery.isFetched && objectList == undefined)
    setObjectList(listQuery.data?.Contents || []);

  // const { uploadToS3 } = useS3Upload();
  // const uplodadImage = async (file: File) => {
  //   await uploadToS3(file, {
  //     endpoint: {
  //       request: {
  //         headers: {
  //           "Content-Type": file.type,
  //         },
  //         body: {
  //           folder: "test",
  //         },
  //       },
  //     },
  //   });
  // };

  const handleUpload = async () => {
    if (!file || !presignedUrl) return;
    const uploadFile = await fetch(presignedUrl?.url, {
      method: "PUT",
      body: file,
    });
    if (uploadFile.ok) {
      console.log(`Uploaded file ${file.name} successfully.`);
      setFile(undefined);
    }
    // await uplodadImage(file);
    // const refetched = await refetchFiles();
    // setObjectList(refetched);
  };
  return (
    <Layout>
      <h1>Test</h1>
      <h2>Momentálně se zobrazuje veškerý obsah s3 bucketu</h2>
      <div className="flex gap-3">
        <FileInput file={file} setFile={setFile} />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleUpload().catch((e) => console.error(e));
          }}
          className="flex items-center justify-center rounded-3xl border border-teal-500 p-4"
        >
          <RiUploadCloud2Fill className="text-teal-500" size={75} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {objectList?.map((item, i) => {
          if (!item.Key) return null;
          return (
            <div
              onClick={() => {
                deleteObject.mutate(item.Key as string);
              }} //deleteObject
              key={i}
              className="group relative h-52 w-52 cursor-pointer overflow-hidden border-2 border-gray-100 bg-slate-100/10 hover:backdrop-blur-md"
            >
              <Image
                fill
                sizes="100% 100%"
                alt={i.toString()}
                className="object-cover object-right transition-all group-hover:scale-110 group-hover:blur-sm group-hover:grayscale"
                src={`https://cookbook-t3.s3.eu-central-1.amazonaws.com/${item.Key}`}
              />
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export const FileInput = ({
  file,
  setFile,
}: {
  file: File | undefined;
  setFile: (arg: File | undefined) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <input
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        type="file"
      />
      <button
        onClick={handleClick}
        className="flex flex-row items-center justify-center gap-2 rounded-3xl bg-teal-600 p-4"
      >
        <FaFileAlt size={75} />
        {file ? (
          <span className="text-xl font-bold uppercase tracking-wider">
            {file.name}
          </span>
        ) : (
          <span className="text-xl font-bold uppercase tracking-wider">
            Vybrat soubor
          </span>
        )}
      </button>
    </div>
  );
};

export default Test;
