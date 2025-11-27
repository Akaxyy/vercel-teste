import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        message: "Pong!",
        timestamp: new Date().toISOString()
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({
        message: "Recebido com sucesso via POST!",
        receivedData: body
    });
}