import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server";

const prisma= new PrismaClient();

export async function GET() {
  try{
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({ message: "Videos fetched successfully", videos }, { status: 200 });
  }catch(error){
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally{ 
    await prisma.$disconnect();
  }
}