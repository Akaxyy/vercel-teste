import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        return NextResponse.json({
            sucess: 'File uploaded successfully',
            fileName: file.name,
            size: file.size,
            message: 'Arquivo recebido pelo servidor Vercel'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error processing file upload' }, { status: 500 });
    }
}