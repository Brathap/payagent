import os
import subprocess
import json
from PIL import Image, ImageDraw, ImageFont

FRAMES_DIR = "/tmp/studio_video_assets"
os.makedirs(FRAMES_DIR, exist_ok=True)
WIDTH, HEIGHT = 1920, 1080
EDGE_TTS_BIN = "/tmp/tts_venv/bin/edge-tts"

SCENES = [
    {
        "id": "scene_01_intro",
        "title": "PAYPAL AI HACKATHON 2026",
        "subtitle": "PayAgent Sentinel • Autonomous Agentic Commerce",
        "desc": "APCP Protocol × PayPal Orders v2 Sandbox × AG Grid Intelligence",
        "bullets": [
            "Solves Safe Autonomous Spending: Cryptographic spending mandates enforce buyer budget ceilings.",
            "Multi-Agent Arbitration Engine: Automates 10% partner rebates & PayPal Green offsets.",
            "1-Click Sandbox Execution: End-to-end cryptographic intent capture via PayPal Orders v2.",
            "AG Grid Enterprise Hub: Real-time transaction streaming & 1-click PayPal Dispute Defense dossiers.",
        ],
        "voice_text": "Welcome to PayAgent Sentinel, built for the PayPal AI Hackathon 2026. While autonomous AI agents are revolutionizing how people browse and shop, they cannot safely spend money without risking hallucinations or overspending. We created the Agentic Payment Consent Protocol to bring cryptographic guardrails to autonomous commerce.",
        "type": "title",
    },
    {
        "id": "scene_02_canvas",
        "title": "1. Shopper Agentic Canvas (Pristine Light Theme)",
        "subtitle": "Non-Bypassable Spending Mandates ($100 Max Budget Ceiling)",
        "pills": ["APCP Guardrails", "Zero-Overage", "PayPal Sandbox Ready"],
        "screenshot": "/tmp/payagent_video_frames/canvas_light.png",
        "voice_text": "Here on the Shopper Canvas, users define non-bypassable spending mandates. In this session, a hard one-hundred dollar ceiling is enforced alongside eco-certified product priority and automatic AI partner discount arbitration.",
        "type": "app",
        "highlight": "mandate",
    },
    {
        "id": "scene_03_arbitration",
        "title": "2. Real-Time Multi-Agent Arbitration Pipeline",
        "subtitle": "4-Stage Telemetry, 10% Partner Rebates, and Ed25519 Consent Nonces",
        "pills": ["Live Telemetry", "1-Click Capture", "PayPal / Venmo / Pay in 4"],
        "screenshot": "/tmp/payagent_video_frames/canvas_dark.png",
        "voice_text": "When a buyer issues a request, PayAgent's live arbitration engine matches inventory, arbitrates a 10% partner concession, adds a PayPal Green offset, and cryptographically signs an Ed25519 consent nonce bound to the order.",
        "type": "app",
        "highlight": "pipeline",
    },
    {
        "id": "scene_04_checkout",
        "title": "3. PayPal Orders v2 Instant Sandbox Capture",
        "subtitle": "Cryptographic Nonce Attestation & Instant Digital Settlement Pass",
        "pills": ["Orders v2 REST", "Digital Pass", "Sandbox Verified"],
        "screenshot": "/tmp/payagent_video_frames/canvas_dark.png",
        "voice_text": "With a single click, the staged transaction is dispatched directly to the PayPal Orders v2 Sandbox API, capturing the order with end-to-end cryptographic integrity and issuing an instant digital settlement pass.",
        "type": "app",
        "highlight": "checkout",
    },
    {
        "id": "scene_05_aggrid",
        "title": "4. AG Grid Enterprise Intelligence Terminal",
        "subtitle": "High-Density Data Grid (AG Grid v36 Quartz) with Live Streaming Telemetry",
        "pills": ["AG Grid v36", "Sylwia Vargas Track", "Live 3.5s Stream"],
        "screenshot": "/tmp/payagent_video_frames/merchant_light.png",
        "voice_text": "On the merchant side, transactions stream in real-time through an enterprise AG Grid table. Built with AG Grid v36 Community, merchants enjoy multi-column sorting, quick-filtering, volume telemetry, and instant CSV export.",
        "type": "app",
        "highlight": "grid",
    },
    {
        "id": "scene_06_dispute",
        "title": "5. AI Risk Audit & 1-Click PayPal Dispute Defense Dossier",
        "subtitle": "Automated Legal Affidavit for the PayPal Resolution Center",
        "pills": ["Zero-Dispute Shield", "Risk Scoring", "Evidence Generation"],
        "screenshot": "/tmp/payagent_video_frames/merchant_dark.png",
        "voice_text": "If an order is ever questioned, our AI Risk Copilot inspects the transaction and compiles a legally structured PayPal Dispute Defense Dossier, complete with the signed APCP nonce for the PayPal Resolution Center.",
        "type": "app",
        "highlight": "dispute",
    },
    {
        "id": "scene_07_api_outro",
        "title": "6. PayPal Orders v2 Developer REST Playground & Summary",
        "subtitle": "Public Open Source GitHub Repository • MIT Licensed",
        "pills": ["Orders v2 REST", "MIT License", "Ready for Evaluation"],
        "screenshot": "/tmp/payagent_video_frames/api_playground.png",
        "voice_text": "Developers can test the raw REST endpoints in the Protocol API Playground. PayAgent Sentinel makes autonomous agentic payments safe, accountable, and merchant-ready. Thank you, PayPal and AG Grid judges.",
        "type": "app",
        "highlight": "api",
    },
]

def get_font(size, bold=False):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/TTF/DejaVuSans.ttf",
        "/usr/share/fonts/liberation-sans/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/liberation-sans/LiberationSans-Regular.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def generate_voice(scene_idx, text):
    out_audio = os.path.join(FRAMES_DIR, f"voice_{scene_idx:02d}.mp3")
    cmd = [
        EDGE_TTS_BIN,
        "--voice", "en-US-AndrewMultilingualNeural",
        "--rate=+4%",
        "--text", text,
        "--write-media", out_audio,
    ]
    subprocess.run(cmd, check=True)
    
    # Get duration using ffprobe
    probe_cmd = f"ffprobe -v error -show_entries format=duration -of json {out_audio}"
    result = subprocess.run(probe_cmd, shell=True, capture_output=True, text=True)
    data = json.loads(result.stdout)
    duration = float(data["format"]["duration"])
    return out_audio, duration

def render_title_slide(scene, out_img):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(6, 9, 17))
    draw = ImageDraw.Draw(img)

    for y in range(HEIGHT):
        alpha = int(25 * (1 - y / HEIGHT))
        draw.line([(0, y), (WIDTH, y)], fill=(6 + alpha // 2, 9 + alpha, 17 + alpha * 2))

    draw.rectangle([(0, 0), (WIDTH, 8)], fill=(0, 112, 186))

    f_badge = get_font(26, bold=True)
    f_title = get_font(54, bold=True)
    f_sub = get_font(30, bold=False)
    f_det = get_font(24, bold=False)

    badge_text = f"  {scene['title']}  "
    draw.rounded_rectangle([(120, 140), (620, 195)], radius=14, fill=(0, 112, 186), outline=(0, 207, 232), width=2)
    draw.text((140, 148), badge_text, font=f_badge, fill=(255, 255, 255))

    draw.text((120, 240), scene["subtitle"], font=f_title, fill=(255, 255, 255))
    draw.text((120, 325), scene["desc"], font=f_sub, fill=(0, 207, 232))
    draw.line([(120, 395), (1800, 395)], fill=(255, 255, 255, 40), width=2)

    y_pos = 440
    for bullet in scene["bullets"]:
        draw.ellipse([(120, y_pos + 8), (136, y_pos + 24)], fill=(0, 112, 186), outline=(0, 207, 232))
        draw.text((160, y_pos), bullet, font=f_det, fill=(226, 232, 240))
        y_pos += 68

    draw.text((120, 980), "PayPal AI Hackathon 2026 • Built with PayPal Orders v2 Sandbox & AG Grid v36", font=f_det, fill=(148, 163, 184))
    img.save(out_img)

def render_app_slide(scene, out_img):
    base = Image.new("RGB", (WIDTH, HEIGHT), color=(6, 9, 17))
    draw = ImageDraw.Draw(base)

    # Header bar
    draw.rectangle([(0, 0), (WIDTH, 120)], fill=(13, 19, 33))
    draw.line([(0, 120), (WIDTH, 120)], fill=(0, 112, 186), width=2)

    f_title = get_font(34, bold=True)
    f_sub = get_font(20, bold=False)
    f_pill = get_font(18, bold=True)
    f_subtitles = get_font(22, bold=False)

    draw.text((50, 24), scene["title"], font=f_title, fill=(255, 255, 255))
    draw.text((50, 72), scene["subtitle"], font=f_sub, fill=(148, 163, 184))

    # Top right badges
    x_pill = WIDTH - 50
    for pill in reversed(scene.get("pills", [])):
        bbox = draw.textbbox((0, 0), pill, font=f_pill)
        pill_w = (bbox[2] - bbox[0]) + 30
        x_start = x_pill - pill_w
        draw.rounded_rectangle([(x_start, 40), (x_pill, 85)], radius=12, fill=(0, 48, 135), outline=(0, 207, 232), width=1)
        draw.text((x_start + 15, 50), pill, font=f_pill, fill=(0, 207, 232))
        x_pill = x_start - 15

    # Paste screenshot
    shot_path = scene.get("screenshot")
    if shot_path and os.path.exists(shot_path):
        shot = Image.open(shot_path)
        shot = shot.resize((1820, 840), Image.Resampling.LANCZOS)
        base.paste(shot, (50, 140))
        draw.rounded_rectangle([(48, 138), (1872, 982)], radius=16, outline=(0, 112, 186), width=2)

    # Lower-third animated voice subtitle bar
    draw.rounded_rectangle([(160, 1000), (1760, 1060)], radius=14, fill=(15, 23, 42), outline=(0, 207, 232), width=2)
    draw.text((190, 1018), f"🎙  NARRATION: \"{scene['voice_text']}\"", font=f_subtitles, fill=(241, 245, 249))

    base.save(out_img)

def main():
    print("=== Step 1: Generating Neural Studio Voiceovers & Dynamic Slides ===")
    scene_clips = []

    for idx, scene in enumerate(SCENES):
        print(f"\nProcessing Scene {idx+1}/{len(SCENES)}: {scene['id']}")
        
        # 1. Voice
        audio_file, duration = generate_voice(idx, scene["voice_text"])
        # Add 1.2s padding for smooth pacing
        total_scene_sec = round(duration + 1.2, 2)
        print(f"  Voice duration: {duration:.2f}s -> Scene total: {total_scene_sec:.2f}s")

        # 2. Frame Image
        frame_img = os.path.join(FRAMES_DIR, f"frame_{idx:02d}.png")
        if scene["type"] == "title":
            render_title_slide(scene, frame_img)
        else:
            render_app_slide(scene, frame_img)

        # 3. Create animated MP4 clip with subtle Ken Burns zoom + voice track
        clip_mp4 = os.path.join(FRAMES_DIR, f"clip_{idx:02d}.mp4")
        
        # Zoompan filter: slow camera zoom into center
        total_frames = int(total_scene_sec * 30)
        vf = (
            f"scale=1920x1080,"
            f"zoompan=z='min(zoom+0.0003,1.04)':d={total_frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30,"
            f"format=yuv420p"
        )
        
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", frame_img,
            "-i", audio_file,
            "-vf", vf,
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k",
            "-t", str(total_scene_sec),
            "-shortest",
            clip_mp4
        ]
        subprocess.run(cmd, check=True)
        scene_clips.append(clip_mp4)
        print(f"  Clip encoded: {clip_mp4}")

    print("\n=== Step 2: Concatenating all scenes into master video ===")
    concat_list = os.path.join(FRAMES_DIR, "clips_concat.txt")
    with open(concat_list, "w") as f:
        for clip in scene_clips:
            f.write(f"file '{clip}'\n")

    master_video = "/home/Brathap/payagent/payagent_demo.mp4"
    final_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_list,
        "-c", "copy",
        master_video
    ]
    subprocess.run(final_cmd, check=True)

    # Copy to public/ for instant browser streaming
    subprocess.run(f"cp {master_video} /home/Brathap/payagent/public/payagent_demo.mp4", shell=True)

    probe_cmd = f"ffprobe -v error -show_entries format=duration,size -of json {master_video}"
    res = subprocess.run(probe_cmd, shell=True, capture_output=True, text=True)
    meta = json.loads(res.stdout)["format"]
    duration = float(meta["duration"])
    size_mb = int(meta["size"]) / (1024 * 1024)

    print("\n=======================================================")
    print(f"MASTER DEMO VIDEO COMPLETED!")
    print(f"Location: {master_video}")
    print(f"Duration: {duration:.1f} seconds (~{duration/60:.1f} mins)")
    print(f"File Size: {size_mb:.2f} MB")
    print(f"URL: http://localhost:3001/payagent_demo.mp4")
    print("=======================================================")

if __name__ == "__main__":
    main()
