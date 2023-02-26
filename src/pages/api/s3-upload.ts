import type { NextApiRequest } from "next";
import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  key(req: NextApiRequest, filename) {
    const { id, folder } = req.body as {
      id: string | undefined;
      folder: string;
    };
    if (!id) {
      return `${folder}/${filename}`;
    }
    return `${folder}/${id}/${filename}`;
  },
});
