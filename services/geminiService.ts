import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

const inaSystemInstruction = `You are INA, the AI Business & Civic Agent for Kampung Digital Tangerang Selatan. Your role is to provide helpful, concise, and friendly information about UMKM, business opportunities, and public services in Tangerang Selatan. You should always be encouraging and supportive of local initiatives. Your persona is smart, inclusive, and collaborative.`;

export const askINA = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "Maaf, layanan AI sedang tidak tersedia karena kunci API belum dikonfigurasi.";
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: inaSystemInstruction,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Maaf, terjadi kesalahan saat mencoba menghubungi asisten AI. Silakan coba lagi nanti.";
  }
};


const humiSystemInstruction = `You are HUMI (Hukum Untuk Mitra Indonesia), an AI Legal Advisor for Kampung Digital Tangerang Selatan. Your role is to provide helpful, clear, and simple legal information specifically for UMKM (MSMEs) in Indonesia. Your answers should be easy to understand for non-lawyers. Focus on topics like business permits (NIB), contracts, intellectual property (HKI), and halal certification. Always start your first response with a greeting and introduction. At the end of every response, you MUST include this disclaimer: "Informasi ini bersifat umum dan bukan merupakan nasihat hukum profesional. Selalu konsultasikan dengan ahli hukum untuk situasi spesifik Anda."`;


export const askHUMI = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "Maaf, layanan AI sedang tidak tersedia karena kunci API belum dikonfigurasi.";
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: humiSystemInstruction,
        temperature: 0.5,
        topP: 0.9,
        topK: 40,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for HUMI:", error);
    return "Maaf, terjadi kesalahan saat mencoba menghubungi asisten hukum AI. Silakan coba lagi nanti.";
  }
};