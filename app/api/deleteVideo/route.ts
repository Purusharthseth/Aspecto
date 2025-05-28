import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const prisma = new PrismaClient()
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    const result = await cloudinary.api.delete_resources([id],
      { type: 'upload', resource_type: 'video' });


    console.log("Cloudinary deletion result:", result);
    // Delete from Prisma DB
    await prisma.video.delete({
      where: { id: id },
    });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Upload delete failed", error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
