import { NextResponse } from 'next/server';

export async function GET() {
    const body = `
    Relatorio de Teste
    ------------------
    Data: ${new Date().toISOString()}
    Status: Ok.

    Se vc esta lendo isso o firewll permitiu download de arquivos de texto via api
    `;

    return new NextResponse(body, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename="teste-rede-petrobras.txt"',
        },
    });
}