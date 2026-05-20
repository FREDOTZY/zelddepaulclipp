import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method tidak diizinkan"
    });
  }

  try {
    const { videoLink } = req.body;

    if (!videoLink) {
      return res.status(400).json({
        success: false,
        error: "Link video wajib diisi"
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Kamu adalah AI video clip analyzer seperti Opus Clip.

Analisis link video berikut:
${videoLink}

Buat hasil dalam bahasa Indonesia:
1. 5 ide clip pendek viral
2. Judul tiap clip
3. Caption pendek
4. Hashtag
5. Alasan kenapa clip tersebut menarik
`
    });

    return res.status(200).json({
      success: true,
      result: response.output_text
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Gagal menghubungi OpenAI API"
    });
  }
}