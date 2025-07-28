import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

async function ingestData() {
  try {
    // 1. Cargar el documento
    // CAMBIA ESTO por la ruta a tu archivo PDF
    const loader = new PDFLoader("src/data/documento_de_prueba.pdf"); 
    const docs = await loader.load();

    console.log(`Cargado ${docs.length} documento(s).`);

    // 2. Dividir el texto en trozos (Chunks)
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000, // Tamaño de cada trozo
      chunkOverlap: 200, // Trozos de texto que se solapan para mantener contexto
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    console.log(`Documentos divididos en ${splitDocs.length} trozos.`);

    // 3. Inicializar modelos y clientes
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY! });
    const supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);

    console.log('Inicializando embeddings y cliente de Supabase...');

    // 4. Crear los embeddings y almacenarlos en Supabase
    await SupabaseVectorStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        client: supabaseClient,
        tableName: 'ingelean_documents',
        queryName: 'match_documents'
      }
    );

    console.log('¡Ingesta completada! Tu base de datos vectorial está lista.');

  } catch (error) {
    console.error('Ocurrió un error durante la ingesta:', error);
  }
}

ingestData();