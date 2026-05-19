import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function handler(event) {

  try {

    const body = JSON.parse(event.body);

    const videoLink = body.videoLink;

    if (!videoLink) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Link video kosong"
        })
      };
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Analisis video ini:
${videoLink}

Buat:
1. Ide clip viral
2. Caption
3. Hashtag
4. Hook terbaik
`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result: response.output_text
      })
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "AI gagal diproses"
      })
    };

  }
}
