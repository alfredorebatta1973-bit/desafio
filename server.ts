import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

// Initialize Gemini API client on server
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Route: Generate Roast / Dynamic Performance Evaluation
app.post('/api/ai/roast', async (req: Request, res: Response) => {
  try {
    const { challengeTitle, score, maxScore, reactionTimeMs, accuracy, userRank } = req.body;

    if (!ai) {
      return res.json({
        roast: `¡Increíble puntuación de ${score} pts en ${challengeTitle}! Solo un selecto grupo logra entrar en el top de mejores jugadores.`,
        title: '¡Rendimiento Estelar!',
      });
    }

    const prompt = `Un usuario acaba de jugar al reto viral de 30 segundos titulado "${challengeTitle}".
Sus resultados son:
- Puntuación: ${score} de un máximo de ${maxScore} pts
- Tiempo de reacción / velocidad: ${reactionTimeMs || 'N/A'} ms
- Precisión: ${accuracy || 100}%
- Rango/Percentil otorgado: "${userRank}"

Genera una evaluación hilarante, directa y graciosa en español para compartir en redes sociales (WhatsApp, Instagram, TikTok).
Si la puntuación fue muy baja o falló rápido, haz un "roast" amistoso y cómico sobre sus reflejos o concentración.
Si la puntuación fue altísima, dale un elogio épico exagerado pero súper divertido.

Devuelve una respuesta JSON con este formato exacto:
{
  "roast": "Texto cómico o épico de 2 a 3 frases cortas.",
  "title": "Un título gracioso de 3 a 5 palabras para la insignia"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: { type: Type.STRING },
            title: { type: Type.STRING },
          },
          required: ['roast', 'title'],
        },
      },
    });

    const jsonText = response.text || '';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating AI roast:', error);
    res.json({
      roast: `¡Consiguiste ${req.body.score || 0} puntos en ${req.body.challengeTitle || 'el reto'}! ¡Tus amigos no lo van a poder creer!`,
      title: '¡Desafío Completado!',
    });
  }
});

// API Route: Generate AI Custom Challenge
app.post('/api/ai/custom-challenge', async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;

    if (!ai) {
      return res.json({
        title: `Reto AI: ${topic || 'Super Reflejos'}`,
        description: 'Encuentra las coincidencias secretas antes de que el contador de 30 segundos llegue a cero.',
        category: 'Lógica & Cálculo',
        difficulty: 'Media',
        durationSeconds: 20,
        gameType: 'math_blitz',
        question: '¿Cuánto es 12 + 15 × 2?',
        options: ['42', '54', '39', '44'],
        correctAnswer: '42',
        viralHook: '¡Solo el 5% de las personas responde esto sin calculadora en 5 segundos!',
      });
    }

    const prompt = `Crea un nuevo y divertidísimo mini-reto viral de 30 segundos en español para la app "RETO VIRAL".
El tema solicitado por el usuario es: "${topic || 'Cultura Pop y Reflejos'}".

Genera un JSON con los siguientes campos:
- title: Un título pegajoso (ej: "Acierta el Meme Ciberpunk", "Cálculo Galáctico")
- description: Instrucciones breves de 1 frase (máximo 15 palabras)
- category: Elegir una entre: "Reflejos & Velocidad", "Visual & Percepción", "Memoria & Secuencia", "Lógica & Cálculo", "Precisión & Enfoque"
- difficulty: "Fácil", "Media", "Difícil" o "Extrema"
- durationSeconds: número entre 10 y 25
- gameType: elegir entre "ninja_reflex", "speed_tap", "math_blitz", "color_illusion", "reverse_words"
- question: La pregunta o prueba principal
- options: Un arreglo de 4 opciones de respuesta corta en texto
- correctAnswer: La opción correcta exacta de las 4 opciones
- viralHook: Frase de gancho viral para desafiar amigos (ej: "Solo el 4% resuelve esto en menos de 10s")`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            durationSeconds: { type: Type.NUMBER },
            gameType: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
            viralHook: { type: Type.STRING },
          },
          required: ['title', 'description', 'category', 'difficulty', 'durationSeconds', 'gameType', 'question', 'options', 'correctAnswer', 'viralHook'],
        },
      },
    });

    const jsonText = response.text || '';
    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating AI custom challenge:', error);
    res.json({
      title: `Reto AI: ${req.body.topic || 'Desafío Mental'}`,
      description: 'Prueba tus reflejos y concentración en este reto generado por IA.',
      category: 'Reflejos & Velocidad',
      difficulty: 'Media',
      durationSeconds: 15,
      gameType: 'ninja_reflex',
      question: 'Toca el botón cuando se ponga VERDE LUZ',
      options: ['Listo', 'Esperar', 'Ya!', 'Siguiente'],
      correctAnswer: 'Ya!',
      viralHook: '¿Podrás superar mi tiempo de reacción?',
    });
  }
});

// API Route: Generate Music using Lyria Clip (`lyria-3-clip-preview`)
app.post('/api/ai/music', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API not initialized' });
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: prompt || 'Generate an upbeat electronic synthwave 30-second background track for a viral gaming challenge.',
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    res.json({ audioBase64, mimeType, lyrics });
  } catch (error: any) {
    console.error('Error generating music:', error);
    res.status(500).json({ error: error.message || 'Failed to generate music' });
  }
});

// API Route: Create / Edit Images using `gemini-nano-banana-2.1`
app.post('/api/ai/image-create', async (req: Request, res: Response) => {
  try {
    const { prompt, base64Image, aspectRatio = '1:1' } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API not initialized' });
    }

    const parts: any[] = [];
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }
    parts.push({ text: prompt || 'A futuristic cyberpunk neon trophy for viral champions.' });

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: '1K',
        },
      },
    });

    let imageUrl = '';
    let textOut = '';

    const candidates = response.candidates || [];
    for (const cand of candidates) {
      const candParts = cand.content?.parts || [];
      for (const part of candParts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textOut += part.text;
        }
      }
    }

    res.json({ imageUrl, text: textOut });
  } catch (error: any) {
    console.error('Error generating/editing image:', error);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

// API Route: Generate Video / Animate Image using `gemini-omni-1.1-flash` via Interactions API
app.post('/api/ai/video-generate', async (req: Request, res: Response) => {
  try {
    const { prompt, base64Image, aspectRatio = '16:9' } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API not initialized' });
    }

    const inputParts: any[] = [];
    if (base64Image) {
      inputParts.push({
        type: 'image',
        mime_type: 'image/jpeg',
        data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
      });
    }
    inputParts.push({
      type: 'text',
      text: prompt || 'Animate this image with cinematic camera motion and atmospheric particles.',
    });

    const interaction = await ai.interactions.create({
      model: 'gemini-omni-1.1-flash',
      input: inputParts,
      background: false,
      store: false,
      stream: false,
      response_format: {
        type: 'video',
        aspect_ratio: aspectRatio, // '16:9' or '9:16'
        duration: '5s',
        resolution: '720p',
      },
    }, { timeout: 300000 });

    const videoPart = interaction.output_video;
    if (videoPart && videoPart.data) {
      const videoUrl = `data:${videoPart.mime_type || 'video/mp4'};base64,${videoPart.data}`;
      return res.json({ videoUrl });
    }

    res.status(500).json({ error: 'Video generation completed without video output data.' });
  } catch (error: any) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: error.message || 'Failed to generate video' });
  }
});

// API Route: Audio Transcription using `gemini-3.5-transcribe`
app.post('/api/ai/transcribe', async (req: Request, res: Response) => {
  try {
    const { base64Audio, mimeType = 'audio/webm' } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API not initialized' });
    }

    const interaction = await ai.interactions.create({
      model: 'gemini-3.5-transcribe',
      input: [
        {
          type: 'audio',
          data: base64Audio.replace(/^data:audio\/\w+;base64,/, ''),
          mime_type: mimeType,
        },
        {
          type: 'text',
          text: 'Transcribe this audio clip accurately into Spanish text.',
        },
      ],
    });

    res.json({ transcript: interaction.output_text || 'Transcripción completada con éxito.' });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// Serve frontend in dev or prod
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = await vite.transformIndexHtml(url, `
<!doctype html>
<html lang="es" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RETO VIRAL | Desafíos de 30 Segundos entre Amigos</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#0b0716] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-pink-500 selection:text-white min-h-screen flex flex-col">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
      `);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 RETO VIRAL Server running on port ${PORT}`);
});
