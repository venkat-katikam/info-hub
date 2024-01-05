import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectMongoDB();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });

    console.log("name, email, password", name, email, password);

    return NextResponse.json({ message: "User registered" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occured while registering user" },
      { status: 500 }
    );
  }
}
