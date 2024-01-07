import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectMongoDB();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    const userAlreadyExists = await User.findOne({
      email: email.toLowerCase(),
    });

    if (userAlreadyExists) {
      return NextResponse.json(
        { errorMessage: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        errorMessage: `An error occured while registering user ${error.message}`,
      },
      { status: 500 }
    );
  }
}
