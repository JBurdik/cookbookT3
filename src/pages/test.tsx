/* eslint-disable @next/next/no-img-element */
import type { _Object } from "@aws-sdk/client-s3";
import Image from "next/image";
import { useState } from "react";
import Layout from "../components/Layout";
import { api } from "../utils/api";
// Import required AWS SDK clients and commands for Node.js.

function Test() {
  // const bucketParams = { Bucket: process.env.S3_UPLOAD_BUCKET };
  // const data = s3Client.send(new ListObjectsCommand(bucketParams));
  const [objectList, setObjectList] = useState<_Object[]>();
  const listQuery = api.example.getS3List.useQuery();
  const deleteObject = api.example.deleteFromS3.useMutation({
    async onSuccess(data) {
      setObjectList(undefined);
      await listQuery.refetch();
      console.log("deleteobject: ", data);
    },
  });
  if (listQuery.isFetched && objectList == undefined)
    setObjectList(listQuery.data?.Contents || []);
  console.log(objectList);
  return (
    <Layout>
      <h1>Test</h1>
      <div className="grid grid-cols-4 gap-2">
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

export default Test;
