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
        { role: "system", content: "Você é um avaliador objetivo e preciso." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });
    console.log('prompt', prompt)
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
      
      console.log('result', result.choices[0].message.content)
      return { code: 200, message: JSON.parse(result.choices[0].message.content) }
    } catch (error) {
      console.error("Erro no service:", error);
      throw new Error("Falha ao transcrever áudio");
    }
  }
}

export default OpenAiService;
