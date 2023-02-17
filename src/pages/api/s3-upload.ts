import type { NextApiRequest } from "next";
import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  key(req: NextApiRequest, filename) {
    const { receptId, folder } = req.body as {
      receptId: string;
      folder: string;
    };

    return `${folder}/${receptId}/${filename}`;
  },
});
