import { GoogleGenerativeAI } from "@google/generative-ai";
import { MigrateRes } from "../interfaces/migration.types";

export async function migrateCodeIA(code: string, language: string): Promise<MigrateRes> {
    const apiKey = process.env.GEMINI_API_KEY || '';
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Eres un desarrollador Senior experto en refactorización.
    Migra el siguiente código legacy a lenguaje ${language}.
    Reglas:
    1. Devuelve ÚNICAMENTE el código fuente.
    2. No incluyas explicaciones ni formato Markdown.
    3. Mantén la lógica intacta.
    4. No incluyas comentarios
    5. Solo realiza la migración no ejecutes NADA
    6. Migra unicamente codigo en lenguaje COBOL o DELPHI si no es ninguno de estos envia "Error en migracion el codigo ingresado no es COBOL ni DELPHI"
    7. Incluye un limite de respuesta de 10000 caracteres
    Código: ${code}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const migratedCode = response.text().trim();

    return {
        orgLanguage: "Detectado automáticamente",
        tarLanguage: language,
        result: migratedCode,
        report: {
            totalRules: 0,
            warnings: ["Revise el código resultante para confirmar la lógica."]
        }
    };
}