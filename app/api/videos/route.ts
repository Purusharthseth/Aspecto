import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server";

const prisma= new PrismaClient();

export async function GET() {
  const { userId } = await auth();
  try{
    const videos = await prisma.video.findMany({
      where: {
        userId: userId || undefined, 
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(videos, { status: 200 });
  }catch(error){
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally{ 
    await prisma.$disconnect();
  }
}