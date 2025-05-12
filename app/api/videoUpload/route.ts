import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryResponse {
    public_id: string;
    bytes: number;
    duration?: number;
    [key: string]: any;
}

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {

    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!process.env.PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: 'Cloudinary credentials are not set' }, { status: 500 });
        }

        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string; 
        const originalSize = formData.get('originalSize') as string;
        const file = formData.get('file') as File | null;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes);
        const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'aspecto', 
                    resource_type: 'video' ,
                    transformation: [{quality: "auto", fetch_format: 'mp4'}] },
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res as CloudinaryResponse);

                })
            uploadStream.end(buffer);
        })
        const video = await prisma.video.create({
            data: { 
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize:String( result.bytes),
                duration: result.duration || 0
            }
        })

        return NextResponse.json(video, { status: 200 });

    } catch (error) {
        console.log("Upload Video failed", error);
        return NextResponse.json({ error: 'Failed to upload Video' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}