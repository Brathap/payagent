#!/usr/bin/env python3
"""
PayAgent Grand Keynote Cinema Video Generator
PayPal AI Hackathon 2026 - World-Class Demo Presentation
- 7 Complete Pages & Software Surfaces (Full 1920x1080, Zero Cropped Words)
- Executive Silicon Valley Keynote Layout (Zero Blank Voids, Meaningful Telemetry)
- Dynamic Top Hackathon Status Bar with Live Chapter Progress & Telemetry Badges
- Floating Glass Callout Cards on Right with Glow Accent
- Sentinel AI Robot Companion with Blinking Eyes & Fluid 16-Band Audio Waveform Equalizer
- High-Performance Fast Frame Rendering (60+ FPS via Optimized Compositing)
"""

import os
import sys
import math
import time
import json
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

WIDTH = 1920
HEIGHT = 1080
FPS = 24
OUTPUT_DIR = "/home/Brathap/payagent"
VOICE_DIR = "/tmp/payagent_3d_claude_video"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

FONT_TITLE_MD = get_font("/usr/share/fonts/TTF/Roboto-Bold.ttf", 20)
FONT_HEADING = get_font("/usr/share/fonts/TTF/Roboto-Bold.ttf", 16)
FONT_SUB = get_font("/usr/share/fonts/TTF/Roboto-Regular.ttf", 14)
FONT_BADGE = get_font("/usr/share/fonts/TTF/Roboto-Bold.ttf", 12)
FONT_TINY = get_font("/usr/share/fonts/TTF/Roboto-Regular.ttf", 11)
FONT_MONO = get_font("/usr/share/fonts/TTF/JetBrainsMonoNL-Bold.ttf", 13)
FONT_MONO_SM = get_font("/usr/share/fonts/TTF/JetBrainsMonoNL-Regular.ttf", 11)
FONT_SUBTITLE = get_font("/usr/share/fonts/TTF/Roboto-Bold.ttf", 18)

SCENES = [
    {
        "id": "scene1",
        "ch": "01",
        "chapter_name": "APCP Cryptographic Enclave Mandate",
        "src": "/home/Brathap/payagent/public/screens/screen_protocol_page.png",
        "url": "https://payagent.ai/protocol • Agentic Payment Consent Protocol Blueprint",
        "voice": f"{VOICE_DIR}/voice_01.mp3",
        "callout": {
            "tag": "GUARANTEE 01",
            "title": "Zero-Overage Enclave",
            "bullets": [
                "Inviolable client spend ceiling ($100)",
                "Transactions > $100 mathematically blocked",
                "Decouples AI reasoning from direct funds"
            ],
            "color": (16, 185, 129, 255)
        },
        "subtitles": [
            (0.0, 5.0, "Meet PayAgent, built for the PayPal AI Hackathon 2026."),
            (5.0, 13.5, "While autonomous AI agents revolutionize shopping, they cannot safely spend money without runaway risk."),
            (13.5, 20.0, "We engineered APCP, the Agentic Payment Consent Protocol."),
            (20.0, 30.0, "Decoupling AI reasoning from financial authority via cryptographic enclaves and immutable nonces.")
        ],
        "cursor_path": [(400, 600), (700, 420), (750, 420), (820, 560)],
        "click_at": [7.0, 14.0]
    },
    {
        "id": "scene2",
        "ch": "02",
        "chapter_name": "Autonomous Shopper Canvas & $100 Budget Clamp",
        "src": "/home/Brathap/payagent/public/screens/screen_canvas_hero.png",
        "url": "https://payagent.ai/canvas • Autonomous Shopper & Spending Clamp",
        "voice": f"{VOICE_DIR}/voice_02.mp3",
        "callout": {
            "tag": "SECURITY 02",
            "title": "Hard Spending Clamp",
            "bullets": [
                "Locked strictly at $100.00 maximum",
                "Eliminates runaway AI hallucinations",
                "In-Chat PayPal Smart Payment Buttons"
            ],
            "color": (0, 112, 186, 255)
        },
        "subtitles": [
            (0.0, 6.0, "On the Shopper Canvas, users command their personal purchasing agent with natural voice or prompts."),
            (6.0, 13.5, "Crucially, the user sets a non-bypassable spending ceiling, here clamped strictly at one hundred dollars."),
            (13.5, 22.0, "If an agent attempts to spend even a single dollar above this mandate, the transaction is mathematically blocked.")
        ],
        "cursor_path": [(300, 700), (520, 540), (860, 480), (920, 480)],
        "click_at": [4.0, 11.5]
    },
    {
        "id": "scene3",
        "ch": "03",
        "chapter_name": "Multi-Merchant Autonomous Bidding Matrix",
        "src": "/home/Brathap/payagent/public/screens/screen_bidding.png",
        "url": "https://payagent.ai/bidding • Multi-Merchant RFQ Arbitration Matrix",
        "voice": f"{VOICE_DIR}/voice_03.mp3",
        "callout": {
            "tag": "SAVINGS 03",
            "title": "10% Partner Concession",
            "bullets": [
                "Automated 3-way merchant reverse RFQ",
                "Auto-negotiated 10% partner concession",
                "Over-budget and low-ESG bids rejected"
            ],
            "color": (139, 92, 246, 255)
        },
        "subtitles": [
            (0.0, 5.0, "Here is the Multi-Merchant Autonomous Bidding Matrix."),
            (5.0, 14.0, "PayAgent runs reverse RFQs across multiple suppliers in real time, scoring catalog pricing and ESG ratings."),
            (14.0, 22.5, "It arbitrates an automatic 10% partner concession, maximizing user value while instantly rejecting over-budget bids.")
        ],
        "cursor_path": [(300, 500), (500, 420), (800, 450), (1100, 450)],
        "click_at": [5.5, 12.0]
    },
    {
        "id": "scene4",
        "ch": "04",
        "chapter_name": "1-Click PayPal Capture & Settlement Pass",
        "src": "/home/Brathap/payagent/public/screens/screen_payment_success.png",
        "url": "https://payagent.ai/canvas?completed=true • Live PayPal Captured Settlement Pass",
        "voice": f"{VOICE_DIR}/voice_04.mp3",
        "callout": {
            "tag": "SETTLEMENT 04",
            "title": "Payment Captured Live",
            "bullets": [
                "Status: CAPTURED ($61.70 USD)",
                "Order ID: 8XY291048821942A",
                "Ed25519 cryptographic signature proof"
            ],
            "color": (16, 185, 129, 255)
        },
        "subtitles": [
            (0.0, 6.5, "With a single click, the staged transaction is dispatched directly to the PayPal Orders v2 API."),
            (6.5, 11.5, "The payment is instantly captured and confirmed!"),
            (11.5, 18.0, "Displayed right here on the website is the official PayPal Digital Settlement Pass—order status CAPTURED..."),
            (18.0, 23.5, "...sixty-one dollars and seventy cents settled, backed by an Ed25519 cryptographic signature proof.")
        ],
        "cursor_path": [(350, 480), (600, 420), (850, 400), (950, 460)],
        "click_at": [6.0, 11.5]
    },
    {
        "id": "scene5",
        "ch": "05",
        "chapter_name": "AG Grid Virtualized Merchant Hub",
        "src": "/home/Brathap/payagent/public/screens/screen_merchant_audit.png",
        "url": "https://payagent.ai/merchant-hub • AG Grid Community v36 Terminal",
        "voice": f"{VOICE_DIR}/voice_05.mp3",
        "callout": {
            "tag": "FINTECH 05",
            "title": "AG Grid v36 Hub",
            "bullets": [
                "Virtualized real-time telemetry",
                "Audit-ready cryptographic proof column",
                "Instant search, filtering & sorting"
            ],
            "color": (0, 112, 186, 255)
        },
        "subtitles": [
            (0.0, 6.5, "On the merchant side, transactions stream in real time through an enterprise AG Grid table."),
            (6.5, 13.5, "Built with AG Grid v36 Community, merchants enjoy high-performance virtualized rows and quick filtering."),
            (13.5, 20.3, "Permanently linked directly to each transaction's cryptographic proof.")
        ],
        "cursor_path": [(400, 650), (700, 520), (950, 440), (1100, 440)],
        "click_at": [7.5, 13.5]
    },
    {
        "id": "scene6",
        "ch": "06",
        "chapter_name": "304ms Instant Dispute Defense Shield",
        "src": "/home/Brathap/payagent/public/screens/screen_dispute.png",
        "url": "https://payagent.ai/dispute • 304ms PayPal Seller Protection Shield",
        "voice": f"{VOICE_DIR}/voice_06.mp3",
        "callout": {
            "tag": "DEFENSE 06",
            "title": "Zero-Dispute Immunity",
            "bullets": [
                "304ms automated dispute defense packet",
                "Cryptographic Ed25519 signature proof",
                "100% PayPal Seller Protection compliance"
            ],
            "color": (225, 29, 72, 255)
        },
        "subtitles": [
            (0.0, 5.5, "What happens when a buyer claims their AI bought something by mistake?"),
            (5.5, 11.0, "PayAgent's Dispute Defense Simulator demonstrates the breakthrough."),
            (11.0, 18.0, "In just 304 milliseconds, it matches the signed Ed25519 nonce to the PayPal capture ID..."),
            (18.0, 25.2, "...compiling a court-ready dossier that secures 100% merchant liability protection in the PayPal Resolution Center.")
        ],
        "cursor_path": [(350, 550), (650, 480), (1050, 450), (1150, 450)],
        "click_at": [9.0, 16.5]
    },
    {
        "id": "scene7",
        "ch": "07",
        "chapter_name": "PayPal Orders v2 REST API Live",
        "src": "/home/Brathap/payagent/public/screens/screen_api_playground.png",
        "url": "https://payagent.ai/api • PayPal Orders v2 REST Playground",
        "voice": f"{VOICE_DIR}/voice_07.mp3",
        "callout": {
            "tag": "REST API 07",
            "title": "PayPal Sandbox v2",
            "bullets": [
                "POST /v2/checkout/orders (201 Created)",
                "POST /orders/{id}/capture (Approved)",
                "Cryptographic non-repudiation built-in"
            ],
            "color": (0, 112, 186, 255)
        },
        "subtitles": [
            (0.0, 5.0, "PayAgent is not a mock wrapper. It is directly integrated with PayPal Orders v2 REST API."),
            (5.0, 12.0, "Featuring instant sandbox authorization, capture, and cryptographic non-repudiation."),
            (12.0, 22.3, "PayAgent makes autonomous agentic payments safe, accountable, and merchant-ready. Thank you, PayPal and AG Grid!")
        ],
        "cursor_path": [(400, 600), (750, 520), (1000, 460), (1100, 460)],
        "click_at": [6.0, 13.0]
    }
]

def get_audio_duration(path):
    res = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', path])
    return float(json.loads(res)['format']['duration'])

def draw_futuristic_grid(draw):
    # Sleek dark fintech studio background
    # Subtle cyber grid lines fading toward top
    for x in range(0, WIDTH + 1, 60):
        draw.line([(x, 70), (x, HEIGHT - 120)], fill=(30, 41, 59, 70), width=1)
    for y in range(70, HEIGHT - 110, 60):
        draw.line([(0, y), (WIDTH, y)], fill=(30, 41, 59, 70), width=1)

def pre_render_top_bar():
    # Width 1920, Height 70
    bar = Image.new('RGBA', (WIDTH, 70), (11, 15, 25, 255))
    draw = ImageDraw.Draw(bar)
    
    # Bottom subtle cyan dividing line
    draw.line([(0, 69), (WIDTH, 69)], fill=(30, 41, 59, 255), width=1)
    
    # Left: PayPal AI Hackathon Logo & PayAgent Badge
    draw.rounded_rectangle([30, 14, 82, 54], radius=10, fill=(0, 48, 135, 255))
    draw.text((46, 20), "P", fill=(255, 255, 255, 255), font=FONT_TITLE_MD)
    
    draw.text((95, 16), "PayAgent", fill=(255, 255, 255, 255), font=FONT_TITLE_MD)
    draw.text((96, 40), "Autonomous AI Commerce Protocol", fill=(148, 163, 184, 255), font=FONT_TINY)
    
    # Right: Verified Protocol Status Badges
    # Badge 1: Ed25519 Nonce Non-Repudiation
    draw.rounded_rectangle([1400, 18, 1640, 50], radius=8, fill=(16, 185, 129, 25), outline=(16, 185, 129, 120), width=1)
    draw.ellipse([1414, 30, 1422, 38], fill=(16, 185, 129, 255))
    draw.text((1432, 25), "ED25519 VERIFIED", fill=(16, 185, 129, 255), font=FONT_MONO_SM)
    
    # Badge 2: PayPal Sandbox Gateway
    draw.rounded_rectangle([1655, 18, 1890, 50], radius=8, fill=(0, 112, 186, 25), outline=(0, 112, 186, 120), width=1)
    draw.ellipse([1669, 30, 1677, 38], fill=(0, 207, 232, 255))
    draw.text((1687, 25), "PAYPAL SANDBOX v2", fill=(0, 207, 232, 255), font=FONT_MONO_SM)
    
    return bar

def pre_render_browser_window(scene_def):
    # Browser window: Width 1450, Height 845
    bw = 1450
    bh = 845
    pad = 16
    
    win = Image.new('RGBA', (bw, bh), (255, 255, 255, 255))
    draw = ImageDraw.Draw(win)
    
    # macOS Chrome title bar (Height 38)
    draw.rectangle([0, 0, bw, 38], fill=(241, 245, 249, 255))
    draw.line([0, 38, bw, 38], fill=(226, 232, 240, 255), width=1)
    
    # Window traffic light buttons
    draw.ellipse([16, 12, 28, 24], fill=(239, 68, 68, 255))
    draw.ellipse([34, 12, 46, 24], fill=(245, 158, 11, 255))
    draw.ellipse([52, 12, 64, 24], fill=(16, 185, 129, 255))
    
    # URL address bar
    url_box = [80, 6, bw - 220, 32]
    draw.rounded_rectangle(url_box, radius=6, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    draw.text((94, 9), f"🔒 {scene_def['url']}", fill=(71, 85, 105, 255), font=FONT_BADGE)
    
    # Top right pill: "APCP v1.0 • Sandbox Validated"
    draw.rounded_rectangle([bw - 200, 8, bw - 15, 30], radius=5, fill=(224, 231, 255, 255))
    draw.text((bw - 190, 11), "APCP v1.0 • Verified", fill=(67, 56, 202, 255), font=FONT_TINY)
    
    # Scale screenshot to fit the entire UI area (bw x bh-38)
    src_img = Image.open(scene_def['src']).convert('RGBA')
    ui_w = bw
    ui_h = bh - 38
    
    # Scale cleanly without any cropping on left/right/top/bottom!
    scaled_ui = src_img.resize((ui_w, ui_h), Image.Resampling.LANCZOS)
    win.paste(scaled_ui, (0, 38))
    
    # Crisp outer border
    draw.rounded_rectangle([0, 0, bw - 1, bh - 1], radius=16, outline=(148, 163, 184, 220), width=2)
    
    # Build soft drop shadow
    total_w = bw + pad * 2
    total_h = bh + pad * 2
    base = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    
    shadow_mask = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_mask)
    sdraw.rounded_rectangle([pad + 6, pad + 12, pad + bw + 6, pad + bh + 12], radius=18, fill=(0, 0, 0, 140))
    shadow_blur = shadow_mask.filter(ImageFilter.GaussianBlur(14))
    base.paste(shadow_blur, (0, 0), shadow_blur)
    base.paste(win, (pad, pad))
    
    return base, total_w, total_h

def pre_render_callout_card(cinfo):
    cw, ch = 380, 280
    card = Image.new('RGBA', (cw, ch), (15, 23, 42, 245))
    draw = ImageDraw.Draw(card)
    
    col = cinfo['color']
    # Outer neon accent border
    draw.rounded_rectangle([0, 0, cw - 1, ch - 1], radius=18, fill=(15, 23, 42, 240), outline=col[:3] + (180,), width=2)
    
    # Glow badge
    pill_fill = col[:3] + (35,)
    draw.rounded_rectangle([20, 20, 160, 48], radius=8, fill=pill_fill, outline=col[:3] + (140,), width=1)
    draw.text((32, 26), cinfo['tag'], fill=col, font=FONT_BADGE)
    
    # Title
    draw.text((22, 62), cinfo['title'], fill=(255, 255, 255, 255), font=FONT_TITLE_MD)
    draw.line([(22, 94), (cw - 22, 94)], fill=(51, 65, 85, 200), width=1)
    
    # Bullets
    for bi, b in enumerate(cinfo['bullets']):
        y = 112 + bi * 38
        draw.ellipse([24, y + 4, 32, y + 12], fill=col)
        draw.text((40, y), b, fill=(226, 232, 240, 255), font=FONT_SUB)
        
    return card, cw, ch

def draw_sentinel_robot(draw, ax, ay, t):
    # Head Base (Height 44, Width 54)
    draw.rounded_rectangle([ax, ay, ax + 54, ay + 44], radius=12, fill=(15, 23, 42, 255), outline=(0, 112, 186, 255), width=2)
    
    # Pulsing Antennas
    draw.line([(ax + 16, ay), (ax + 10, ay - 8)], fill=(0, 207, 232, 255), width=2)
    draw.ellipse([ax + 7, ay - 12, ax + 13, ay - 6], fill=(0, 207, 232, 255))
    draw.line([(ax + 38, ay), (ax + 44, ay - 8)], fill=(0, 207, 232, 255), width=2)
    draw.ellipse([ax + 41, ay - 12, ax + 47, ay - 6], fill=(0, 207, 232, 255))
    
    # Glowing Cyan Visor
    draw.rounded_rectangle([ax + 8, ay + 12, ax + 46, ay + 30], radius=6, fill=(0, 25, 55, 255), outline=(0, 207, 232, 220), width=1)
    
    # Animated Eyes with Blinking
    blink = math.sin(t * 3.8) > 0.95
    if blink:
        draw.line([(ax + 14, ay + 21), (ax + 23, ay + 21)], fill=(0, 207, 232, 255), width=2)
        draw.line([(ax + 31, ay + 21), (ax + 40, ay + 21)], fill=(0, 207, 232, 255), width=2)
    else:
        draw.ellipse([ax + 14, ay + 17, ax + 23, ay + 25], fill=(0, 207, 232, 255))
        draw.ellipse([ax + 31, ay + 17, ax + 40, ay + 25], fill=(0, 207, 232, 255))
        draw.ellipse([ax + 17, ay + 18, ax + 20, ay + 21], fill=(255, 255, 255, 255))
        draw.ellipse([ax + 34, ay + 18, ax + 37, ay + 21], fill=(255, 255, 255, 255))

def draw_fluid_audio_waveform(draw, start_x, cy, t, is_speaking=True):
    # 16-band Siri-style reactive audio equalizer bars
    num_bars = 16
    bar_w = 4
    spacing = 8
    
    for i in range(num_bars):
        bx = start_x + i * (bar_w + spacing)
        if is_speaking:
            # Dynamic harmonic heights
            h1 = math.sin(t * 8.0 + i * 0.45)
            h2 = math.cos(t * 5.2 - i * 0.3)
            amp = (abs(h1) * 0.6 + abs(h2) * 0.4)
            bar_h = max(6, int(amp * 28))
        else:
            bar_h = 4
            
        color = (0, int(180 + 75 * math.sin(i * 0.4)), int(220 + 35 * math.cos(i * 0.4)), 255)
        draw.rounded_rectangle([bx, cy - bar_h // 2, bx + bar_w, cy + bar_h // 2], radius=2, fill=color)

def draw_cursor(draw, x, y, click_progress=0.0):
    if click_progress > 0.0 and click_progress < 1.0:
        r = int(click_progress * 26)
        alpha = int((1.0 - click_progress) * 220)
        draw.ellipse([x - r, y - r, x + r, y + r], outline=(0, 207, 232, alpha), width=3)
    
    poly = [(x, y), (x + 13, y + 13), (x + 5, y + 14), (x + 8, y + 22), (x + 3, y + 23), (x + 1, y + 16), (x - 4, y + 20)]
    draw.polygon(poly, fill=(255, 255, 255, 255), outline=(15, 23, 42, 255))

def main():
    print("=== Launching High-Speed Keynote Video Generator ===")
    
    # Calculate audio durations
    total_duration = 0.0
    for s in SCENES:
        dur = get_audio_duration(s['voice'])
        s['duration'] = dur
        s['frames'] = int(dur * FPS)
        total_duration += dur
        print(f"Scene {s['ch']} [{s['chapter_name']}]: {dur:.2f}s ({s['frames']} frames)")
        
    print(f"Total Video Runtime: {total_duration:.2f}s ({int(total_duration * FPS)} frames)")
    
    # Pre-render static components
    print("Pre-rendering browser windows, headers, and holographic cards...")
    top_bar_img = pre_render_top_bar()
    
    base_bg = Image.new('RGBA', (WIDTH, HEIGHT), (10, 14, 23, 255))
    bg_draw = ImageDraw.Draw(base_bg)
    draw_futuristic_grid(bg_draw)
    base_bg.paste(top_bar_img, (0, 0))
    
    pre_assets = {}
    for s in SCENES:
        win_img, tw, th = pre_render_browser_window(s)
        card_img, cw, ch = pre_render_callout_card(s['callout'])
        pre_assets[s['id']] = {
            'win': win_img, 'tw': tw, 'th': th,
            'card': card_img, 'cw': cw, 'ch': ch
        }
        
    # Setup ffmpeg rawvideo pipe for ultra-fast direct MP4 encoding
    raw_video_path = os.path.join(OUTPUT_DIR, "cinema_stream.mp4")
    cmd_ffmpeg = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "ultrafast",
        "-crf", "20",
        raw_video_path
    ]
    proc = subprocess.Popen(cmd_ffmpeg, stdin=subprocess.PIPE)
    
    t0 = time.time()
    total_frames = sum(s['frames'] for s in SCENES)
    rendered_frames = 0
    
    # Sits at x=35, y=75
    win_x = 35
    win_y = 75
    card_x = 1515
    card_y = 110
    
    for sidx, s in enumerate(SCENES):
        asset = pre_assets[s['id']]
        win_img = asset['win']
        card_img = asset['card']
        
        # Pre-composite the scene background with browser window & static card & guide line
        scene_base = base_bg.copy()
        scene_base.paste(win_img, (win_x, win_y), win_img)
        scene_base.paste(card_img, (card_x, card_y), card_img)
        
        # Guide connector line
        col = s['callout']['color']
        sb_draw = ImageDraw.Draw(scene_base)
        sb_draw.line([(win_x + asset['tw'] - 20, card_y + 36), (card_x - 4, card_y + 36)], fill=col[:3] + (160,), width=2)
        sb_draw.ellipse([win_x + asset['tw'] - 24, card_y + 32, win_x + asset['tw'] - 16, card_y + 40], fill=col)
        
        # Dynamic Top Center Chapter Badge
        badge_text = f"CHAPTER {s['ch']} / 07 • {s['chapter_name'].upper()}"
        sb_draw.rounded_rectangle([620, 18, 1340, 50], radius=8, fill=(30, 41, 59, 220), outline=(0, 207, 232, 100), width=1)
        sb_draw.text((640, 25), badge_text, fill=(241, 245, 249, 255), font=FONT_BADGE)
        
        # Pre-convert to RGB format to eliminate color conversion overhead
        scene_base_rgb = scene_base.convert('RGB')
        
        print(f"\nRendering Scene {s['ch']}/07: {s['chapter_name']} ({s['frames']} frames)...")
        
        for f in range(s['frames']):
            t = f / float(FPS)
            progress = f / float(s['frames'])
            
            frame_pil = scene_base_rgb.copy()
            draw = ImageDraw.Draw(frame_pil)
            
            # 1. Animated macOS Cursor with Spline Motion
            cpath = s['cursor_path']
            num_segs = len(cpath) - 1
            cur_seg = min(num_segs - 1, int(progress * num_segs))
            seg_t = (progress * num_segs) - cur_seg
            seg_ease = 3 * seg_t**2 - 2 * seg_t**3
            p0 = cpath[cur_seg]
            p1 = cpath[cur_seg + 1]
            cx = int(win_x + 16 + p0[0] + (p1[0] - p0[0]) * seg_ease)
            cy = int(win_y + 16 + p0[1] + (p1[1] - p0[1]) * seg_ease)
            
            # Click ripple detection
            click_prog = 0.0
            for ct in s.get('click_at', []):
                dt = t - ct
                if 0.0 <= dt <= 0.6:
                    click_prog = dt / 0.6
                    break
            draw_cursor(draw, cx, cy, click_prog)
            
            # 2. Bottom Sentinel AI Companion Pill (y=955 to 1060)
            draw.rounded_rectangle([30, 955, 1890, 1060], radius=20, fill=(15, 23, 42), outline=(30, 41, 59), width=2)
            
            # Robot Avatar
            draw_sentinel_robot(draw, 50, 985, t)
            
            # Companion Label
            draw.text((124, 975), "SENTINEL AI PROTOCOL GUARDIAN", fill=(0, 207, 232), font=FONT_BADGE)
            draw.text((370, 975), "• PAYPAL AI HACKATHON 2026 VERIFIED NARRATION", fill=(148, 163, 184), font=FONT_TINY)
            
            # Active Subtitle
            current_sub = ""
            for t_start, t_end, text in s['subtitles']:
                if t_start <= t < t_end:
                    current_sub = text
                    break
            if current_sub:
                draw.text((124, 1005), current_sub, fill=(255, 255, 255), font=FONT_SUBTITLE)
                
            # Fluid 16-Band Equalizer Waveform
            draw_fluid_audio_waveform(draw, 1660, 1008, t, is_speaking=bool(current_sub))
            
            # Write RGB frame directly to ffmpeg (zero extra conversion!)
            proc.stdin.write(frame_pil.tobytes())
            
            rendered_frames += 1
            if rendered_frames % 240 == 0:
                elapsed = time.time() - t0
                fps_act = rendered_frames / elapsed
                eta = (total_frames - rendered_frames) / fps_act
                print(f"Rendered {rendered_frames}/{total_frames} frames ({fps_act:.1f} fps, ETA: {eta:.1f}s)...")
                
    proc.stdin.close()
    proc.wait()
    print("Video stream rendering complete!")
    
    # Multiplex audio and visuals into master MP4
    final_mp4 = os.path.join(OUTPUT_DIR, "payagent_demo.mp4")
    concat_list_file = f"{VOICE_DIR}/audio_concat.txt"
    with open(concat_list_file, "w") as cf:
        for s in SCENES:
            cf.write(f"file '{s['voice']}'\n")
            
    combined_audio = f"{VOICE_DIR}/voice_combined.mp3"
    print("Concatenating synchronized audio chapters...")
    subprocess.run(f"ffmpeg -y -f concat -safe 0 -i {concat_list_file} -c copy {combined_audio}", shell=True, check=True)
    
    print("Multiplexing master video with stereo audio track...")
    cmd_mux = [
        "ffmpeg", "-y",
        "-i", raw_video_path,
        "-i", combined_audio,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        final_mp4
    ]
    subprocess.run(cmd_mux, check=True)
    
    # Also sync to public directory for Next.js preview
    public_mp4 = "/home/Brathap/payagent/public/payagent_demo.mp4"
    subprocess.run(f"cp {final_mp4} {public_mp4}", shell=True, check=True)
    
    file_size_mb = os.path.getsize(final_mp4) / (1024 * 1024)
    print(f"\n Master Demo Video successfully created!")
    print(f"File: {final_mp4}")
    print(f"Public Copy: {public_mp4}")
    print(f"Size: {file_size_mb:.2f} MB")
    print(f"Runtime: {total_duration:.2f} seconds")
    print("Ready for PayPal AI Hackathon submission!")

if __name__ == "__main__":
    main()
