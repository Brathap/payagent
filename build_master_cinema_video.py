#!/usr/bin/env python3
"""
PayAgent Master Cinema Demo Video Builder
Award-Winning Silicon Valley Keynote Cinematography:
- 7 Distinct Pages & Rich Software Surfaces (APCP Protocol Blueprint, Shopper Canvas, Swarm Trace, 3-Merchant Bidding, AG Grid Community v36, Dispute Defense, PayPal Orders v2 REST API)
- 100% Crisp, Tack-Sharp Typography (Zero perspective blur or cut-off text)
- Subtle Cinematic Ken Burns Push-In (Smooth 1.00 -> 1.025 camera glide)
- Floating Glass Callout Cards on the Right
- Animated macOS Cursor with Spline Motion & Click Ripples
- Timed Subtitles & Animated Sentinel AI Companion Avatar with Audio Waveform
"""

import os, sys, math, time, subprocess, json
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH, HEIGHT = 1920, 1080
FPS = 24
OUTPUT_DIR = "/tmp/payagent_cinema_work"
os.makedirs(OUTPUT_DIR, exist_ok=True)

FINAL_OUTPUT = "/home/Brathap/payagent/payagent_demo.mp4"
PUBLIC_OUTPUT = "/home/Brathap/payagent/public/payagent_demo.mp4"

# Fonts
FONT_TITLE = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Bold.ttf", 24)
FONT_HEAD = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Bold.ttf", 19)
FONT_SUB = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Regular.ttf", 14)
FONT_BADGE = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Bold.ttf", 12)
FONT_TINY = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Regular.ttf", 11)
FONT_MONO = ImageFont.truetype("/usr/share/fonts/TTF/JetBrainsMonoNL-BoldItalic.ttf", 13)

SCENES = [
    {
        "id": "scene1",
        "ch": "01",
        "tag": "APCP PROTOCOL SPECIFICATION",
        "title": "The Agentic Payment Consent Protocol (APCP)",
        "type": "full",
        "src": "/home/Brathap/payagent/public/screens/screen_protocol_page.png",
        "size": (1420, 780),
        "url": "https://payagent.ai/protocol • APCP Protocol Specification",
        "voice": "/tmp/payagent_3d_claude_video/voice_01.mp3",
        "callout": {
            "tag": "GUARANTEE 01",
            "title": "Zero-Overage Enclave",
            "bullets": [
                "Inviolable client spend ceiling",
                "Transactions > $100 mathematically blocked",
                "Decouples AI reasoning from money"
            ],
            "color": (16, 185, 129, 255)
        },
        "subtitles": [
            (0.0, 5.2, "Meet PayAgent, built for the PayPal AI Hackathon 2026."),
            (5.2, 11.2, "As autonomous AI agents spend money, commerce faces runaway hallucinations and chargebacks."),
            (11.2, 16.0, "Our solution is APCP, the Agentic Payment Consent Protocol."),
            (16.0, 99.0, "Decoupling AI reasoning from direct financial authority with cryptographic enclave proofs.")
        ],
        "cursor_path": [(400, 600), (700, 420), (750, 420), (820, 560)],
        "click_at": [7.0, 14.0]
    },
    {
        "id": "scene2",
        "ch": "02",
        "tag": "AUTONOMOUS SHOPPER CANVAS",
        "title": "Natural Voice AI & Non-Bypassable Budget Clamp",
        "type": "full",
        "src": "/home/Brathap/payagent/public/screens/screen_canvas_hero.png",
        "size": (1420, 780),
        "url": "https://payagent.ai/canvas • Autonomous Shopper & Spending Clamp",
        "voice": "/tmp/payagent_3d_claude_video/voice_02.mp3",
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
            (0.0, 5.0, "On the Shopper Canvas, users command their personal purchasing agent using natural voice or prompt."),
            (5.0, 10.5, "Crucially, the user enforces a non-bypassable spending ceiling."),
            (10.5, 99.0, "If an agent attempts to spend even one dollar above the mandate, the transaction is mathematically blocked.")
        ],
        "cursor_path": [(300, 700), (520, 540), (860, 480), (920, 480)],
        "click_at": [4.0, 11.5]
    },
    {
        "id": "scene3",
        "ch": "03",
        "tag": "SUB-50ms REASONING TERMINAL",
        "title": "Deterministic Swarm Consensus & Thought Trace",
        "type": "swarm_trace",
        "src": "/home/Brathap/payagent/public/screens/screen_canvas_hero.png",
        "size": (1420, 780),
        "url": "https://payagent.ai/reasoning • Sub-50ms Swarm Execution Tree",
        "voice": "/tmp/payagent_3d_claude_video/voice_03.mp3",
        "callout": {
            "tag": "TELEMETRY 03",
            "title": "Sub-50ms Swarm Latency",
            "bullets": [
                "38ms deterministic execution",
                "Ed25519 cryptographic consent nonce",
                "Zero black-box hallucination risk"
            ],
            "color": (139, 92, 246, 255)
        },
        "subtitles": [
            (0.0, 5.0, "Under the hood, PayAgent executes a sub-50ms deterministic reasoning tree."),
            (5.0, 11.0, "Watch the live swarm trace as it verifies catalog specifications and tests budget constraints."),
            (11.0, 99.0, "It generates an Ed25519 cryptographic consent nonce before funds can ever move.")
        ],
        "cursor_path": [(350, 450), (600, 380), (850, 420), (1050, 460)],
        "click_at": [6.5, 13.0]
    },
    {
        "id": "scene4",
        "ch": "04",
        "tag": "MULTI-MERCHANT REVERSE AUCTION",
        "title": "Multi-Agent Bidding & Instant Rebate Optimization",
        "type": "full",
        "src": "/home/Brathap/payagent/public/screens/screen_bidding.png",
        "size": (1420, 780),
        "url": "https://payagent.ai/bidding • Multi-Merchant Autonomous Matrix",
        "voice": "/tmp/payagent_3d_claude_video/voice_04.mp3",
        "callout": {
            "tag": "ARBITRATION 04",
            "title": "Autonomous Bidding",
            "bullets": [
                "3 competing suppliers bid in real time",
                "EcoSupply Co wins with 10% rebate",
                "$80.10 settled via PayPal Orders v2"
            ],
            "color": (16, 185, 129, 255)
        },
        "subtitles": [
            (0.0, 4.5, "The Shopper Agent orchestrates an autonomous multi-merchant reverse auction."),
            (4.5, 10.5, "Three competing suppliers bid: EcoSupply Co, Global TechDirect, and FastShip Retail."),
            (10.5, 99.0, "EcoSupply Co wins with a 10% partner concession applied under the user's budget.")
        ],
        "cursor_path": [(320, 500), (640, 420), (1080, 420), (1120, 420)],
        "click_at": [8.0, 12.5]
    },
    {
        "id": "scene5",
        "ch": "05",
        "tag": "AG GRID COMMUNITY v36 TELEMETRY",
        "title": "Enterprise Financial Settlement & Audit Trail",
        "type": "full",
        "src": "/home/Brathap/payagent/public/screens/screen_merchant_audit.png",
        "size": (1420, 780),
        "url": "https://payagent.ai/merchant • AG Grid Enterprise Telemetry",
        "voice": "/tmp/payagent_3d_claude_video/voice_05.mp3",
        "callout": {
            "tag": "AUDIT 05",
            "title": "AG Grid Community v36",
            "bullets": [
                "High-performance virtualized rows",
                "Cryptographic proof chain on every trade",
                "Instant search, filtering & column sorting"
            ],
            "color": (0, 112, 186, 255)
        },
        "subtitles": [
            (0.0, 5.0, "For merchants, PayAgent integrates AG Grid Community v36."),
            (5.0, 11.0, "High-performance virtualized rows track every autonomous trade in real time."),
            (11.0, 99.0, "Each transaction is permanently linked to its Ed25519 cryptographic proof and PayPal settlement hash.")
        ],
        "cursor_path": [(400, 650), (700, 520), (950, 440), (1100, 440)],
        "click_at": [7.5, 13.5]
    },
    {
        "id": "scene6",
        "ch": "06",
        "tag": "PAYPAL RESOLUTION DEFENSE",
        "title": "1-Click Dispute Shield & Carrier Telematics",
        "type": "full",
        "src": "/home/Brathap/payagent/public/screens/screen_dispute.png",
        "size": (1420, 780),
        "url": "https://payagent.ai/dispute • Instant 304ms Resolution Center",
        "voice": "/tmp/payagent_3d_claude_video/voice_06.mp3",
        "callout": {
            "tag": "DEFENSE 06",
            "title": "100% Defense Win Rate",
            "bullets": [
                "Matches Ed25519 nonce to PayPal Capture ID",
                "Packages court-ready proof in 304ms",
                "100% Merchant Defense Cleared"
            ],
            "color": (225, 29, 72, 255)
        },
        "subtitles": [
            (0.0, 5.5, "What happens when a buyer claims their AI bought something by mistake?"),
            (5.5, 11.5, "PayAgent's Dispute Defense Simulator demonstrates the breakthrough."),
            (11.5, 16.0, "In 304 milliseconds, it matches the signed Ed25519 nonce to the PayPal capture ID."),
            (16.0, 99.0, "Securing 100% merchant liability protection in the PayPal Resolution Center.")
        ],
        "cursor_path": [(350, 550), (650, 480), (1050, 450), (1150, 450)],
        "click_at": [9.0, 16.5]
    },
    {
        "id": "scene7",
        "ch": "07",
        "tag": "PRODUCTION PAYPAL ORDERS V2 API",
        "title": "Live Sandbox Authorization & Capture Playground",
        "type": "full",
        "src": "/home/Brathap/payagent/public/screens/screen_api_playground.png",
        "size": (1420, 780),
        "url": "https://payagent.ai/api • PayPal Orders v2 Sandbox REST API",
        "voice": "/tmp/payagent_3d_claude_video/voice_07.mp3",
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
            (0.0, 4.5, "PayAgent is not a mock wrapper. It is directly integrated with PayPal's Orders v2 REST API."),
            (4.5, 11.0, "Featuring instant sandbox authorization, capture, and cryptographic non-repudiation."),
            (11.0, 99.0, "This is the future of autonomous commerce. Thank you, PayPal and AG Grid.")
        ],
        "cursor_path": [(400, 600), (750, 520), (1000, 460), (1100, 460)],
        "click_at": [6.0, 13.0]
    }
]

def get_audio_duration(path):
    res = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', path])
    return float(json.loads(res)['format']['duration'])

def draw_3d_grid(draw, horizon_y=280, vp_x=960):
    for angle in np.linspace(-68, 68, 35):
        rad = math.radians(angle)
        x_bottom = vp_x + math.tan(rad) * (HEIGHT - horizon_y) * 2.2
        draw.line([(vp_x, horizon_y), (int(x_bottom), HEIGHT)], fill=(226, 232, 240, 140), width=1)
    for i in range(1, 25):
        ratio = (i / 25.0) ** 2.4
        y = int(horizon_y + ratio * (HEIGHT - horizon_y))
        alpha = int(ratio * 150)
        draw.line([(0, y), (WIDTH, y)], fill=(203, 213, 225, alpha), width=1)

def pre_render_ui_card(sdef):
    cw, ch = sdef['size']
    pad = 24
    win = Image.new('RGBA', (cw, ch), (255, 255, 255, 255))
    wdraw = ImageDraw.Draw(win)
    
    # macOS Chrome bar
    wdraw.rectangle([0, 0, cw, 42], fill=(241, 245, 249, 255))
    wdraw.line([0, 42, cw, 42], fill=(226, 232, 240, 255), width=1)
    wdraw.ellipse([16, 14, 28, 26], fill=(239, 68, 68, 255))
    wdraw.ellipse([34, 14, 46, 26], fill=(245, 158, 11, 255))
    wdraw.ellipse([52, 14, 64, 26], fill=(16, 185, 129, 255))
    
    wdraw.rounded_rectangle([80, 7, cw - 260, 33], radius=6, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    wdraw.text((96, 10), f'🔒 {sdef.get("url", "https://payagent.ai")}', fill=(71, 85, 105, 255), font=FONT_BADGE)
    
    src_img = Image.open(sdef['src'])
    if sdef['type'] == 'swarm_trace':
        # Crop directly to the Swarm Execution Pipeline without cutting words
        # In a 1920x1080 screenshot, the pipeline spans x=60..1860, y=260..940
        crop_img = src_img.crop((60, 260, 1860, 940))
        scaled_img = crop_img.resize((cw, ch - 42), Image.Resampling.LANCZOS)
    else: # full
        scale = cw / float(src_img.width)
        scaled_h = int(src_img.height * scale)
        scaled_img = src_img.resize((cw, scaled_h), Image.Resampling.LANCZOS).crop((0, 0, cw, ch - 42))
        
    win.paste(scaled_img, (0, 42))
    wdraw.rounded_rectangle([0, 0, cw - 1, ch - 1], radius=16, outline=(203, 213, 225, 220), width=2)
    
    # Shadow base
    total_w = cw + pad * 2
    total_h = ch + pad * 2
    base = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    
    shadow_mask = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_mask)
    sdraw.rounded_rectangle([pad + 4, pad + 12, pad + cw + 4, pad + ch + 12], radius=16, fill=(15, 23, 42, 60))
    shadow_blur = shadow_mask.filter(ImageFilter.GaussianBlur(16))
    base.paste(shadow_blur, (0, 0), shadow_blur)
    
    base.paste(win, (pad, pad))
    return base, total_w, total_h

def pre_render_callout_card(cinfo):
    cw, ch = 390, 270
    card = Image.new('RGBA', (cw, ch), (255, 255, 255, 250))
    cdraw = ImageDraw.Draw(card)
    
    # Outer subtle glow border
    cdraw.rounded_rectangle([0, 0, cw - 1, ch - 1], radius=20, fill=(255, 255, 255, 252), outline=(203, 213, 225, 255), width=2)
    
    # Accent color pill badge
    col = cinfo['color']
    pill_fill = col[:3] + (25,)
    cdraw.rounded_rectangle([18, 18, 140, 42], radius=6, fill=pill_fill, outline=col[:3] + (120,), width=1)
    cdraw.text((26, 23), cinfo['tag'], fill=col, font=FONT_BADGE)
    
    # Title
    cdraw.text((20, 56), cinfo['title'], fill=(15, 23, 42, 255), font=FONT_TITLE)
    
    # Bullets
    for bi, b in enumerate(cinfo['bullets']):
        cdraw.text((20, 106 + bi * 34), f"• {b}", fill=(51, 65, 85, 255), font=FONT_SUB)
        
    return card, cw, ch

def draw_cursor(draw, x, y, click_progress=0.0):
    if click_progress > 0.0 and click_progress < 1.0:
        r = int(click_progress * 30)
        alpha = int((1.0 - click_progress) * 220)
        draw.ellipse([x - r, y - r, x + r, y + r], outline=(0, 112, 186, alpha), width=3)
    
    poly = [(x, y), (x + 14, y + 14), (x + 6, y + 15), (x + 9, y + 23), (x + 4, y + 25), (x + 1, y + 17), (x - 4, y + 21)]
    draw.polygon(poly, fill=(255, 255, 255, 255), outline=(15, 23, 42, 255))

def draw_sentinel_avatar(draw, ax, ay, t):
    # Head Base
    draw.rounded_rectangle([ax, ay, ax + 52, ay + 42], radius=12, fill=(15, 23, 42, 255), outline=(0, 112, 186, 255), width=2)
    
    # Antennas
    draw.line([(ax + 16, ay), (ax + 10, ay - 6)], fill=(0, 207, 232, 255), width=2)
    draw.ellipse([ax + 8, ay - 9, ax + 12, ay - 5], fill=(0, 207, 232, 255))
    draw.line([(ax + 36, ay), (ax + 42, ay - 6)], fill=(0, 207, 232, 255), width=2)
    draw.ellipse([ax + 40, ay - 9, ax + 44, ay - 5], fill=(0, 207, 232, 255))
    
    # Glowing Cyan Visor
    draw.rounded_rectangle([ax + 8, ay + 12, ax + 44, ay + 28], radius=6, fill=(0, 30, 60, 255), outline=(0, 207, 232, 200), width=1)
    
    # Animated Eyes
    blink = math.sin(t * 3.5) > 0.94
    if blink:
        draw.line([(ax + 14, ay + 20), (ax + 22, ay + 20)], fill=(0, 207, 232, 255), width=2)
        draw.line([(ax + 30, ay + 20), (ax + 38, ay + 20)], fill=(0, 207, 232, 255), width=2)
    else:
        draw.ellipse([ax + 14, ay + 17, ax + 22, ay + 23], fill=(0, 207, 232, 255))
        draw.ellipse([ax + 30, ay + 17, ax + 38, ay + 23], fill=(0, 207, 232, 255))
        draw.ellipse([ax + 17, ay + 18, ax + 19, ay + 20], fill=(255, 255, 255, 255))
        draw.ellipse([ax + 33, ay + 18, ax + 35, ay + 20], fill=(255, 255, 255, 255))

def main():
    print("=== Commencing Master Cinema Demo Video Builder ===")
    
    # Load audio durations
    total_duration = 0.0
    for s in SCENES:
        dur = get_audio_duration(s['voice'])
        s['duration'] = dur
        s['frames'] = int(dur * FPS)
        total_duration += dur
        print(f"Scene {s['ch']} [{s['tag']}]: {dur:.2f}s ({s['frames']} frames)")
        
    print(f"Total Video Runtime: {total_duration:.2f} seconds ({int(total_duration * FPS)} frames)")
    
    # Pre-render static assets
    print("Pre-rendering browser windows and holographic cards...")
    pre_assets = {}
    for s in SCENES:
        base_win, tw, th = pre_render_ui_card(s)
        card_img, fw, fh = pre_render_callout_card(s['callout'])
        pre_assets[s['id']] = {
            'win': base_win, 'tw': tw, 'th': th,
            'card': card_img, 'fw': fw, 'fh': fh
        }
        
    # Pre-render base 3D grid
    base_grid_pil = Image.new('RGBA', (WIDTH, HEIGHT), (248, 250, 252, 255))
    grid_draw = ImageDraw.Draw(base_grid_pil)
    draw_3d_grid(grid_draw, horizon_y=280, vp_x=960)
    
    # Setup ffmpeg rawvideo pipe
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
        "-preset", "veryfast",
        "-crf", "18",
        raw_video_path
    ]
    proc = subprocess.Popen(cmd_ffmpeg, stdin=subprocess.PIPE)
    
    global_frame = 0
    t0 = time.time()
    
    for sidx, s in enumerate(SCENES):
        print(f"\nRendering Scene {s['ch']} / 07: {s['tag']} ({s['frames']} frames)...")
        asset = pre_assets[s['id']]
        win_img = asset['win']
        tw, th = asset['tw'], asset['th']
        
        # Sits majestically on the left (x=30..1470), callout card on the right (x=1490..1880)
        base_x = 30
        base_y = 50
        
        for f in range(s['frames']):
            t = f / float(FPS)
            progress = f / float(s['frames'])
            
            # Smooth cinematic Ken Burns camera push-in: 1.00 -> 1.025
            zoom = 1.00 + 0.025 * progress
            
            frame_pil = base_grid_pil.copy()
            draw = ImageDraw.Draw(frame_pil)
            
            # 1. Paste crisp, razor-sharp UI browser window (NO PERSPECTIVE SKEW)
            if zoom != 1.00:
                zw = int(tw * zoom)
                zh = int(th * zoom)
                zoomed_win = win_img.resize((zw, zh), Image.Resampling.BILINEAR)
                # Keep anchored at upper-left with subtle drift
                dx = int((zw - tw) * 0.3)
                dy = int((zh - th) * 0.3)
                frame_pil.paste(zoomed_win, (base_x - dx, base_y - dy), zoomed_win)
            else:
                frame_pil.paste(win_img, (base_x, base_y), win_img)
            
            # 2. Holographic Callout Card on Right (Floating smoothly)
            fx = 1490
            fy = 90
            float_y = int(math.sin(t * 2.5) * 4)
            frame_pil.paste(asset['card'], (fx, fy + float_y), asset['card'])
            
            # Subtle accent guide dot and connector
            guide_y = fy + 38 + float_y
            col = s['callout']['color']
            draw.line([(base_x + tw - 24, guide_y), (fx - 4, guide_y)], fill=col[:3] + (160,), width=2)
            draw.ellipse([base_x + tw - 28, guide_y - 4, base_x + tw - 20, guide_y + 4], fill=col)
            
            # 3. Animated macOS Cursor with Spline Motion
            cpath = s['cursor_path']
            num_segs = len(cpath) - 1
            cur_seg = min(num_segs - 1, int(progress * num_segs))
            seg_t = (progress * num_segs) - cur_seg
            seg_ease = 3 * seg_t**2 - 2 * seg_t**3
            p1 = cpath[cur_seg]
            p2 = cpath[cur_seg + 1]
            cur_x = int(p1[0] + (p2[0] - p1[0]) * seg_ease)
            cur_y = int(p1[1] + (p2[1] - p1[1]) * seg_ease)
            
            # Click ripple detection
            click_prog = 0.0
            for ct in s['click_at']:
                if 0.0 <= (t - ct) <= 0.6:
                    click_prog = (t - ct) / 0.6
                    break
            draw_cursor(draw, cur_x, cur_y, click_prog)
            
            # 4. Bottom Cinema Subtitle Card
            sub_w = 1600
            sub_h = 80
            sub_x = (WIDTH - sub_w) // 2
            sub_y = HEIGHT - 105
            
            # Subtitle Shadow & Glass Container
            draw.rounded_rectangle([sub_x + 3, sub_y + 8, sub_x + sub_w + 3, sub_y + sub_h + 8], radius=16, fill=(15, 23, 42, 35))
            draw.rounded_rectangle([sub_x, sub_y, sub_x + sub_w, sub_y + sub_h], radius=16, fill=(255, 255, 255, 252), outline=(203, 213, 225, 255), width=1)
            
            # Animated Sentinel Cyber Avatar
            draw_sentinel_avatar(draw, sub_x + 18, sub_y + 14, t)
            
            draw.text((sub_x + 82, sub_y + 16), "SENTINEL AI PROTOCOL GUARDIAN", fill=(0, 112, 186, 255), font=FONT_BADGE)
            
            # Find active timed subtitle
            active_sub = s['subtitles'][-1][2]
            for start_t, end_t, txt in s['subtitles']:
                if start_t <= t < end_t:
                    active_sub = txt
                    break
                    
            draw.text((sub_x + 82, sub_y + 38), active_sub, fill=(15, 23, 42, 255), font=FONT_HEAD)
            
            # Audio Reactive Waveform on Right
            for wi in range(14):
                bar_h = max(4, int(14 + math.sin(t * 14.0 + wi * 0.7) * 10))
                wx = sub_x + sub_w - 130 + wi * 7
                wy = sub_y + 40 - bar_h // 2
                draw.rounded_rectangle([wx, wy, wx + 4, wy + bar_h], radius=2, fill=(0, 112, 186, 255))
                
            # Write RGB frame to ffmpeg
            rgb_arr = np.array(frame_pil.convert("RGB"))
            proc.stdin.write(rgb_arr.tobytes())
            global_frame += 1
            
        print(f"Scene {s['ch']} completed in {time.time() - t0:.1f}s.")
        
    proc.stdin.close()
    proc.wait()
    print("\nVideo stream encoding finished!")
    
    # 5. Composite Final Audio (Voice + Ambient Synth Soundtrack)
    print("Compositing voice tracks and ambient synth soundtrack...")
    voice_concat_list = os.path.join(OUTPUT_DIR, "voice_concat.txt")
    with open(voice_concat_list, "w") as f:
        for s in SCENES:
            f.write(f"file '{s['voice']}'\n")
            
    combined_voice = os.path.join(OUTPUT_DIR, "voice_combined.mp3")
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", voice_concat_list, "-c", "copy", combined_voice
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Ambient Silicon Valley Synth
    ambient_wav = os.path.join(OUTPUT_DIR, "ambient.wav")
    sr = 44100
    ambient_samples = int(total_duration * sr) + 88200
    t_arr = np.linspace(0, total_duration + 2.0, ambient_samples)
    
    synth = 0.03 * np.sin(2 * np.pi * 110 * t_arr)
    synth += 0.02 * np.sin(2 * np.pi * 220 * t_arr)
    synth += 0.015 * np.sin(2 * np.pi * 330 * t_arr)
    synth += 0.01 * np.sin(2 * np.pi * 55 * t_arr)
    
    chord_mod = np.sin(2 * np.pi * 0.2 * t_arr)
    synth = synth * (0.8 + 0.2 * chord_mod)
    synth_16 = (synth * 32767).astype(np.int16)
    
    import wave
    with wave.open(ambient_wav, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(synth_16.tobytes())
        
    # Final Mux to FINAL_OUTPUT
    cmd_mux = [
        "ffmpeg", "-y",
        "-i", raw_video_path,
        "-i", combined_voice,
        "-i", ambient_wav,
        "-filter_complex",
        "[1:a]volume=1.0[v];[2:a]volume=0.25[bg];[v][bg]amix=inputs=2:duration=first[a]",
        "-map", "0:v",
        "-map", "[a]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        FINAL_OUTPUT
    ]
    subprocess.run(cmd_mux, check=True)
    
    # Copy to public folder for direct browser playback
    subprocess.run(["cp", "-f", FINAL_OUTPUT, PUBLIC_OUTPUT], check=True)
    
    sz = os.path.getsize(FINAL_OUTPUT) / (1024 * 1024)
    print("\n=======================================================")
    print(f"Master Cinema Demo Video ready: {FINAL_OUTPUT} ({sz:.2f} MB)")
    print(f"Public browser stream ready at: http://localhost:3001/payagent_demo.mp4")
    print("=======================================================\n")

if __name__ == "__main__":
    main()
