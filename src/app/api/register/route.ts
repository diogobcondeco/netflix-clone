import { NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import prismadb from '../../../lib/prismadb';

export async function POST(req: NextRequest) {
  if (await req.method !== 'POST') {
    return new Response(await req.json(), { status: 405 })
  }

  try {
    const { email, username, password } = await req.json();

    const existingUser = await prismadb.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return new Response('Email taken', { status: 422 })
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        username,
        hashedPassword,
        image: '',
        emailVerified: new Date()
      }
    })

    return new Response(JSON.stringify(user))
  } catch (error) {
    console.log(error);
    return new Response(await req.json(), { status: 400 })
  }
}