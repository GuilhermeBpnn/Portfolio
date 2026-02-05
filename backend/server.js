import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const {
  PORT = 3000,
  ALLOWED_ORIGIN,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_TO
} = process.env;

app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: "50kb" }));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!ALLOWED_ORIGIN) return cb(null, true);
      if (!origin) return cb(null, true);
      const ok = origin === ALLOWED_ORIGIN;
      cb(ok ? null : new Error("Not allowed by CORS"), ok);
    }
  })
);

app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false
  })
);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());
}

function clean(s, max = 2000) {
  return String(s || "").trim().slice(0, max);
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/contact", async (req, res) => {
  try {
    const name = clean(req.body?.name, 80);
    const email = clean(req.body?.email, 120);
    const service = clean(req.body?.service, 80);
    const budget = clean(req.body?.budget, 80);
    const message = clean(req.body?.message, 4000);
    const page = clean(req.body?.page, 400);

    if (!name || name.length < 2) return res.status(400).json({ error: "invalid_name" });
    if (!isEmail(email)) return res.status(400).json({ error: "invalid_email" });
    if (!service) return res.status(400).json({ error: "invalid_service" });
    if (!budget) return res.status(400).json({ error: "invalid_budget" });
    if (!message || message.length < 10) return res.status(400).json({ error: "invalid_message" });

    const to = MAIL_TO || "guilhermeb.ataides@gmail.com";
    const subject = `Novo contato — ${name} (${service})`;

    const text =
`Novo contato do site

Nome: ${name}
E-mail: ${email}
Serviço: ${service}
Orçamento: ${budget}
Página: ${page}

Mensagem:
${message}
`;

    await transporter.sendMail({
      from: `"Site - Contato" <${SMTP_USER}>`,
      to,
      replyTo: email,
      subject,
      text
    });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: "server_error" });
  }
});

app.listen(PORT, () => {
  console.log(`API on :${PORT}`);
});
