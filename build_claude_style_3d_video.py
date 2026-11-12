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
OUTPUT_DIR = "/tmp/payagent_3d_claude_video"
os.makedirs(OUTPUT_DIR, exist_ok=True)
EDGE_TTS_BIN = "/tmp/tts_venv/bin/edge-tts"

def load_img(path):
    if os.path.exists(path):
        return Image.open(path).convert("RGBA")
    return None

# Load the 7 distinct high-resolution screen assets
SHOTS = {
    "protocol": load_img("/home/Brathap/payagent/public/screens/screen_protocol_modal.png"),
    "shopper": load_img("/home/Brathap/payagent/public/screens/screen_canvas_hero.png"),
    "reasoning": load_img("/home/Brathap/payagent/public/screens/crop_reasoning.png"),
    "bidding": load_img("/home/Brathap/payagent/public/screens/crop_bidding.png"),
    "aggrid": load_img("/home/Brathap/payagent/public/screens/screen_merchant_audit.png"),
    "dispute": load_img("/home/Brathap/payagent/public/screens/crop_dispute.png"),
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

FONT_TITLE = get_font(42, bold=True)
FONT_HEADING = get_font(28, bold=True)
FONT_SUB = get_font(18, bold=False)
FONT_BADGE = get_font(15, bold=True)
FONT_TINY = get_font(12, bold=False)
FONT_CODE = get_font(14, bold=True)
FONT_CALLOUT = get_font(16, bold=True)

# 7 Distinct Scenes across 7 Distinct Pages
SCENES = [
    {
        "id": "scene1_protocol",
        "step_num": "01",
        "step_tag": "SWARM ARCHITECTURE PROTOCOL",
        "title": "The Agentic Payment Consent Protocol (APCP)",
        "subtitle": "Decoupling AI Reasoning from Direct Financial Authority with Enclave Proofs",
        "shot_key": "protocol",
        "url": "https://payagent.ai/apcp-protocol",
        "voice": "voice_01.mp3",
        "narration": "Meet PayAgent, built for the PayPal AI Hackathon 2026. As autonomous AI agents begin spending money, commerce faces an existential crisis: runaway hallucinations and fraudulent chargebacks. Our solution is APCP, the Agentic Payment Consent Protocol.",
        "callouts": [
            {"text": "1. Mandate Enclave: Zero-Overage Guarantee", "x": 1380, "y": 240, "color": (16, 185, 129, 255)},
            {"text": "2. Ed25519 Nonce Non-Repudiation", "x": 1380, "y": 305, "color": (0, 112, 186, 255)},
            {"text": "3. PayPal Orders v2 Sandbox Validated", "x": 1380, "y": 370, "color": (99, 102, 241, 255)},
        ],
        "highlight_box": (300, 260, 1100, 720),
    },
    {
        "id": "scene2_shopper",
        "step_num": "02",
        "step_tag": "AUTONOMOUS SHOPPER CANVAS",
        "title": "Natural Voice AI & Non-Bypassable Spending Ceilings",
        "subtitle": "Multi-Modal Intent Parsing with Guaranteed Mathematical Budget Enforcement",
        "shot_key": "shopper",
        "url": "https://payagent.ai/shopper-canvas",
        "voice": "voice_02.mp3",
        "narration": "On the Shopper Canvas, users command their personal purchasing agent using natural voice or prompt. Crucially, the user enforces a non-bypassable spending ceiling. If an agent attempts to spend even one dollar above the mandate, the transaction is mathematically blocked.",
        "callouts": [
            {"text": "Siri Fluid Audio Waveform Visualizer", "x": 1380, "y": 240, "color": (6, 182, 212, 255)},
            {"text": "Hard Budget Clamp: Locked at $100.00", "x": 1380, "y": 305, "color": (16, 185, 129, 255)},
            {"text": "In-Chat PayPal Smart Payment Buttons", "x": 1380, "y": 370, "color": (0, 112, 186, 255)},
        ],
        "highlight_box": (200, 200, 800, 500),
    },
    {
        "id": "scene3_reasoning",
        "step_num": "03",
        "step_tag": "DETERMINISTIC REASONING TERMINAL",
        "title": "Sub-50ms Deterministic Swarm Reasoning Console",
        "subtitle": "Live Step-by-Step Thought Trace & Cryptographic Nonce Generation",
        "shot_key": "reasoning",
        "url": "https://payagent.ai/reasoning-terminal",
        "voice": "voice_03.mp3",
        "narration": "Under the hood, PayAgent executes a sub-50ms deterministic reasoning tree. Watch the live swarm trace as it verifies catalog specifications, tests budget constraints, and generates an Ed25519 cryptographic consent nonce before funds can ever move.",
        "callouts": [
            {"text": "Sub-50ms Latency: 38ms Execution", "x": 1380, "y": 240, "color": (16, 185, 129, 255)},
            {"text": "Ed25519 Nonce Non-Repudiation Seal", "x": 1380, "y": 305, "color": (139, 92, 246, 255)},
            {"text": "Model: APCP-Reasoner-v2 Deterministic", "x": 1380, "y": 370, "color": (0, 112, 186, 255)},
        ],
        "highlight_box": (150, 150, 1200, 600),
    },
    {
        "id": "scene4_bidding",
        "step_num": "04",
        "step_tag": "MULTI-MERCHANT ARBITRATION",
        "title": "Multi-Merchant Autonomous Bidding & Concession Matrix",
        "subtitle": "Automated Reverse-RFQs: Securing 10% Partner Rebates and Green Carbon Offsets",
        "shot_key": "bidding",
        "url": "https://payagent.ai/bidding-matrix",
        "voice": "voice_04.mp3",
        "narration": "Next, in the Multi-Merchant Bidding Matrix, our buyer agent conducts automated reverse RFQs across competing suppliers. It rejects over-priced and high-carbon options, securing an automatic 10% partner rebate and attaching PayPal Green carbon offsets.",
        "callouts": [
            {"text": "EcoSupply Co: Arbitrated Winner (-10%)", "x": 1380, "y": 240, "color": (16, 185, 129, 255)},
            {"text": "Over-Priced & High-Carbon Rejected", "x": 1380, "y": 305, "color": (239, 68, 68, 255)},
            {"text": "ESG Rating: 98/100 (Offset Attached)", "x": 1380, "y": 370, "color": (5, 150, 105, 255)},
        ],
        "highlight_box": (150, 150, 550, 650),
    },
    {
        "id": "scene5_aggrid",
        "step_num": "05",
        "step_tag": "ENTERPRISE AG GRID TELEMETRY",
        "title": "Enterprise Telemetry with AG Grid Community v36",
        "subtitle": "Virtualized Row Streaming, Multi-Column Sorting, Filtering & 1-Click CSV Export",
        "shot_key": "aggrid",
        "url": "https://payagent.ai/merchant-audit",
        "voice": "voice_05.mp3",
        "narration": "For enterprise merchants, transactions stream live into an AG Grid Community v36 virtualized ledger. Finance teams can sort, filter, export audit records to CSV, and inspect real-time settlement velocity across PayPal and Venmo.",
        "callouts": [
            {"text": "AG Grid Community v36 Engine", "x": 1380, "y": 240, "color": (14, 165, 233, 255)},
            {"text": "$148,920 Volume Across 1,842 Orders", "x": 1380, "y": 305, "color": (16, 185, 129, 255)},
            {"text": "AI Risk Scoring: Anomaly Detection", "x": 1380, "y": 370, "color": (217, 119, 6, 255)},
        ],
        "highlight_box": (100, 240, 1250, 700),
    },
    {
        "id": "scene6_dispute",
        "step_num": "06",
        "step_tag": "DISPUTE DEFENSE SIMULATOR",
        "title": "1-Click PayPal Resolution Center Dispute Defense Shield",
        "subtitle": "Stopping Synthetic Chargebacks with Instant 304ms Cryptographic Court Dossiers",
        "shot_key": "dispute",
        "url": "https://payagent.ai/dispute-simulator",
        "voice": "voice_06.mp3",
        "narration": "What happens when a buyer claims their AI bought something by mistake? PayAgent's Dispute Defense Simulator demonstrates the breakthrough. In 304 milliseconds, it matches the signed Ed25519 nonce to the PayPal capture ID, securing 100% merchant liability protection.",
        "callouts": [
            {"text": "Dispute Cleared in 304ms", "x": 1380, "y": 240, "color": (225, 29, 72, 255)},
            {"text": "100% Merchant Defense Cleared", "x": 1380, "y": 305, "color": (16, 185, 129, 255)},
            {"text": "Enterprise ROI: 14.2x Annualized Return", "x": 1380, "y": 370, "color": (0, 112, 186, 255)},
        ],
        "highlight_box": (150, 150, 1200, 600),
    },
    {
        "id": "scene7_api",
        "step_num": "07",
        "step_tag": "PRODUCTION PAYPAL ORDERS V2 REST API",
        "title": "Production-Grade PayPal Orders v2 Sandbox Integration",
        "subtitle": "Live Authorization, Capture & Cryptographic Non-Repudiation for Autonomous Commerce",
        "shot_key": "api",
        "url": "https://payagent.ai/api-playground",
        "voice": "voice_07.mp3",
        "narration": "PayAgent is not a mock wrapper. It is directly integrated with PayPal's Orders v2 REST API in sandbox, featuring instant authorization, capture, and cryptographic non-repudiation. This is the future of autonomous commerce. Thank you, PayPal and AG Grid.",
        "callouts": [
            {"text": "POST /v2/checkout/orders (201 Created)", "x": 1380, "y": 240, "color": (0, 112, 186, 255)},
            {"text": "POST /orders/{id}/capture (Approved)", "x": 1380, "y": 305, "color": (16, 185, 129, 255)},
            {"text": "Open-Source on GitHub: MIT Licensed", "x": 1380, "y": 370, "color": (217, 119, 6, 255)},
        ],
        "highlight_box": (150, 200, 1200, 720),
    },
]

def build_browser_frame(screenshot_img, target_w=1280, target_h=700, url="https://payagent.ai"):
    """Pre-renders browser window with soft drop-shadow"""
    pad = 24
    total_w = target_w + pad * 2
    total_h = target_h + pad * 2
    
    base = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    
    # Shadow
    shadow_mask = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_mask)
    sdraw.rounded_rectangle([pad + 4, pad + 12, pad + target_w + 4, pad + target_h + 12],
                            radius=16, fill=(15, 23, 42, 85))
    shadow_blur = shadow_mask.filter(ImageFilter.GaussianBlur(14))
    base.paste(shadow_blur, (0, 0), shadow_blur)
    
    # Window
    window = Image.new("RGBA", (target_w, target_h), (255, 255, 255, 255))
    wdraw = ImageDraw.Draw(window)
    
    # Chrome bar
    wdraw.rectangle([0, 0, target_w, 46], fill=(241, 245, 249, 255))
    wdraw.line([0, 46, target_w, 46], fill=(226, 232, 240, 255), width=1)
    
    wdraw.ellipse([16, 17, 28, 29], fill=(239, 68, 68, 255))
    wdraw.ellipse([34, 17, 46, 29], fill=(245, 158, 11, 255))
    wdraw.ellipse([52, 17, 64, 29], fill=(16, 185, 129, 255))
    
    wdraw.rounded_rectangle([80, 8, target_w - 200, 36], radius=7, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    wdraw.text((96, 14), f"🔒 {url}", fill=(71, 85, 105, 255), font=FONT_TINY)
    
    wdraw.rounded_rectangle([target_w - 180, 8, target_w - 20, 36], radius=7, fill=(0, 112, 186, 25), outline=(0, 112, 186, 80), width=1)
    wdraw.text((target_w - 170, 14), "PayPal Verified ✓", fill=(0, 112, 186, 255), font=FONT_TINY)
    
    if screenshot_img:
        content_h = target_h - 46
        scale = target_w / float(screenshot_img.width)
        scaled_h = int(screenshot_img.height * scale)
        scaled_img = screenshot_img.resize((target_w, scaled_h), Image.Resampling.LANCZOS)
        crop_box = (0, 0, target_w, min(scaled_h, content_h))
        window.paste(scaled_img.crop(crop_box), (0, 46))
    
    wdraw.rounded_rectangle([0, 0, target_w - 1, target_h - 1], radius=14, outline=(203, 213, 225, 220), width=2)
    base.paste(window, (pad, pad), window)
    
    bgra = cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)
    return bgra

def pre_render_callout_card(text, color=(0, 112, 186, 255)):
    dummy = Image.new("RGBA", (10, 10))
    ddraw = ImageDraw.Draw(dummy)
    bbox = ddraw.textbbox((0, 0), text, font=FONT_CALLOUT)
    pad_x, pad_y = 14, 8
    w = (bbox[2] - bbox[0]) + pad_x * 2 + 10
    h = (bbox[3] - bbox[1]) + pad_y * 2
    
    card = Image.new("RGBA", (w + 6, h + 6), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(card)
    cdraw.rounded_rectangle([3, 4, w + 3, h + 4], radius=10, fill=(0, 0, 0, 25))
    cdraw.rounded_rectangle([0, 0, w, h], radius=10, fill=(255, 255, 255, 250), outline=color, width=2)
    cdraw.rounded_rectangle([6, 7, 10, h - 7], radius=2, fill=color)
    cdraw.text((18, pad_y), text, fill=(15, 23, 42, 255), font=FONT_CALLOUT)
    return card

def draw_3d_avatar_pil(draw, ax, ay, size=68, progress=0.0):
    bob = int(math.sin(progress * 8.0) * 8)
    cx, cy = ax + size // 2, ay + size // 2 + bob
    
    pulse_rad = int(size * 0.7 + math.sin(progress * 12.0) * 6)
    draw.ellipse([cx - pulse_rad, cy - pulse_rad, cx + pulse_rad, cy + pulse_rad],
                 outline=(0, 112, 186, int(60 + math.sin(progress * 8.0) * 40)), width=2)
    
    draw.line([cx, cy - size // 2 + 10, cx, cy - size // 2 - 12], fill=(148, 163, 184, 255), width=3)
    orb_rad = int(5 + math.sin(progress * 14.0) * 2)
    draw.ellipse([cx - orb_rad, cy - size // 2 - 14 - orb_rad, cx + orb_rad, cy - size // 2 - 14 + orb_rad],
                 fill=(6, 182, 212, 255))
    
    head_w, head_h = int(size * 0.85), int(size * 0.7)
    draw.rounded_rectangle([cx - head_w//2, cy - head_h//2, cx + head_w//2, cy + head_h//2],
                           radius=18, fill=(255, 255, 255, 255), outline=(0, 112, 186, 255), width=3)
    
    visor_w, visor_h = int(head_w * 0.78), int(head_h * 0.52)
    draw.rounded_rectangle([cx - visor_w//2, cy - visor_h//2, cx + visor_w//2, cy + visor_h//2],
                           radius=10, fill=(15, 23, 42, 255))
    
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

def render_claude_video():
    print("=== Loading 7 Distinct Voice Narration Scenes ===")
    scene_audios = []
    total_duration = 0.0
    
    for i, scene in enumerate(SCENES):
        audio_file = os.path.join(OUTPUT_DIR, scene["voice"])
        probe = subprocess.run(f"ffprobe -v error -show_entries format=duration -of json {audio_file}", shell=True, capture_output=True, text=True)
        dur = float(json.loads(probe.stdout)["format"]["duration"])
        dur = max(dur + 0.6, 12.0)
        scene_audios.append((audio_file, dur))
        total_duration += dur
        print(f"Scene {i+1} [{scene['id']}]: {dur:.2f}s - {audio_file}")
    
    print(f"Total Master Video Runtime: {total_duration:.2f} seconds")
    
    print("Pre-rendering browser frames and callout cards...")
    browser_cache = {}
    callout_cache = {}
    for scene in SCENES:
        key = scene["shot_key"]
        shot_img = SHOTS[key]
        browser_cache[key] = build_browser_frame(shot_img, target_w=1280, target_h=700, url=scene["url"])
        
        cards = []
        for c in scene["callouts"]:
            card_img = pre_render_callout_card(c["text"], c["color"])
            cards.append((card_img, c["x"], c["y"], c["color"]))
        callout_cache[scene["id"]] = cards
    
    temp_video = os.path.join(OUTPUT_DIR, "claude_stream.mp4")
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
    
    print("=== Commencing High-Speed Claude Code 3D Cinematography Rendering ===")
    global_time = 0.0
    frame_count = 0
    total_frames = int(total_duration * FPS)
    
    # 3D cyber grid floor
    horizon_y = 340
    vanish_x = 960
    base_grid_bgr = np.full((HEIGHT, WIDTH, 3), (252, 250, 248), dtype=np.uint8)
    for x in range(-400, WIDTH + 500, 70):
        cv2.line(base_grid_bgr, (vanish_x, horizon_y), (x, HEIGHT), (230, 238, 248), 1, cv2.LINE_AA)
    for i in range(1, 24):
        depth = (i / 24.0) ** 2.2
        y = int(horizon_y + depth * (HEIGHT - horizon_y))
        cv2.line(base_grid_bgr, (0, y), (WIDTH, y), (232, 240, 250), 1, cv2.LINE_AA)
    
    # Pre-converted PIL base grid
    base_grid_pil = Image.fromarray(cv2.cvtColor(base_grid_bgr, cv2.COLOR_BGR2RGB))
    
    last_warped_pil = None
    last_warp_frame = -999
    
    for scene_idx, scene in enumerate(SCENES):
        _, scene_dur = scene_audios[scene_idx]
        scene_frames = int(scene_dur * FPS)
        shot_key = scene["shot_key"]
        browser_bgra = browser_cache[shot_key]
        bh, bw = browser_bgra.shape[:2]
        src_pts = np.float32([[0, 0], [bw, 0], [bw, bh], [0, bh]])
        pre_cards = callout_cache[scene["id"]]
        
        for f in range(scene_frames):
            frame_progress = f / float(scene_frames)
            t = global_time + f / float(FPS)
            
            swoop_t = min(1.0, f / float(FPS * 1.1))
            swoop_ease = 1.0 - (1.0 - swoop_t) ** 3
            
            yaw = (math.sin(t * 1.6) * 0.035) * swoop_ease + (1.0 - swoop_ease) * (-0.08)
            pitch = (math.cos(t * 1.2) * 0.02) * swoop_ease + (1.0 - swoop_ease) * (0.05)
            zoom = (0.88 + 0.12 * swoop_ease) + math.sin(t * 0.7) * 0.025
            
            target_cx = 880
            target_cy = 580
            hw = (bw * 0.85 * zoom) / 2.0
            hh = (bh * 0.85 * zoom) / 2.0
            
            if f - last_warp_frame >= 2 or last_warped_pil is None:
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
            
            # Fast in-memory copy
            canvas_pil = base_grid_pil.copy()
            draw = ImageDraw.Draw(canvas_pil)
            
            # Paste 3D perspective browser window
            canvas_pil.paste(last_warped_pil, (0, 0), last_warped_pil)
            
            # Top Header Bar
            draw.rectangle([0, 0, WIDTH, 80], fill=(255, 255, 255, 245))
            draw.line([0, 80, WIDTH, 80], fill=(226, 232, 240, 255), width=1)
            
            # Logo & Badges
            draw.rounded_rectangle([45, 18, 215, 62], radius=12, fill=(0, 112, 186, 255))
            draw.text((62, 26), "PayAgent", fill=(255, 255, 255, 255), font=FONT_HEADING)
            
            step_text = f"PAGE {scene['step_num']} OF 07 • {scene['step_tag']}"
            draw.rounded_rectangle([230, 24, 620, 56], radius=8, fill=(0, 112, 186, 20), outline=(0, 112, 186, 80), width=1)
            draw.text((244, 30), step_text, fill=(0, 112, 186, 255), font=FONT_BADGE)
            
            draw.text((WIDTH - 540, 30), "ENCLAVE TELEMETRY: ED25519 VERIFIED", fill=(16, 185, 129, 255), font=FONT_BADGE)
            draw.ellipse([WIDTH - 60, 34, WIDTH - 46, 48], fill=(16, 185, 129, 255))
            
            # Scene Title & Subtitle with high contrast
            draw.text((45, 100), scene["title"], fill=(15, 23, 42, 255), font=FONT_TITLE)
            draw.text((45, 155), scene["subtitle"], fill=(71, 85, 105, 255), font=FONT_SUB)
            
            # Floating Callout Cards with Visual Connecting Lines
            float_y = math.sin(t * 3.0) * 6
            for ci, (card_img, cx, cy, col) in enumerate(pre_cards):
                card_y = int(cy + float_y + ci * 10)
                canvas_pil.paste(card_img, (cx, card_y), card_img)
                
                guide_start_x = target_cx + int(hw * 0.96)
                guide_start_y = card_y + 18
                draw.line([guide_start_x, guide_start_y, cx - 8, guide_start_y],
                          fill=(203, 213, 225, 200), width=1)
                draw.ellipse([guide_start_x - 3, guide_start_y - 3, guide_start_x + 3, guide_start_y + 3],
                             fill=col)
            
            # Pulsing Neon Focus Bounding Box on active feature
            pulse_alpha = int(140 + math.sin(t * 8.0) * 80)
            hb = scene["highlight_box"]
            box_x = int(target_cx - hw * 0.9 + hb[0] * (hw * 1.8 / 1280.0))
            box_y = int(target_cy - hh * 0.85 + hb[1] * (hh * 1.8 / 700.0))
            box_w = int((hb[2] - hb[0]) * (hw * 1.8 / 1280.0))
            box_h = int((hb[3] - hb[1]) * (hh * 1.8 / 700.0))
            
            draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h],
                                   radius=8, outline=(0, 112, 186, pulse_alpha), width=2)
            c_len = 12
            draw.line([box_x, box_y, box_x + c_len, box_y], fill=(0, 112, 186, 255), width=3)
            draw.line([box_x, box_y, box_x, box_y + c_len], fill=(0, 112, 186, 255), width=3)
            
            # Bottom Narration Bar & Sentinel AI Mascot
            draw.rectangle([0, HEIGHT - 95, WIDTH, HEIGHT], fill=(255, 255, 255, 245))
            draw.line([0, HEIGHT - 95, WIDTH, HEIGHT - 95], fill=(226, 232, 240, 255), width=1)
            
            draw_3d_avatar_pil(draw, 45, HEIGHT - 85, size=68, progress=t)
            
            draw.text((135, HEIGHT - 80), "SENTINEL AI COMPANION", fill=(0, 112, 186, 255), font=FONT_CODE)
            
            narration_full = scene["narration"]
            char_count = min(len(narration_full), int(frame_progress * len(narration_full) * 1.2))
            displayed_text = narration_full[:char_count]
            if len(displayed_text) > 115:
                line1 = displayed_text[:115]
                line2 = displayed_text[115:230]
                draw.text((135, HEIGHT - 56), line1, fill=(51, 65, 85, 255), font=FONT_TINY)
                draw.text((135, HEIGHT - 38), line2, fill=(51, 65, 85, 255), font=FONT_TINY)
            else:
                draw.text((135, HEIGHT - 52), displayed_text, fill=(51, 65, 85, 255), font=FONT_SUB)
            
            wave_x = WIDTH - 220
            wave_y = HEIGHT - 48
            for wi in range(12):
                bar_h = max(4, int(14 + math.sin(t * 16.0 + wi * 0.8) * 10))
                draw.rounded_rectangle([wave_x + wi * 14, wave_y - bar_h // 2, wave_x + wi * 14 + 8, wave_y + bar_h // 2],
                                       radius=3, fill=(0, 112, 186, 200))
            
            rgb_bytes = canvas_pil.convert("RGB").tobytes()
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
    
    # Mux final master video
    print("=== Muxing final master 1080p Claude Code-Style demo video ===")
    mux_cmd = (
        f"ffmpeg -y -i {temp_video} -i {combined_voice} -i {ambient_wav} "
        f"-filter_complex \"[1:a]volume=1.0[v];[2:a]volume=0.25[m];[v][m]amix=inputs=2:duration=first[a]\" "
        f"-map 0:v -map \"[a]\" -c:v copy -c:a aac -b:a 192k {master_video}"
    )
    subprocess.run(mux_cmd, shell=True, check=True)
    
    subprocess.run(f"cp {master_video} {public_video}", shell=True, check=True)
    size_mb = os.path.getsize(master_video) / (1024 * 1024)
    print(f"Master Claude Code-Style 3D Demo Video ready: {master_video} ({size_mb:.2f} MB)")
    print(f"Public browser stream ready at: http://localhost:3001/payagent_demo.mp4")

if __name__ == "__main__":
    render_claude_video()
