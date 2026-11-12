import os
import sys
import subprocess
import json
import math
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH, HEIGHT = 1920, 1080
FPS = 24
OUTPUT_DIR = "/tmp/payagent_3d_video"
os.makedirs(OUTPUT_DIR, exist_ok=True)
EDGE_TTS_BIN = "/tmp/tts_venv/bin/edge-tts"

def load_img(path):
    if os.path.exists(path):
        return Image.open(path).convert("RGBA")
    return None

SHOTS = {
    "hero": load_img("/home/Brathap/payagent/public/screens/screen_canvas_hero.png"),
    "reasoning": load_img("/home/Brathap/payagent/public/screens/screen_reasoning_matrix.png"),
    "audit": load_img("/home/Brathap/payagent/public/screens/screen_merchant_audit.png"),
    "roi_dispute": load_img("/home/Brathap/payagent/public/screens/screen_roi_dispute.png"),
    "api": load_img("/home/Brathap/payagent/public/screens/screen_api_playground.png"),
}

def get_font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/TTF/DejaVuSans.ttf",
        "/usr/share/fonts/liberation-sans/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/liberation-sans/LiberationSans-Regular.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

FONT_TITLE = get_font(46, bold=True)
FONT_HEADING = get_font(32, bold=True)
FONT_SUB = get_font(20, bold=False)
FONT_BADGE = get_font(16, bold=True)
FONT_TINY = get_font(13, bold=False)
FONT_CODE = get_font(15, bold=True)

SCENES = [
    {
        "id": "scene1_problem_intro",
        "title": "Autonomous AI Spending Without Safeguards is Broken",
        "subtitle": "PayAgent & APCP Protocol: The Zero-Dispute Standard for Autonomous Commerce",
        "shot_key": "hero",
        "narration": "Meet PayAgent, built for the PayPal AI Hackathon 2026. As autonomous AI agents begin making real-world purchases, e-commerce faces a critical crisis: runaway overspending, lack of buyer intent verification, and catastrophic synthetic chargebacks. PayAgent introduces APCP, the Agentic Payment Consent Protocol.",
    },
    {
        "id": "scene2_reasoning_console",
        "title": "Sub-50ms Autonomous Agent Reasoning Console",
        "subtitle": "Deterministic Spending Mandate Verification with Ed25519 Cryptographic Nonces",
        "shot_key": "reasoning",
        "narration": "Look at the live Shopper Canvas. Users enforce non-bypassable spending ceilings and ESG sustainability filters. Under the hood, PayAgent's sub-50ms reasoning console arbitrates catalog specifications, verifies cryptographic budget constraints, and generates an Ed25519 nonce before funds can ever move.",
    },
    {
        "id": "scene3_bidding_matrix",
        "title": "Multi-Merchant Autonomous Bidding & Concession Matrix",
        "subtitle": "Real-time Supplier Arbitration: Automated 10% Rebate & Carbon Offsets",
        "shot_key": "reasoning",
        "narration": "Here in the Multi-Merchant Bidding Matrix, our buyer agent conducts automated reverse RFQs across competing suppliers. It rejects overpriced and high-carbon options, securing an automatic 10% partner rebate and attaching PayPal Green carbon offsets seamlessly.",
    },
    {
        "id": "scene4_dispute_simulator",
        "title": "PayPal Resolution Center Dispute Defense Simulator",
        "subtitle": "1-Click Synthetic Chargeback Defense: Court-Ready Evidence in 304ms",
        "shot_key": "roi_dispute",
        "narration": "What happens when a buyer claims 'my AI bought this without my permission'? PayAgent's 1-click Dispute Defense Simulator proves the breakthrough. In 304 milliseconds, it matches the Ed25519 consent signature to the PayPal Orders v2 capture ID, securing 100% merchant liability protection.",
    },
    {
        "id": "scene5_aggrid_telemetry",
        "title": "Enterprise Financial Telemetry with AG Grid Community v36",
        "subtitle": "Real-Time Multi-Channel Transaction Vault & Settlement Ledger",
        "shot_key": "audit",
        "narration": "For enterprise merchants, every autonomous transaction streams live into AG Grid Community v36. Built with high-performance virtualized rendering, finance teams can sort, filter, export real-time ledger audits to CSV, and inspect live settlement velocity across PayPal and Venmo.",
    },
    {
        "id": "scene6_paypal_v2_finish",
        "title": "Production-Grade PayPal Orders v2 REST Integration",
        "subtitle": "Live Sandbox Authorization, Capture & Cryptographic Non-Repudiation",
        "shot_key": "api",
        "narration": "PayAgent is not a mock wrapper. It is fully integrated with PayPal's Orders v2 REST API in sandbox, featuring instant order authorization, vaultless capture, and verifiable cryptographic non-repudiation. This is the future of autonomous commerce. Thank you, PayPal and AG Grid.",
    },
]

def generate_voice(idx, text):
    out_audio = os.path.join(OUTPUT_DIR, f"voice_{idx:02d}.mp3")
    if not (os.path.exists(out_audio) and os.path.getsize(out_audio) > 1000):
        cmd = [
            EDGE_TTS_BIN,
            "--voice", "en-US-AndrewMultilingualNeural",
            "--rate=+6%",
            "--text", text,
            "--write-media", out_audio,
        ]
        subprocess.run(cmd, check=True)
    probe_cmd = f"ffprobe -v error -show_entries format=duration -of json {out_audio}"
    result = subprocess.run(probe_cmd, shell=True, capture_output=True, text=True)
    duration = float(json.loads(result.stdout)["format"]["duration"])
    return out_audio, duration

def build_browser_with_shadow(screenshot_img, target_w=1360, target_h=750, url="https://payagent.ai/canvas"):
    """Pre-renders browser window with a luxurious 3D soft drop-shadow in a single RGBA buffer"""
    pad = 30
    total_w = target_w + pad * 2
    total_h = target_h + pad * 2
    
    # 1. Base buffer
    base = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    
    # 2. Draw soft drop shadow
    shadow_mask = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_mask)
    sdraw.rounded_rectangle([pad + 5, pad + 15, pad + target_w + 5, pad + target_h + 15],
                            radius=18, fill=(15, 23, 42, 90))
    shadow_blur = shadow_mask.filter(ImageFilter.GaussianBlur(16))
    base.paste(shadow_blur, (0, 0), shadow_blur)
    
    # 3. Browser Window
    window = Image.new("RGBA", (target_w, target_h), (255, 255, 255, 255))
    wdraw = ImageDraw.Draw(window)
    
    # Browser chrome header
    wdraw.rectangle([0, 0, target_w, 48], fill=(241, 245, 249, 255))
    wdraw.line([0, 48, target_w, 48], fill=(226, 232, 240, 255), width=1)
    
    # Traffic dots
    wdraw.ellipse([16, 18, 28, 30], fill=(239, 68, 68, 255))
    wdraw.ellipse([34, 18, 46, 30], fill=(245, 158, 11, 255))
    wdraw.ellipse([52, 18, 64, 30], fill=(16, 185, 129, 255))
    
    # URL Bar
    wdraw.rounded_rectangle([80, 10, target_w - 200, 38], radius=8, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    wdraw.text((96, 16), f"🔒 {url}", fill=(71, 85, 105, 255), font=FONT_TINY)
    
    # PayPal verified badge
    wdraw.rounded_rectangle([target_w - 185, 10, target_w - 20, 38], radius=8, fill=(0, 112, 186, 25), outline=(0, 112, 186, 80), width=1)
    wdraw.text((target_w - 175, 17), "PayPal Verified ✓", fill=(0, 112, 186, 255), font=FONT_TINY)
    
    # Screenshot body
    if screenshot_img:
        content_h = target_h - 48
        scale = target_w / float(screenshot_img.width)
        scaled_h = int(screenshot_img.height * scale)
        scaled_img = screenshot_img.resize((target_w, scaled_h), Image.Resampling.LANCZOS)
        crop_box = (0, 0, target_w, min(scaled_h, content_h))
        window.paste(scaled_img.crop(crop_box), (0, 48))
    
    wdraw.rounded_rectangle([0, 0, target_w - 1, target_h - 1], radius=14, outline=(203, 213, 225, 220), width=2)
    
    base.paste(window, (pad, pad), window)
    
    # Convert to BGRA NumPy array for OpenCV warpPerspective
    bgra = cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)
    return bgra, pad

def draw_3d_avatar_pil(draw, ax, ay, size=70, progress=0.0):
    bob = int(math.sin(progress * 8.0) * 8)
    cx, cy = ax + size // 2, ay + size // 2 + bob
    
    # Outer pulse ring
    pulse_rad = int(size * 0.7 + math.sin(progress * 12.0) * 6)
    draw.ellipse([cx - pulse_rad, cy - pulse_rad, cx + pulse_rad, cy + pulse_rad],
                 outline=(0, 112, 186, int(60 + math.sin(progress * 8.0) * 40)), width=2)
    
    # Antenna & glowing beacon
    draw.line([cx, cy - size // 2 + 10, cx, cy - size // 2 - 12], fill=(148, 163, 184, 255), width=3)
    orb_rad = int(5 + math.sin(progress * 14.0) * 2)
    draw.ellipse([cx - orb_rad, cy - size // 2 - 14 - orb_rad, cx + orb_rad, cy - size // 2 - 14 + orb_rad],
                 fill=(6, 182, 212, 255))
    
    # Head Capsule
    head_w, head_h = int(size * 0.85), int(size * 0.7)
    draw.rounded_rectangle([cx - head_w//2, cy - head_h//2, cx + head_w//2, cy + head_h//2],
                           radius=18, fill=(255, 255, 255, 255), outline=(0, 112, 186, 255), width=3)
    
    # Cyber Visor
    visor_w, visor_h = int(head_w * 0.78), int(head_h * 0.52)
    draw.rounded_rectangle([cx - visor_w//2, cy - visor_h//2, cx + visor_w//2, cy + visor_h//2],
                           radius=10, fill=(15, 23, 42, 255))
    
    # Blinking LED Eyes
    blink_cycle = (progress * 1.2) % 3.5
    is_blinking = blink_cycle > 3.3
    eye_h = 2 if is_blinking else 7
    eye_w = 9
    
    draw.rounded_rectangle([cx - 16 - eye_w//2, cy - eye_h//2, cx - 16 + eye_w//2, cy + eye_h//2],
                           radius=3, fill=(6, 182, 212, 255))
    draw.rounded_rectangle([cx + 16 - eye_w//2, cy - eye_h//2, cx + 16 + eye_w//2, cy + eye_h//2],
                           radius=3, fill=(6, 182, 212, 255))
    
    draw.ellipse([cx - 24, cy + 8, cx - 18, cy + 13], fill=(244, 114, 182, 150))
    draw.ellipse([cx + 18, cy + 8, cx + 24, cy + 13], fill=(244, 114, 182, 150))

def draw_3d_badge(draw, x, y, text, icon="✓", bg_color=(0, 112, 186, 255), text_color=(255, 255, 255, 255)):
    padding_x = 16
    padding_y = 8
    badge_text = f"{icon}  {text}"
    bbox = draw.textbbox((x, y), badge_text, font=FONT_BADGE)
    w = bbox[2] - bbox[0] + padding_x * 2
    h = bbox[3] - bbox[1] + padding_y * 2
    
    draw.rounded_rectangle([x + 2, y + 4, x + w + 2, y + h + 4], radius=12, fill=(0, 0, 0, 25))
    draw.rounded_rectangle([x, y, x + w, y + h], radius=12, fill=bg_color)
    draw.text((x + padding_x, y + padding_y), badge_text, fill=text_color, font=FONT_BADGE)

def build_video():
    print("=== Loading Voiceover Narration ===")
    scene_audios = []
    total_duration = 0.0
    
    for i, scene in enumerate(SCENES):
        audio_file, dur = generate_voice(i + 1, scene["narration"])
        dur = max(dur + 0.8, 12.0)
        scene_audios.append((audio_file, dur))
        total_duration += dur
        print(f"Scene {i+1} [{scene['id']}]: {dur:.2f}s - {audio_file}")
    
    print(f"Total Video Runtime: {total_duration:.2f} seconds")
    
    print("Pre-rendering browser windows with drop shadows...")
    browser_cache = {}
    for key, shot in SHOTS.items():
        url_map = {
            "hero": "https://payagent.ai/shopper-canvas",
            "reasoning": "https://payagent.ai/reasoning-matrix",
            "audit": "https://payagent.ai/merchant-audit",
            "roi_dispute": "https://payagent.ai/dispute-simulator",
            "api": "https://payagent.ai/api-playground",
        }
        bgra, pad = build_browser_with_shadow(shot, target_w=1360, target_h=750, url=url_map.get(key, "https://payagent.ai"))
        browser_cache[key] = (bgra, pad)
    
    temp_video = os.path.join(OUTPUT_DIR, "video_stream.mp4")
    master_video = "/home/Brathap/payagent/payagent_demo.mp4"
    public_video = "/home/Brathap/payagent/public/payagent_demo.mp4"
    
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        temp_video,
    ]
    
    proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
    
    print("=== Commencing High-Speed 3D Kinetic Rendering ===")
    global_time = 0.0
    frame_count = 0
    total_frames = int(total_duration * FPS)
    
    last_warped_pil = None
    last_warp_frame = -999
    
    for scene_idx, scene in enumerate(SCENES):
        _, scene_dur = scene_audios[scene_idx]
        scene_frames = int(scene_dur * FPS)
        shot_key = scene["shot_key"]
        browser_bgra, pad = browser_cache[shot_key]
        bh, bw = browser_bgra.shape[:2]
        src_pts = np.float32([[0, 0], [bw, 0], [bw, bh], [0, bh]])
        
        for f in range(scene_frames):
            frame_progress = f / float(scene_frames)
            t = global_time + f / float(FPS)
            
            # Update 3D perspective warp every 2 frames for 2x performance boost
            if f - last_warp_frame >= 2 or last_warped_pil is None:
                yaw = math.sin(t * 1.5) * 0.032
                pitch = math.cos(t * 1.2) * 0.018
                zoom = 1.0 + math.sin(t * 0.8) * 0.035
                
                target_cx = 950
                target_cy = 585
                hw = (bw * 0.88 * zoom) / 2.0
                hh = (bh * 0.88 * zoom) / 2.0
                
                dst_pts = np.float32([
                    [target_cx - hw * (1.0 - yaw), target_cy - hh * (1.0 + pitch)],
                    [target_cx + hw * (1.0 + yaw), target_cy - hh * (1.0 - pitch)],
                    [target_cx + hw * (1.0 + yaw * 1.15), target_cy + hh * (1.0 + pitch)],
                    [target_cx - hw * (1.0 - yaw * 1.15), target_cy + hh * (1.0 - pitch)],
                ])
                M = cv2.getPerspectiveTransform(src_pts, dst_pts)
                warped = cv2.warpPerspective(browser_bgra, M, (WIDTH, HEIGHT), flags=cv2.INTER_LINEAR)
                warped_rgba = cv2.cvtColor(warped, cv2.COLOR_BGRA2RGBA)
                last_warped_pil = Image.fromarray(warped_rgba)
                last_warp_frame = f
            
            # Base Canvas
            frame_pil = Image.new("RGBA", (WIDTH, HEIGHT), (248, 250, 252, 255))
            draw = ImageDraw.Draw(frame_pil)
            
            # Grid dots
            grid_spacing = 60
            grid_shift = int((t * 10) % grid_spacing)
            for gx in range(0, WIDTH + grid_spacing, grid_spacing):
                for gy in range(0, HEIGHT + grid_spacing, grid_spacing):
                    dot_x = gx - grid_shift
                    dot_y = gy - grid_shift
                    draw.ellipse([dot_x, dot_y, dot_x + 2, dot_y + 2], fill=(226, 232, 240, 200))
            
            # Paste 3D perspective warped browser window with soft drop shadow
            frame_pil.paste(last_warped_pil, (0, 0), last_warped_pil)
            
            # Top Navigation Header Bar
            draw.rectangle([0, 0, WIDTH, 80], fill=(255, 255, 255, 245))
            draw.line([0, 80, WIDTH, 80], fill=(226, 232, 240, 255), width=1)
            
            # PayAgent Badge
            draw.rounded_rectangle([50, 18, 220, 62], radius=12, fill=(0, 112, 186, 255))
            draw.text((68, 26), "PayAgent", fill=(255, 255, 255, 255), font=FONT_HEADING)
            
            draw.rounded_rectangle([235, 24, 470, 56], radius=8, fill=(0, 112, 186, 20), outline=(0, 112, 186, 80), width=1)
            draw.text((248, 30), "PAYPAL AI HACKATHON 2026", fill=(0, 112, 186, 255), font=FONT_BADGE)
            
            draw.text((WIDTH - 520, 30), "APCP Nonce Engine: ED25519 VERIFIED", fill=(16, 185, 129, 255), font=FONT_BADGE)
            draw.ellipse([WIDTH - 60, 34, WIDTH - 46, 48], fill=(16, 185, 129, 255))
            
            # Scene Title & Subtitle
            draw.text((50, 105), scene["title"], fill=(15, 23, 42, 255), font=FONT_TITLE)
            draw.text((50, 165), scene["subtitle"], fill=(71, 85, 105, 255), font=FONT_SUB)
            
            # 3D Floating Contextual Badges with Parallax
            float_offset = math.sin(t * 3.0) * 8
            if scene_idx == 0:
                draw_3d_badge(draw, 1400, int(240 + float_offset), "Autonomous Spending Enclave", "🛡️", (16, 185, 129, 255))
                draw_3d_badge(draw, 1400, int(310 + float_offset * 1.2), "Zero Synthetic Chargebacks", "⚡", (0, 112, 186, 255))
                draw_3d_badge(draw, 1400, int(380 + float_offset * 0.8), "PayPal Orders v2 Direct", "💳", (99, 102, 241, 255))
            elif scene_idx == 1:
                draw_3d_badge(draw, 1420, int(250 + float_offset), "Sub-50ms Decision Tree", "⏱️", (6, 182, 212, 255))
                draw_3d_badge(draw, 1420, int(320 + float_offset * 1.2), "Ed25519 Nonce Bound", "🔑", (139, 92, 246, 255))
                draw_3d_badge(draw, 1420, int(390 + float_offset * 0.9), "Hard Mandate Ceiling Clamped", "🔒", (16, 185, 129, 255))
            elif scene_idx == 2:
                draw_3d_badge(draw, 1420, int(250 + float_offset), "EcoSupply Co: Arbitrated Winner", "🏆", (16, 185, 129, 255))
                draw_3d_badge(draw, 1420, int(320 + float_offset * 1.2), "Automated 10% Partner Rebate", "🏷️", (0, 112, 186, 255))
                draw_3d_badge(draw, 1420, int(390 + float_offset * 0.8), "ESG Score: 98/100 (Green Offset)", "🌱", (5, 150, 105, 255))
            elif scene_idx == 3:
                draw_3d_badge(draw, 1400, int(250 + float_offset), "Dispute Response: 304ms", "⚡", (225, 29, 72, 255))
                draw_3d_badge(draw, 1400, int(320 + float_offset * 1.2), "100% Merchant Defense Cleared", "🛡️", (16, 185, 129, 255))
                draw_3d_badge(draw, 1400, int(390 + float_offset * 0.8), "Projected Annual ROI: 14.2x", "📈", (0, 112, 186, 255))
            elif scene_idx == 4:
                draw_3d_badge(draw, 1420, int(250 + float_offset), "AG Grid Community v36 Engine", "📊", (14, 165, 233, 255))
                draw_3d_badge(draw, 1420, int(320 + float_offset * 1.2), "$148,920 Live Volume Tracked", "💰", (16, 185, 129, 255))
                draw_3d_badge(draw, 1420, int(390 + float_offset * 0.8), "Instant CSV & Audit Export", "📁", (79, 70, 229, 255))
            elif scene_idx == 5:
                draw_3d_badge(draw, 1420, int(250 + float_offset), "PayPal Orders v2 Sandbox Live", "🚀", (0, 112, 186, 255))
                draw_3d_badge(draw, 1420, int(320 + float_offset * 1.2), "Non-Repudiation Nonce Sealed", "🔐", (16, 185, 129, 255))
                draw_3d_badge(draw, 1420, int(390 + float_offset * 0.8), "MIT Open Source Verified", "⭐", (217, 119, 6, 255))
            
            # Bottom Banner & 3D Sentinel AI Mascot
            draw.rectangle([0, HEIGHT - 100, WIDTH, HEIGHT], fill=(255, 255, 255, 245))
            draw.line([0, HEIGHT - 100, WIDTH, HEIGHT - 100], fill=(226, 232, 240, 255), width=1)
            
            draw_3d_avatar_pil(draw, 45, HEIGHT - 90, size=70, progress=t)
            
            draw.text((140, HEIGHT - 82), "SENTINEL AI COMPANION", fill=(0, 112, 186, 255), font=FONT_CODE)
            
            narration_full = scene["narration"]
            char_count = min(len(narration_full), int(frame_progress * len(narration_full) * 1.15))
            displayed_text = narration_full[:char_count]
            if len(displayed_text) > 110:
                line1 = displayed_text[:110]
                line2 = displayed_text[110:220]
                draw.text((140, HEIGHT - 58), line1, fill=(51, 65, 85, 255), font=FONT_TINY)
                draw.text((140, HEIGHT - 40), line2, fill=(51, 65, 85, 255), font=FONT_TINY)
            else:
                draw.text((140, HEIGHT - 52), displayed_text, fill=(51, 65, 85, 255), font=FONT_SUB)
            
            # Soundwave bars
            wave_x = WIDTH - 220
            wave_y = HEIGHT - 50
            for wi in range(12):
                bar_h = max(4, int(14 + math.sin(t * 16.0 + wi * 0.8) * 10))
                draw.rounded_rectangle([wave_x + wi * 14, wave_y - bar_h // 2, wave_x + wi * 14 + 8, wave_y + bar_h // 2],
                                       radius=3, fill=(0, 112, 186, 200))
            
            # Convert to RGB bytes directly
            rgb_bytes = frame_pil.convert("RGB").tobytes()
            proc.stdin.write(rgb_bytes)
            frame_count += 1
            
            if frame_count % 120 == 0:
                pct = (frame_count / float(total_frames)) * 100
                print(f"Render progress: {frame_count}/{total_frames} frames ({pct:.1f}%)")
        
        global_time += scene_dur

    proc.stdin.close()
    proc.wait()
    print("Video frame encoding completed successfully!")
    
    # Audio Concatenation
    concat_txt = os.path.join(OUTPUT_DIR, "audio_concat.txt")
    with open(concat_txt, "w") as f:
        for audio_file, _ in scene_audios:
            f.write(f"file '{audio_file}'\n")
    
    combined_voice = os.path.join(OUTPUT_DIR, "voice_combined.mp3")
    subprocess.run(f"ffmpeg -y -f concat -safe 0 -i {concat_txt} -c copy {combined_voice}", shell=True, check=True)
    
    # Background Ambient track
    ambient_wav = os.path.join(OUTPUT_DIR, "ambient.wav")
    synth_cmd = (
        f"ffmpeg -y -f lavfi -i \"anoisesrc=c=pink:r=44100:a=0.005\" "
        f"-f lavfi -i \"sine=frequency=110:duration={total_duration}\" "
        f"-f lavfi -i \"sine=frequency=164.81:duration={total_duration}\" "
        f"-f lavfi -i \"sine=frequency=220:duration={total_duration}\" "
        f"-filter_complex \"[1:a]volume=0.02[s1];[2:a]volume=0.015[s2];[3:a]volume=0.01[s3];[0:a][s1][s2][s3]amix=inputs=4:duration=first,lowpass=f=900,volume=0.25\" "
        f"-t {total_duration} {ambient_wav}"
    )
    subprocess.run(synth_cmd, shell=True, check=True)
    
    # Final Muxing
    print("=== Muxing final master 1080p 3D demo video ===")
    mux_cmd = (
        f"ffmpeg -y -i {temp_video} -i {combined_voice} -i {ambient_wav} "
        f"-filter_complex \"[1:a]volume=1.0[v];[2:a]volume=0.25[m];[v][m]amix=inputs=2:duration=first[a]\" "
        f"-map 0:v -map \"[a]\" -c:v copy -c:a aac -b:a 192k {master_video}"
    )
    subprocess.run(mux_cmd, shell=True, check=True)
    
    subprocess.run(f"cp {master_video} {public_video}", shell=True, check=True)
    size_mb = os.path.getsize(master_video) / (1024 * 1024)
    print(f"Master 3D Kinetic Video successfully rendered: {master_video} ({size_mb:.2f} MB)")
    print(f"Public browser stream ready at: http://localhost:3001/payagent_demo.mp4")

if __name__ == "__main__":
    build_video()
