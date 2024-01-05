import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";

    // Extracting the whole tokenData object, which we encoded in login route
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    //returning userId
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
