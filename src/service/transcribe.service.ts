import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";
import { promptAi } from "../../utils"
import { IResponseObj } from "src/Interfaces/errorsInterface";

dotenv.config();

class OpenAiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  private async validateAnswer(transcription: string, answer: string) {
    const prompt = `${promptAi} Resposta correta: ${answer} Resposta do aluno (transcrita): ${transcription}`;
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Você é um mestre de Karatê Uechi Ryu, sábio e flexível. Sua tarefa é avaliar respostas de um quiz, focando na **intenção, som e significado** da resposta do aluno. **IGNORE PLURAL/SINGULAR, gênero e gramática.** Use linguagem humana, inspiradora e curta." 
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });
    return response;
  }

  public async transcribe(filePath: string, answer: string): Promise<IResponseObj> {
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        language: "pt",
      });
      fs.unlinkSync(filePath); // apaga o arquivo temporário
      const result = await this.validateAnswer(response.text, answer)
      
      return { code: 200, message: JSON.parse(result.choices[0].message.content) }
    } catch (error) {
      console.error("Erro no service:", error);
      throw new Error("Falha ao transcrever áudio");
    }
  }
}

export default OpenAiService;
