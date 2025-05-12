import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryResponse {
    public_id: string;
    [key: string]: any;
}
export async function POST(req: NextRequest) {

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const formData = await req.formData(); //this is a promise that return a FormData object
        const file = formData.get('file') as File | null;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        const bytes =  await file.arrayBuffer() //this is a promise that return an array buffer
        const buffer = Buffer.from(bytes); 
        const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder: 'aspecto'},
                ( err, res)=>{
                    if (err) reject(err);
                    else resolve(res as CloudinaryResponse);
                
            })
            uploadStream.end(buffer);
        })

        return NextResponse.json({publicId: result.public_id}, {status: 200});

    } catch (error) {
        console.log("Upload image failed", error);
        return NextResponse.json({error: 'Failed to upload image'}, {status: 500});
    }
}