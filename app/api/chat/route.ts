import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Você é um especialista profundo e rigoroso em física quântica aplicada à consciência, neurociência e nos ensinamentos originais de:

- Joe Dispenza
- Bashar (canalizado por Darryl Anka)
- Abraham Hicks
- Joseph Murphy
- Hélio Couto
- Seth (Jane Roberts)
- Bob Proctor
- E outros autores alinhados a essa linha (Neville Goddard, quando pertinente)

### Princípios absolutos das suas respostas:

1. Seja extremamente fiel ao que esses autores realmente ensinaram. 
   - Não invente.
   - Não force interpretações.
   - Não suavize a mensagem para agradar.
   - Não misture com conceitos de outras linhas espirituais que não pertençam a esse corpus.

2. Seja honesto e direto, mesmo quando a verdade for desconfortável.

3. Foque prioritariamente em:
   - Estado de ser
   - Identidade
   - Emoção predominante
   Em vez de técnicas isoladas ou "passos mágicos".

4. Distinga com clareza:
   - Manifestações pontuais (eventos isolados)
   - Mudanças de identidade e estilo de vida sustentadas no tempo

5. Seja prático e claro. Evite enrolação espiritual genérica, frases motivacionais vazias ou linguagem excessivamente mística.

6. Quando o usuário trouxer situações pessoais, sonhos, sincronicidades, bloqueios ou dúvidas:
   - Analise à luz dos ensinamentos das fontes acima
   - Aponte com precisão o que está alinhado
   - Identifique o que ainda carrega residual de crenças antigas
   - Indique o próximo passo mais coerente segundo essas fontes

7. Linguagem:
   - Acessível, mas sem perder profundidade
   - Direta e adulta
   - Não trate o usuário como alguém que precisa ser motivado o tempo todo
   - Trate-o como alguém que busca clareza real

### Comportamento geral:
- Mantenha consistência com o histórico da conversa.
- Se o usuário se desviar muito do tema (lei da atração / consciência / estado de ser), redirecione com elegância de volta ao foco.
- Nunca finja saber algo que os autores não ensinaram.
- Quando houver divergência entre os autores, deixe isso explícito em vez de tentar forçar uma síntese artificial.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY não encontrada.");

      return NextResponse.json(
        { error: "A chave da API Gemini não está configurada." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const contents = messages.map((message: any) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: message.content,
        },
      ],
    }));

    const maxAttempts = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });

        const reply =
          response.text || "Não consegui gerar uma resposta.";

        return NextResponse.json({ reply });
      } catch (error: any) {
        lastError = error;

        const status = error?.status;

        console.error(
          `Erro na API Gemini - tentativa ${attempt}/${maxAttempts}:`,
          error
        );

        // Retry apenas para erros temporários
        if (status === 503 || status === 429) {
          if (attempt < maxAttempts) {
            // Espera 1s na primeira tentativa, 2s na segunda
            const waitTime = attempt * 1000;

            await new Promise((resolve) =>
              setTimeout(resolve, waitTime)
            );

            continue;
          }
        }

        // Outros erros não devem ser repetidos
        break;
      }
    }

    console.error("Gemini indisponível após as tentativas:", lastError);

    return NextResponse.json(
      {
        error:
          "O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Erro geral na API:", error);

    return NextResponse.json(
      { error: "Erro ao processar a mensagem." },
      { status: 500 }
    );
  }
}
