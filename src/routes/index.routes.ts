import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import TranscribeController from "../controllers/transcribe.controller";

const transcribeController = new TranscribeController();
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".webm";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.get("/", (_req: Request, res: Response) =>
  res.status(200).json({ message: "Let's transcribe something!" })
);

router.post("/transcribe", upload.single("audio"), transcribeController.transcribe);

export default router;