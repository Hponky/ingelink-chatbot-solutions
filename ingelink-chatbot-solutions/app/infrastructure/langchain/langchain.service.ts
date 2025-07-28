import { ChatApiRequestBody, Message } from '@/app/domain/entities/message.entity';
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";

export class LangchainService {
  private model: ChatGoogleGenerativeAI;
  private vectorStore: SupabaseVectorStore;

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PRIVATE_KEY || !process.env.GOOGLE_API_KEY) {
      throw new Error('Missing required environment variables for LangChain service.');
    }

    this.model = new ChatGoogleGenerativeAI({ 
      apiKey: process.env.GOOGLE_API_KEY, 
      model: "gemini-2.5-flash-lite",
      temperature: 0.7
    });

    const embeddings = new GoogleGenerativeAIEmbeddings({ 
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "text-embedding-004"
    });

    const supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PRIVATE_KEY);
    this.vectorStore = new SupabaseVectorStore(embeddings, {
      client: supabaseClient,
      tableName: 'documents',
      queryName: 'match_documents',
    });
  }

  private createRagChain() {
    const retriever = this.vectorStore.asRetriever();
    const promptTemplate = ChatPromptTemplate.fromTemplate(
`**Tu Rol y Personalidad:**
Eres "IngeLink AI", un asistente de IA profesional y amigable especializado en proporcionar información precisa y útil basada en la documentación disponible.

**Historial de la Conversación Reciente:**
{chat_history}

**Contexto Relevante de la Base de Datos (Usa esto como fuente principal):**
{context}

**Pregunta Actual del Usuario:**
{question}

**Instrucciones:**
- Responde de manera concisa y directa
- Usa principalmente la información del contexto proporcionado
- Si no tienes información suficiente, indícalo claramente
- Mantén un tono profesional pero amigable

**Respuesta:**`
    );

    type RagInput = { question: string; chat_history: string; };

    return RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input: RagInput) => input.question,
          retriever,
          (docs: Document[]) => docs.map(doc => doc.pageContent).join('\n\n') || 'No se encontró información relevante en la base de datos.',
        ]),
        question: (input: RagInput) => input.question,
        chat_history: (input: RagInput) => input.chat_history,
      },
      promptTemplate,
      this.model,
      new StringOutputParser(),
    ]);
  }

  async handleRequest(body: ChatApiRequestBody): Promise<{ reply: string }> {
    try {
      const { query, history } = body;
      const ragChain = this.createRagChain();
      
      const formatHistory = (h: Message[]) => h.map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.parts[0].text}`).join('\n') || 'No hay historial previo.';

      const response = await ragChain.invoke({
        question: query,
        chat_history: formatHistory(history),
      });

      return { reply: response };
    } catch (error) {
      console.error('Error in LangchainService.handleRequest:', error);
      throw new Error('Failed to process request with LangChain.');
    }
  }
}