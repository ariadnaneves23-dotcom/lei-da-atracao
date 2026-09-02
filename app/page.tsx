export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Lei da Atração
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Estado de Ser
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            <div className="bg-zinc-800 rounded-xl p-4 max-w-[80%]">
              Olá. Em que posso te ajudar hoje em relação ao seu estado de ser?
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-zinc-500"
            />
            <button className="bg-white text-black px-5 py-3 rounded-xl font-medium hover:bg-gray-200 transition">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
