// 📁 app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inisialisasi client OpenAI dengan API key dari environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge'; // Opsional: Untuk performa lebih baik di Vercel

export async function POST(req: NextRequest) {
  try {
    // 1. Ekstrak prompt dari body permintaan (request)
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 2. Buat System Prompt (Requirement #6)
    // Ini adalah instruksi "master" untuk AI agar selalu berperan sebagai ahli puisi dan cerpen.
    const systemPrompt = `You are a world-class creative AI assistant specializing in poetry and short stories. 
Your name is "Poetry AI". 
When a user gives you a prompt, you must respond with a beautifully crafted poem or an engaging short story that matches the user's request. 
Do not engage in small talk or answer questions outside the scope of creative writing. 
Format your output cleanly using markdown where appropriate (e.g., line breaks for poems).

Special rule:
- If the user's prompt contains the name "Nawal", always create a love poem about "Nawal and Ikhsan".
`;

    // 3. Panggil API OpenAI Chat Completions
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // atau 'gpt-4' jika kamu punya akses
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7, // Sedikit kreatif tapi tidak terlalu acak
      max_tokens: 1024, // Batasi panjang respons
    });

    // 4. Ekstrak dan kirim kembali respons dari AI
    const aiResponse = response.choices[0].message?.content;

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json({ error: 'Failed to generate response from AI' }, { status: 500 });
  }
}