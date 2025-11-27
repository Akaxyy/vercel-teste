'use client';

import { useState } from 'react';

export default function Diagnostico() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  // 1. Teste de API JSON
  const testarConexao = async () => {
    setLoading(true);
    addLog('--- Iniciando Teste JSON ---');
    try {
      const resGet = await fetch('/api/ping');
      if (!resGet.ok) throw new Error(`GET Falhou: ${resGet.status}`);
      addLog(`✅ GET Sucesso.`);

      const resPost = await fetch('/api/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teste: 'petrobras' })
      });
      if (!resPost.ok) throw new Error(`POST Falhou: ${resPost.status}`);
      addLog(`✅ POST Sucesso.`);
    } catch (error: any) {
      addLog(`❌ ERRO CONEXÃO: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Teste de Upload + Preview (Método FileReader - Mais compatível)
  const testarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setLoading(true);
    addLog(`--- Processando arquivo: ${file.name} ---`);

    // --- PARTE DO PREVIEW (Base64) ---
    const reader = new FileReader();
    reader.onloadend = () => {
      // Quando terminar de ler o arquivo, joga no estado
      setPreviewUrl(reader.result as string);
      addLog('📸 Preview da imagem gerado localmente.');
    };
    // Lê o arquivo para gerar o preview
    reader.readAsDataURL(file);

    // --- PARTE DO UPLOAD ---
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      addLog(`✅ Upload Sucesso! Servidor recebeu ${data.size} bytes.`);
    } catch (error: any) {
      addLog(`❌ ERRO UPLOAD: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Teste de Download de Arquivo
  const testarDownload = async () => {
    setLoading(true);
    addLog('--- Iniciando Download ---');
    try {
      const res = await fetch('/api/download');
      if (!res.ok) throw new Error(`Erro API: ${res.status}`);

      const blob = await res.blob();
      addLog(`📥 Arquivo recebido (${blob.size} bytes). Iniciando save...`);

      // Cria link temporário para baixar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "teste-petrobras.txt";
      document.body.appendChild(a);
      a.click();

      // Limpeza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addLog(`✅ Download concluído.`);
    } catch (error: any) {
      addLog(`❌ ERRO DOWNLOAD: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 4. Teste Imagem Externa
  const testarImagemExterna = () => {
    addLog('--- Buscando imagem externa ---');
    const imgUrl = "https://i.pinimg.com/736x/18/86/b9/1886b9c6539a76bad82b64606c9bf76d.jpg";
    const img = new Image();
    img.onload = () => addLog('✅ Imagem externa carregada.');
    img.onerror = () => addLog('❌ ERRO: Imagem externa bloqueada.');
    img.src = imgUrl;
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-500 border-b border-gray-800 pb-4">
          Painel de Diagnóstico de Rede
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Card 1: API Check */}
          <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 hover:border-gray-700 transition">
            <h2 className="text-lg font-bold mb-2 text-blue-400">1. Conexão API</h2>
            <button
              onClick={testarConexao}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium disabled:opacity-50"
            >
              Testar JSON (GET/POST)
            </button>
          </div>

          {/* Card 2: Download */}
          <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 hover:border-gray-700 transition">
            <h2 className="text-lg font-bold mb-2 text-purple-400">2. Download Arquivo</h2>
            <button
              onClick={testarDownload}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded font-medium disabled:opacity-50"
            >
              Baixar .txt do Servidor
            </button>
          </div>

          {/* Card 3: Upload e Preview */}
          <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 md:col-span-2">
            <h2 className="text-lg font-bold mb-2 text-pink-400">3. Upload & Preview Local</h2>
            <p className="text-sm text-gray-400 mb-4">Escolha uma imagem. Ela deve aparecer abaixo imediatamente.</p>

            <input
              type="file"
              accept="image/*"
              onChange={testarUpload}
              disabled={loading}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-pink-600 file:text-white hover:file:bg-pink-700 mb-4 cursor-pointer"
            />

            {/* PREVIEW AREA */}
            <div className="mt-4 p-4 bg-black rounded border border-gray-700 min-h-[100px] flex items-center justify-center flex-col">
              {!previewUrl && <span className="text-gray-600 text-sm">Nenhuma imagem selecionada</span>}

              {previewUrl && (
                <>
                  <p className="text-green-500 text-xs mb-2 self-start">Preview Ativo:</p>
                  {/* Usando tag img padrão do HTML para garantir compatibilidade */}
                  <img
                    src={previewUrl}
                    alt="Preview Local"
                    className="max-h-64 max-w-full rounded shadow-lg border border-gray-600"
                  />
                </>
              )}
            </div>
          </div>

          {/* Card 4: Externo */}
          <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 md:col-span-2">
            <h2 className="text-lg font-bold mb-2 text-green-400">4. Acesso Externo</h2>
            <button
              onClick={testarImagemExterna}
              className="bg-green-700 hover:bg-green-800 px-6 py-2 rounded font-medium transition"
            >
              Testar Imagem Externa
            </button>
          </div>

        </div>

        {/* Console Logs */}
        <div className="bg-black p-4 rounded-lg font-mono text-xs h-60 overflow-y-auto border border-gray-800">
          <div className="text-gray-500 mb-2 border-b border-gray-900 pb-2 font-bold">LOGS DO SISTEMA:</div>
          {logs.length === 0 && <span className="text-gray-700">Aguardando ações...</span>}
          {logs.map((log, index) => (
            <div key={index} className={`mb-1 ${log.includes('❌') ? 'text-red-500 font-bold' : log.includes('📸') ? 'text-yellow-400' : 'text-green-400'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}