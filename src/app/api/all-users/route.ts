import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";
import { getDataFromToken } from "@/helpers/getUserFromToken";
import { connectMongoDB } from "@/dbConfig/dbConfig";
import { FilterQuery } from "mongoose";

connectMongoDB();

export async function GET(request: NextRequest) {
  try {
    const userId: string = request.nextUrl.searchParams.get("userId") || "";
    const searchString: string =
      request.nextUrl.searchParams.get("searchString") || "";
    const pageNumber: number =
      Number(request.nextUrl.searchParams.get("pageNumber")) || 1;
    const pageSize: number =
      Number(request.nextUrl.searchParams.get("pageSize")) || 5;
    const sortBy: any = request.nextUrl.searchParams.get("sortBy") || "asc";

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [{ email: { $regex: regex } }, { name: { $regex: regex } }];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .select("-password")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return NextResponse.json(
      {
        message: "User found",
        data: { users, isNext },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ errorMessage: error.message }, { status: 400 });
  }
}
