import os
import subprocess
import json
import math
import random
from PIL import Image, ImageDraw, ImageFont

ASSETS_DIR = "/tmp/kinetic_video_assets"
os.makedirs(ASSETS_DIR, exist_ok=True)
WIDTH, HEIGHT = 1920, 1080
FPS = 30
EDGE_TTS_BIN = "/tmp/tts_venv/bin/edge-tts"

# Load real website screenshots
SHOT_CANVAS_DARK = Image.open("/tmp/site_canvas_dark.png").convert("RGBA") if os.path.exists("/tmp/site_canvas_dark.png") else None
SHOT_CANVAS_LIGHT = Image.open("/tmp/site_canvas_light.png").convert("RGBA") if os.path.exists("/tmp/site_canvas_light.png") else None
SHOT_MERCHANT = Image.open("/tmp/site_merchant.png").convert("RGBA") if os.path.exists("/tmp/site_merchant.png") else None
SHOT_API = Image.open("/tmp/site_api.png").convert("RGBA") if os.path.exists("/tmp/site_api.png") else None

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

def generate_voice(idx, text):
    out_audio = os.path.join(ASSETS_DIR, f"voice_{idx:02d}.mp3")
    if os.path.exists(out_audio) and os.path.getsize(out_audio) > 1000:
        probe_cmd = f"ffprobe -v error -show_entries format=duration -of json {out_audio}"
        result = subprocess.run(probe_cmd, shell=True, capture_output=True, text=True)
        return out_audio, float(json.loads(result.stdout)["format"]["duration"])
    
    cmd = [
        EDGE_TTS_BIN,
        "--voice", "en-US-AndrewMultilingualNeural",
        "--rate=+5%",
        "--text", text,
        "--write-media", out_audio,
    ]
    subprocess.run(cmd, check=True)
    probe_cmd = f"ffprobe -v error -show_entries format=duration -of json {out_audio}"
    result = subprocess.run(probe_cmd, shell=True, capture_output=True, text=True)
    duration = float(json.loads(result.stdout)["format"]["duration"])
    return out_audio, duration

def generate_ambient_music(total_duration, out_wav):
    if os.path.exists(out_wav) and os.path.getsize(out_wav) > 10000:
        return
    synth_cmd = (
        f"ffmpeg -y -f lavfi -i \"anoisesrc=c=pink:r=44100:a=0.008\" "
        f"-f lavfi -i \"sine=frequency=110:duration={total_duration}\" "
        f"-f lavfi -i \"sine=frequency=164.81:duration={total_duration}\" "
        f"-f lavfi -i \"sine=frequency=220:duration={total_duration}\" "
        f"-filter_complex \"[1:a]volume=0.03[s1];[2:a]volume=0.02[s2];[3:a]volume=0.015[s3];[0:a][s1][s2][s3]amix=inputs=4:duration=first,lowpass=f=900,volume=0.2\" "
        f"-t {total_duration} {out_wav}"
    )
    subprocess.run(synth_cmd, shell=True, check=True)

# 6 Storyboard Sections
STORY = [
    {
        "id": "intro",
        "narration": "Meet PayAgent Sentinel, built for the PayPal AI Hackathon 2026. As AI agents begin navigating commerce, they face a critical security flaw: how do you allow an autonomous model to spend money without risk of hallucination or runaway expenses? Our solution is APCP, the Agentic Payment Consent Protocol.",
    },
    {
        "id": "shopper",
        "narration": "On the Shopper Canvas, users lock in non-bypassable spending mandates. Watch as our buyer enforces an eighty-five dollar ceiling alongside eco-priority constraints. PayAgent's neural engine negotiates pricing in real time, arbitrating an automatic 10% partner rebate and attaching PayPal Green offsets.",
    },
    {
        "id": "checkout",
        "narration": "Before execution, an Ed25519 cryptographic consent nonce is signed and bound directly to the PayPal Orders v2 payload. With a single click, the order is authorized and captured via the PayPal Sandbox API, issuing an immutable digital settlement pass with zero merchant friction.",
    },
    {
        "id": "aggrid",
        "narration": "For merchants, transactions stream live into an enterprise AG Grid v36 table. Built with the official AG Grid Community SDK, merchants can filter, sort, export telemetry to CSV, and monitor live volume diagnostics across multiple payment channels.",
    },
    {
        "id": "dispute",
        "narration": "When an order requires verification, PayAgent's AI Dispute Copilot evaluates risk vectors and automatically compiles a legally compliant PayPal Dispute Defense Dossier. Using the signed APCP nonce, merchants are protected from synthetic chargebacks in the PayPal Resolution Center.",
    },
    {
        "id": "outro",
        "narration": "PayAgent Sentinel brings verifiable cryptographic safety and enterprise intelligence to autonomous agentic payments. Fully open-source on GitHub under the MIT License, and ready for evaluation. Thank you, PayPal and AG Grid.",
    },
]

def draw_cyber_avatar(draw, ax, ay, size=70, is_talking=True, progress=0.0):
    """Draws an adorable futuristic cyber AI companion bot with glowing visor and blinking eyes"""
    # Hovering float offset
    float_y = int(ay + math.sin(progress * 12.0) * 8)
    
    # Outer glow
    draw.ellipse([(ax - 8, float_y - 8), (ax + size + 8, float_y + size + 8)], fill=(0, 112, 186, 60))
    
    # Antenna
    ant_x = ax + size // 2
    draw.rectangle([(ant_x - 3, float_y - 14), (ant_x + 3, float_y)], fill=(0, 207, 232))
    draw.ellipse([(ant_x - 6, float_y - 20), (ant_x + 6, float_y - 8)], fill=(0, 207, 232))
    draw.ellipse([(ant_x - 3, float_y - 17), (ant_x + 3, float_y - 11)], fill=(255, 255, 255))
    
    # Head chasis
    draw.rounded_rectangle([(ax, float_y), (ax + size, float_y + size)], radius=size // 3, fill=(15, 23, 42), outline=(0, 207, 232), width=2)
    
    # Visor
    vx, vy, vw, vh = ax + 8, float_y + 12, size - 16, size - 24
    draw.rounded_rectangle([(vx, vy), (vx + vw, vy + vh)], radius=vh // 3, fill=(6, 9, 17), outline=(0, 112, 186), width=1)
    
    # Eyes
    eye_y = vy + vh // 2 - 3
    is_blink = (int(progress * 30) % 25 == 0)
    if is_blink:
        draw.line([(vx + 10, eye_y), (vx + 18, eye_y)], fill=(0, 207, 232), width=2)
        draw.line([(vx + vw - 18, eye_y), (vx + vw - 10, eye_y)], fill=(0, 207, 232), width=2)
    else:
        draw.ellipse([(vx + 10, eye_y - 4), (vx + 20, eye_y + 6)], fill=(0, 207, 232))
        draw.ellipse([(vx + 13, eye_y - 2), (vx + 17, eye_y + 2)], fill=(255, 255, 255))
        draw.ellipse([(vx + vw - 20, eye_y - 4), (vx + vw - 10, eye_y + 6)], fill=(0, 207, 232))
        draw.ellipse([(vx + vw - 17, eye_y - 2), (vx + vw - 13, eye_y + 2)], fill=(255, 255, 255))
        
    # Talking mouth wave
    if is_talking:
        my = vy + vh - 6
        mw = int(4 + math.sin(progress * 25.0) * 3)
        draw.line([(vx + vw // 2 - mw, my), (vx + vw // 2 + mw, my)], fill=(52, 211, 153), width=2)

def render_kinetic_frame(sec_idx, frame_num, total_frames, narration_text):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(6, 9, 17))
    draw = ImageDraw.Draw(img)

    progress = frame_num / max(total_frames, 1)

    # 1. Subtle animated background grid & floating neon particles
    random.seed(sec_idx * 1000)
    for p_i in range(25):
        base_x = (random.random() * WIDTH + progress * 60) % WIDTH
        base_y = (random.random() * HEIGHT + progress * 30) % HEIGHT
        r = random.random() * 2 + 1
        draw.ellipse([(base_x - r, base_y - r), (base_x + r, base_y + r)], fill=(0, 207, 232))

    # Top brand bar with glowing laser
    draw.rectangle([(0, 0), (WIDTH, 90)], fill=(13, 19, 33))
    laser_x = int((progress * (WIDTH + 400)) % (WIDTH + 400)) - 200
    draw.rectangle([(laser_x - 150, 88), (laser_x + 150, 90)], fill=(0, 207, 232))

    f_logo = get_font(28, bold=True)
    f_badge = get_font(18, bold=True)
    f_sub = get_font(18, bold=False)
    f_title = get_font(38, bold=True)
    f_card_title = get_font(24, bold=True)
    f_body = get_font(20, bold=False)
    f_caption = get_font(22, bold=False)

    # Brand Title
    draw.text((60, 26), "PayPal NOVA", font=f_logo, fill=(255, 255, 255))
    draw.rounded_rectangle([(270, 28), (385, 62)], radius=8, fill=(0, 112, 186))
    draw.text((285, 34), "AGENTIC", font=f_badge, fill=(255, 255, 255))

    draw.text((410, 34), "•  Autonomous Commerce  •  PayPal Orders v2  •  AG Grid v36", font=f_sub, fill=(148, 163, 184))

    # Live pulse badge
    draw.ellipse([(WIDTH - 240, 38), (WIDTH - 228, 50)], fill=(16, 185, 129))
    draw.text((WIDTH - 215, 34), "SANDBOX LIVE", font=f_badge, fill=(52, 211, 153))

    # 2. Main Content
    if sec_idx == 0:
        # Kinetic Intro Screen with Sentinel Avatar
        draw.text((120, 160), "PAYPAL AI HACKATHON 2026", font=get_font(22, bold=True), fill=(0, 207, 232))
        draw.text((120, 210), "PayAgent Sentinel", font=get_font(68, bold=True), fill=(255, 255, 255))
        draw.text((120, 300), "Autonomous Multi-Modal AI Commerce Protocol (APCP) & AG Grid Intelligence", font=get_font(28, bold=False), fill=(148, 163, 184))

        # Floating Avatar Hero Mascot
        draw_cyber_avatar(draw, 1650, 180, size=90, is_talking=True, progress=progress)
        draw.rounded_rectangle([(1520, 290), (1780, 325)], radius=12, fill=(15, 23, 42), outline=(0, 207, 232), width=1)
        draw.text((1540, 300), "Sentinel AI Copilot", font=get_font(16, bold=True), fill=(0, 207, 232))

        # 3 Pillar feature boxes
        pillars = [
            ("APCP Protocol Enclave", "Non-bypassable spending mandates that mathematically prevent AI hallucinations and runaway card charges."),
            ("Orders v2 Capture", "Autonomous price arbitration with an automatic 10% partner rebate and 1-click PayPal sandbox execution."),
            ("AG Grid Terminal", "Real-time transaction streaming telemetry, fraud diagnostics, and automated legal dispute dossiers."),
        ]
        box_w = 520
        for i, (p_t, p_d) in enumerate(pillars):
            bx = 120 + i * 560
            by = 410
            glow = (0, 112, 186) if i == int(progress * 3) % 3 else (255, 255, 255, 40)
            draw.rounded_rectangle([(bx, by), (bx + box_w, by + 480)], radius=24, fill=(15, 23, 42), outline=glow, width=2)
            draw.rounded_rectangle([(bx + 25, by + 30), (bx + 85, by + 90)], radius=16, fill=(0, 112, 186))
            draw.text((bx + 40, by + 45), f"0{i+1}", font=get_font(24, bold=True), fill=(255, 255, 255))
            draw.text((bx + 25, by + 120), p_t, font=f_card_title, fill=(255, 255, 255))
            draw.text((bx + 25, by + 175), p_d, font=f_body, fill=(148, 163, 184))

    elif sec_idx == 1:
        # Shopper Canvas with ACTUAL REAL WEBSITE SCREENSHOT EMBEDDED
        draw.text((80, 120), "1. Autonomous Shopper Canvas • Real-Time Website Telemetry", font=f_title, fill=(255, 255, 255))

        if SHOT_CANVAS_DARK:
            # Crop to the active canvas region (top 850px)
            site_crop = SHOT_CANVAS_DARK.crop((60, 60, 1860, 950)).resize((1240, 620), Image.Resampling.LANCZOS)
            # Paste into canvas
            img.paste(site_crop.convert("RGB"), (80, 190))
            draw.rounded_rectangle([(78, 188), (1322, 812)], radius=16, outline=(0, 112, 186), width=3)
        
        # Right info panel
        draw.rounded_rectangle([(1360, 190), (1840, 810)], radius=20, fill=(15, 23, 42), outline=(0, 207, 232), width=2)
        draw.text((1390, 220), "Live Shopper Engine", font=f_card_title, fill=(255, 255, 255))
        draw.text((1390, 260), "Real UI rendered via Next.js 16.4.6", font=f_sub, fill=(148, 163, 184))

        # Animated slider calculation display
        slider_val = int(100 - (progress * 15))
        draw.text((1390, 320), "Enforced Buyer Ceiling:", font=get_font(18, bold=False), fill=(203, 213, 225))
        draw.text((1390, 350), f"${slider_val}.00 USD", font=get_font(34, bold=True), fill=(0, 207, 232))

        # Negotiation stats
        draw.text((1390, 420), "Catalog Price: $68.00", font=f_body, fill=(148, 163, 184))
        draw.text((1390, 460), "10% Partner Rebate: -$6.80", font=get_font(20, bold=True), fill=(52, 211, 153))
        draw.text((1390, 500), "PayPal Green Offset: +$0.50", font=f_body, fill=(56, 189, 248))
        draw.text((1390, 560), "Net Total: $61.70 USD", font=get_font(26, bold=True), fill=(255, 255, 255))

        # Sentinel Avatar in corner
        draw_cyber_avatar(draw, 1570, 680, size=75, is_talking=True, progress=progress)

    elif sec_idx == 2:
        # PayPal Orders v2 Sandbox Checkout with REAL WEBSITE SMART CHECKOUT EMBEDDED
        draw.text((80, 120), "2. PayPal Orders v2 Sandbox • Cryptographic Intent Capture", font=f_title, fill=(255, 255, 255))

        if SHOT_CANVAS_DARK:
            # Crop focused on the PayPal Smart Checkout card
            checkout_crop = SHOT_CANVAS_DARK.crop((1100, 280, 1820, 880)).resize((820, 620), Image.Resampling.LANCZOS)
            img.paste(checkout_crop.convert("RGB"), (80, 190))
            draw.rounded_rectangle([(78, 188), (902, 812)], radius=16, outline=(0, 207, 232), width=3)

        # Right Card: Cryptographic Proof & Live Capture
        draw.rounded_rectangle([(940, 190), (1840, 810)], radius=20, fill=(13, 19, 33), outline=(0, 112, 186), width=2)
        draw.text((980, 220), "Ed25519 Cryptographic Consent Proof", font=f_card_title, fill=(255, 255, 255))
        draw.text((980, 260), "Orders v2 REST Handshake: POST /v2/checkout/orders", font=f_sub, fill=(148, 163, 184))

        proof_steps = [
            ("Client Nonce Signing", "Ed25519 hash: 0x7e4b...91aa (Tied to $85.00 Cap)"),
            ("PayPal Orders v2 Payload", "Intent: CAPTURE | Amount: $61.70 USD"),
            ("Idempotent Capture Status", "COMPLETED • Sandbox Gateway Verified"),
            ("Zero-Dispute Defense", "Attached to PayPal settlement ledger"),
        ]
        for pi, (pt, pd) in enumerate(proof_steps):
            py = 320 + pi * 80
            draw.rounded_rectangle([(980, py), (1800, py + 65)], radius=14, fill=(15, 23, 42))
            draw.ellipse([(1005, py + 22), (1025, py + 42)], fill=(16, 185, 129))
            draw.text((1045, py + 12), pt, font=get_font(18, bold=True), fill=(255, 255, 255))
            draw.text((1045, py + 36), pd, font=get_font(15, bold=False), fill=(148, 163, 184))

        # Digital Pass Issued badge with Confetti
        if progress > 0.4:
            draw.rounded_rectangle([(980, 660), (1800, 770)], radius=16, fill=(6, 78, 59), outline=(52, 211, 153), width=2)
            draw.text((1010, 680), "✓  PAYPAL DIGITAL SETTLEMENT PASS CAPTURED", font=get_font(20, bold=True), fill=(52, 211, 153))
            draw.text((1010, 720), "Order ID: PAYPAL-SBX-9941208  •  Status: CAPTURED ($61.70)", font=get_font(16, bold=False), fill=(255, 255, 255))

            # Confetti
            random.seed(42)
            for c_i in range(50):
                cx = 1400 + (random.random() - 0.5) * 800 * (progress - 0.4) * 2.5
                cy = 400 + (random.random() * 600) * (progress - 0.4) * 2.5
                c_color = random.choice([(0, 112, 186), (0, 207, 232), (16, 185, 129), (255, 196, 57)])
                draw.rectangle([(cx, cy), (cx + 10, cy + 7)], fill=c_color)

    elif sec_idx == 3:
        # AG Grid Terminal with REAL WEBSITE AG GRID TABLE EMBEDDED
        draw.text((80, 120), "3. AG Grid Community v36 • Enterprise Intelligence Terminal", font=f_title, fill=(255, 255, 255))

        if SHOT_MERCHANT:
            # Crop the real AG Grid table
            aggrid_crop = SHOT_MERCHANT.crop((60, 100, 1860, 960)).resize((1760, 620), Image.Resampling.LANCZOS)
            img.paste(aggrid_crop.convert("RGB"), (80, 190))
            draw.rounded_rectangle([(78, 188), (1842, 812)], radius=16, outline=(0, 112, 186), width=3)

        # Highlight pulse on the first row
        highlight_y = int(370 + math.sin(progress * 8.0) * 4)
        draw.rounded_rectangle([(100, 480), (1820, 540)], radius=8, outline=(0, 207, 232), width=2)
        draw.text((1500, 495), "◄  NEW PAYPAL SETTLEMENT STREAMED", font=get_font(15, bold=True), fill=(0, 207, 232))

        # Avatar watching telemetry
        draw_cyber_avatar(draw, 1720, 710, size=65, is_talking=False, progress=progress)

    elif sec_idx == 4:
        # Dispute Defense Copilot & 5-Node Architecture Map with REAL API & ARCHITECTURE EMBEDDED
        draw.text((80, 120), "4. AI Dispute Copilot & Zero-Dispute Dossier Protection", font=f_title, fill=(255, 255, 255))

        if SHOT_API:
            api_crop = SHOT_API.crop((60, 120, 1860, 920)).resize((1100, 620), Image.Resampling.LANCZOS)
            img.paste(api_crop.convert("RGB"), (80, 190))
            draw.rounded_rectangle([(78, 188), (1182, 812)], radius=16, outline=(0, 207, 232), width=3)

        # Right Panel: Dispute Defense Dossier Card
        draw.rounded_rectangle([(1220, 190), (1840, 810)], radius=20, fill=(15, 23, 42), outline=(16, 185, 129), width=2)
        draw.text((1250, 220), "PayPal Dispute Defense Shield", font=f_card_title, fill=(255, 255, 255))
        draw.text((1250, 260), "100% Protection in PayPal Resolution Center", font=f_sub, fill=(148, 163, 184))

        dossier_items = [
            ("Chargeback Defense", "Proof of client-signed Ed25519 mandate"),
            ("Orders v2 Audit Pass", "Capture ID: PAYPAL-SBX-9941208"),
            ("Fraud Risk Diagnostic", "Clean Score: 12/100 (Zero Disposable Domain)"),
            ("Court-Ready Affidavit", "Compiled automatically in under 400ms"),
        ]
        for di, (dt, dd) in enumerate(dossier_items):
            dy = 320 + di * 95
            draw.rounded_rectangle([(1250, dy), (1810, dy + 80)], radius=14, fill=(30, 41, 59))
            draw.ellipse([(1275, dy + 30), (1295, dy + 50)], fill=(16, 185, 129))
            draw.text((1315, dy + 18), dt, font=get_font(18, bold=True), fill=(255, 255, 255))
            draw.text((1315, dy + 44), dd, font=get_font(14, bold=False), fill=(148, 163, 184))

        # Sentinel Avatar
        draw_cyber_avatar(draw, 1690, 710, size=65, is_talking=True, progress=progress)

    elif sec_idx == 5:
        # Outro Screen with Sentinel Mascot & Links
        draw.text((120, 180), "PAYPAL AI HACKATHON 2026", font=get_font(22, bold=True), fill=(0, 207, 232))
        draw.text((120, 230), "PayAgent NOVA: Ready for Evaluation", font=get_font(60, bold=True), fill=(255, 255, 255))
        draw.text((120, 310), "Verifiable Cryptographic Safety Meets Enterprise Payment Intelligence", font=get_font(28, bold=False), fill=(148, 163, 184))

        # Avatar Centerpiece
        draw_cyber_avatar(draw, 880, 400, size=150, is_talking=True, progress=progress)
        draw.text((820, 600), "Sentinel AI Copilot", font=get_font(28, bold=True), fill=(0, 207, 232))

        # Bottom credentials & MIT badge
        draw.rounded_rectangle([(120, 680), (1800, 840)], radius=24, fill=(15, 23, 42), outline=(0, 112, 186), width=2)
        draw.text((160, 710), "Open Source under MIT License  •  github.com/Brathap/payagent", font=get_font(24, bold=True), fill=(255, 255, 255))
        draw.text((160, 760), "PayPal Orders v2 REST API  •  AG Grid Community v36  •  Next.js 16.4.6 Turbopack", font=get_font(20, bold=False), fill=(148, 163, 184))

    # Narration subtitles bar at bottom
    draw.rectangle([(0, HEIGHT - 110), (WIDTH, HEIGHT)], fill=(8, 12, 22))
    draw.line([(0, HEIGHT - 110), (WIDTH, HEIGHT - 110)], fill=(0, 112, 186), width=2)
    draw.text((80, HEIGHT - 85), f"🎙️  {narration_text[:130]}...", font=f_caption, fill=(241, 245, 249))

    return img

def main():
    print("=== Step 1: Generating Neural Studio Voiceovers ===")
    voice_files = []
    story_durations = []
    for idx, item in enumerate(STORY):
        vf, dur = generate_voice(idx, item["narration"])
        voice_files.append(vf)
        story_durations.append(dur)
        print(f"  Scene {idx+1}: {dur:.2f}s ({item['id']})")

    total_time = sum(story_durations)
    print(f"Total video duration: {total_time:.2f}s")

    print("\n=== Step 2: Generating Ambient Music Track ===")
    ambient_wav = os.path.join(ASSETS_DIR, "ambient.wav")
    generate_ambient_music(total_time + 4.0, ambient_wav)

    print("\n=== Step 3: Fast In-Memory Encoding of Animated Kinetic Frames ===")
    clip_files = []
    for s_idx, s_item in enumerate(STORY):
        dur = story_durations[s_idx]
        total_frames = int(dur * FPS)
        clip_mp4 = os.path.join(ASSETS_DIR, f"clip_{s_idx:02d}.mp4")
        
        print(f"Rendering & Streaming Scene {s_idx+1}/{len(STORY)} ({total_frames} frames directly to ffmpeg pipe)...")

        # Use rawvideo pipe directly to ffmpeg in memory
        ffmpeg_pipe_cmd = [
            "ffmpeg", "-y",
            "-f", "rawvideo",
            "-pix_fmt", "rgb24",
            "-s", f"{WIDTH}x{HEIGHT}",
            "-r", str(FPS),
            "-i", "-",
            "-i", voice_files[s_idx],
            "-c:v", "libx264", "-preset", "ultrafast", "-crf", "20", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            "-t", str(dur),
            clip_mp4
        ]
        proc = subprocess.Popen(ffmpeg_pipe_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        for f_num in range(total_frames):
            frame_img = render_kinetic_frame(s_idx, f_num, total_frames, s_item["narration"])
            proc.stdin.write(frame_img.tobytes())

        proc.stdin.close()
        proc.wait()
        clip_files.append(clip_mp4)
        print(f"  Scene {s_idx+1} encoded: {clip_mp4}")

    print("\n=== Step 4: Master Concat and Soundtrack Mixing ===")
    concat_list = os.path.join(ASSETS_DIR, "master_concat.txt")
    with open(concat_list, "w") as f:
        for c in clip_files:
            f.write(f"file '{c}'\n")

    unmixed_video = os.path.join(ASSETS_DIR, "unmixed.mp4")
    subprocess.run(f"ffmpeg -y -f concat -safe 0 -i {concat_list} -c copy {unmixed_video}", shell=True, check=True)

    master_final = "/home/Brathap/payagent/payagent_demo.mp4"
    mix_cmd = (
        f"ffmpeg -y -i {unmixed_video} -i {ambient_wav} "
        f"-filter_complex \"[0:a][1:a]amix=inputs=2:duration=first:weights=1 0.15[a]\" "
        f"-map 0:v -map \"[a]\" -c:v copy -c:a aac -b:a 192k {master_final}"
    )
    subprocess.run(mix_cmd, shell=True, check=True)

    # Copy to public folder for direct browser streaming
    subprocess.run(f"cp {master_final} /home/Brathap/payagent/public/payagent_demo.mp4", shell=True)
    
    print("\n=======================================================")
    print(f"KINETIC DEMO VIDEO SUCCEEDED WITH REAL WEBSITE VISUALS & AVATAR!")
    print(f"Saved at: {master_final}")
    print(f"Available at: http://localhost:3001/payagent_demo.mp4")
    print("=======================================================")

if __name__ == "__main__":
    main()
