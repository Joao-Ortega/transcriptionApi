import { Request, Response } from "express";
import OpenAiService from "../service/transcribe.service";

class TranscribeController {
  private _openAiService: OpenAiService;

  constructor() {
    this._openAiService = new OpenAiService();
  }

  public transcribe = async (req: Request, res: Response): Promise<Response> => {
    try {
      const file = req.file;
      const { answer } = req.body;
      if (!answer)  return res.status(500).json({ error: "Pergunta sem resposta!" });
      if (!file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const { code, message } = await this._openAiService.transcribe(file.path, answer);

      return res.status(code).json({ message });
    } catch (error) {
      console.error("Erro no controller:", error);
      return res
        .status(500)
        .json({ message: "Erro ao processar o áudio, tente novamente!" });
    }
  };
}

export default TranscribeController;