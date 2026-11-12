import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const execFileAsync = promisify(execFile);
const EDGE_TTS_BIN = '/tmp/tts_venv/bin/edge-tts';
const CACHE_DIR = '/tmp/tts_web_cache';

export async function GET(request: NextRequest) {
  try {
    const text = (request.nextUrl.searchParams.get('text') || '').trim();

    if (!text) {
      return NextResponse.json({ error: 'Text parameter required' }, { status: 400 });
    }

    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const cleanText = text.replace(/[*_#`~]/g, '').slice(0, 400);
    const hash = crypto.createHash('md5').update(cleanText).digest('hex');
    const cachedFile = path.join(CACHE_DIR, `${hash}.mp3`);

    if (!fs.existsSync(cachedFile) || fs.statSync(cachedFile).size === 0) {
      if (fs.existsSync(EDGE_TTS_BIN)) {
        await execFileAsync(EDGE_TTS_BIN, [
          '--voice', 'en-US-AndrewMultilingualNeural',
          '--rate=+4%',
          '--text', cleanText,
          '--write-media', cachedFile,
        ]);
      }
    }

    if (fs.existsSync(cachedFile) && fs.statSync(cachedFile).size > 100) {
      const buffer = fs.readFileSync(cachedFile);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400',
          'Content-Length': buffer.length.toString(),
        },
      });
    }

    return NextResponse.json({ error: 'Audio synthesis unavailable' }, { status: 503 });
  } catch (error) {
    console.error('Error generating dynamic TTS:', error);
    return NextResponse.json({ error: 'TTS processing failed' }, { status: 500 });
  }
}
