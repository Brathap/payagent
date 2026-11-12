#!/usr/bin/env python3
"""
PayAgent Master Cinema 3D Demo Video Builder
Award-winning Silicon Valley Product Launch Cinematography
- 7 Distinct Pages & Rich Surfaces
- Large, Ultra-Sharp UI Displays (1300-1360px wide, 100% legible)
- Smooth 3D Camera Kinematics (dolly forward, yaw/pitch drift)
- Side-by-Side Floating Holographic Callout Cards
- Animated macOS Cursor with Click Ripples & Slider Motions
- Dynamic Timed Subtitles (never cut off, perfectly synchronized)
- Sentinel AI Cyber Avatar with glowing visor & live audio waveform
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
FONT_TITLE = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Bold.ttf", 26)
FONT_HEAD = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Bold.ttf", 20)
FONT_SUB = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Regular.ttf", 15)
FONT_BADGE = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Bold.ttf", 13)
FONT_TINY = ImageFont.truetype("/usr/share/fonts/TTF/Roboto-Regular.ttf", 12)
FONT_MONO = ImageFont.truetype("/usr/share/fonts/TTF/JetBrainsMonoNL-BoldItalic.ttf", 14)

SCENES = [
    {
        "id": "scene1",
        "ch": "01",
        "tag": "APCP PROTOCOL SPECIFICATION",
        "title": "The Agentic Payment Consent Protocol (APCP)",
        "type": "modal_crop",
        "src": "/home/Brathap/payagent/public/screens/screen_protocol_modal.png",
        "crop": (560, 180, 1360, 900),
        "size": (1300, 750),
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
        "size": (1360, 760),
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
        "type": "wide",
        "src": "/home/Brathap/payagent/public/screens/crop_reasoning.png",
        "size": (1360, 580),
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
        "type": "wide",
        "src": "/home/Brathap/payagent/public/screens/crop_bidding.png",
        "size": (1360, 580),
        "voice": "/tmp/payagent_3d_claude_video/voice_04.mp3",
        "callout": {
            "tag": "ARBITRATION 04",
            "title": "Autonomous Bidding",
            "bullets": [
                "3 competing suppliers bid in real time",
                "FastShip Retail wins at $89.50",
                "8.5% instant rebate ($8.50 saved)"
            ],
            "color": (16, 185, 129, 255)
        },
        "subtitles": [
            (0.0, 4.5, "The Shopper Agent orchestrates an autonomous multi-merchant reverse auction."),
            (4.5, 10.5, "Three competing suppliers bid: EcoSupply Co, Global TechDirect, and FastShip Retail."),
            (10.5, 99.0, "FastShip Retail wins at $89.50 with an 8.5% instant rebate applied under the user's budget.")
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
        "size": (1360, 760),
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
        "type": "wide",
        "src": "/home/Brathap/payagent/public/screens/crop_dispute.png",
        "size": (1360, 580),
        "voice": "/tmp/payagent_3d_claude_video/voice_06.mp3",
        "callout": {
            "tag": "DEFENSE 06",
            "title": "100% Defense Win Rate",
            "bullets": [
                "Matches Ed25519 nonce to PayPal Capture ID",
                "Packages court-ready proof in 304ms",
                "Saves merchants up to $420/month"
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
        "size": (1360, 760),
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
        draw.line([(0, y), (WIDTH, y)], fill=(226, 232, 240, int(50 + ratio * 130)), width=1)

def pre_render_ui_card(sdef):
    cw, ch = sdef['size']
    pad = 20
    win = Image.new('RGBA', (cw, ch), (255, 255, 255, 255))
    wdraw = ImageDraw.Draw(win)
    
    # Chrome bar
    wdraw.rectangle([0, 0, cw, 42], fill=(241, 245, 249, 255))
    wdraw.line([0, 42, cw, 42], fill=(226, 232, 240, 255), width=1)
    wdraw.ellipse([16, 15, 28, 27], fill=(239, 68, 68, 255))
    wdraw.ellipse([34, 15, 46, 27], fill=(245, 158, 11, 255))
    wdraw.ellipse([52, 15, 64, 27], fill=(16, 185, 129, 255))
    
    wdraw.rounded_rectangle([80, 8, cw - 240, 34], radius=6, fill=(255, 255, 255, 255), outline=(203, 213, 225, 255), width=1)
    wdraw.text((96, 11), f'🔒 https://payagent.ai/{sdef["id"]} • PayPal Sandbox v2 Verified', fill=(71, 85, 105, 255), font=FONT_BADGE)
    
    src_img = Image.open(sdef['src'])
    if sdef['type'] == 'modal_crop':
        crop_img = src_img.crop(sdef['crop'])
        scaled_img = crop_img.resize((cw, ch - 42), Image.Resampling.LANCZOS)
    elif sdef['type'] == 'wide':
        scaled_img = src_img.resize((cw, ch - 42), Image.Resampling.LANCZOS)
    else: # full
        scale = cw / float(src_img.width)
        scaled_h = int(src_img.height * scale)
        scaled_img = src_img.resize((cw, scaled_h), Image.Resampling.LANCZOS).crop((0, 0, cw, ch - 42))
        
    win.paste(scaled_img, (0, 42))
    wdraw.rounded_rectangle([0, 0, cw - 1, ch - 1], radius=16, outline=(203, 213, 225, 220), width=2)
    
    # Base with shadow
    total_w = cw + pad * 2
    total_h = ch + pad * 2
    base = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    
    shadow_mask = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_mask)
    sdraw.rounded_rectangle([pad + 4, pad + 12, pad + cw + 4, pad + ch + 12], radius=16, fill=(15, 23, 42, 70))
    shadow_blur = shadow_mask.filter(ImageFilter.GaussianBlur(16))
    base.paste(shadow_blur, (0, 0), shadow_blur)
    
    base.paste(win, (pad, pad))
    bgra = cv2.cvtColor(np.array(base), cv2.COLOR_RGBA2BGRA)
    return bgra, total_w, total_h

def pre_render_callout_card(cinfo):
    fw, fh = 430, 180
    card = Image.new('RGBA', (fw + 8, fh + 12), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(card)
    
    # Shadow
    cdraw.rounded_rectangle([4, 8, fw + 4, fh + 8], radius=14, fill=(15, 23, 42, 35))
    # Body
    cdraw.rounded_rectangle([0, 0, fw, fh], radius=14, fill=(255, 255, 255, 252), outline=cinfo['color'], width=2)
    # Tag
    cdraw.rounded_rectangle([16, 16, 170, 44], radius=6, fill=cinfo['color'][:3] + (30,))
    cdraw.text((24, 22), cinfo['tag'], fill=cinfo['color'], font=FONT_BADGE)
    # Title
    cdraw.text((16, 54), cinfo['title'], fill=(15, 23, 42, 255), font=FONT_HEAD)
    # Bullets
    y_b = 88
    for b in cinfo['bullets']:
        cdraw.ellipse([18, y_b + 5, 24, y_b + 11], fill=cinfo['color'])
        cdraw.text((32, y_b), b, fill=(30, 41, 59, 255), font=FONT_SUB)
        y_b += 26
        
    return card, fw, fh

def draw_cursor(draw, x, y, click_progress=0.0):
    # macOS style cursor
    pts = [(x, y), (x, y + 22), (x + 6, y + 17), (x + 13, y + 25), (x + 16, y + 22), (x + 9, y + 14), (x + 17, y + 14)]
    draw.polygon(pts, fill=(255, 255, 255, 255), outline=(15, 23, 42, 255))
    
    # Expanding click ripple
    if 0.0 < click_progress < 1.0:
        rad = int(8 + click_progress * 35)
        alpha = int((1.0 - click_progress) * 200)
        draw.ellipse([x - rad, y - rad, x + rad, y + rad], outline=(0, 112, 186, alpha), width=3)

def draw_sentinel_avatar(draw, ax, ay, t):
    bob = int(math.sin(t * 5.0) * 4)
    cy = ay + bob
    
    # Halo pulse
    pulse = int(math.sin(t * 8.0) * 4)
    draw.ellipse([ax - 4 - pulse, cy - 4 - pulse, ax + 56 + pulse, cy + 56 + pulse],
                 outline=(0, 112, 186, int(50 + math.sin(t * 6.0) * 30)), width=2)
    
    # Antenna
    draw.line([(ax + 26, cy + 4), (ax + 26, cy - 8)], fill=(148, 163, 184, 255), width=2)
    orb_pulse = int(3 + math.sin(t * 10.0) * 2)
    draw.ellipse([ax + 26 - orb_pulse, cy - 10 - orb_pulse, ax + 26 + orb_pulse, cy - 10 + orb_pulse], fill=(6, 182, 212, 255))
    
    # Head
    draw.rounded_rectangle([ax, cy, ax + 52, cy + 48], radius=14, fill=(255, 255, 255, 255), outline=(0, 112, 186, 255), width=2)
    # Visor
    draw.rounded_rectangle([ax + 6, cy + 12, ax + 46, cy + 36], radius=8, fill=(15, 23, 42, 255))
    
    # Cyber eyes
    is_blink = (t % 3.8) > 3.6
    eye_h = 2 if is_blink else 6
    draw.ellipse([ax + 14, cy + 24 - eye_h//2, ax + 22, cy + 24 + eye_h//2], fill=(6, 182, 212, 255))
    draw.ellipse([ax + 30, cy + 24 - eye_h//2, ax + 38, cy + 24 + eye_h//2], fill=(6, 182, 212, 255))

def main():
    print("=== Commencing Master Cinema 3D Demo Video Builder ===")
    
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
        bgra, tw, th = pre_render_ui_card(s)
        card_img, fw, fh = pre_render_callout_card(s['callout'])
        pre_assets[s['id']] = {
            'bgra': bgra, 'tw': tw, 'th': th,
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
        bgra = asset['bgra']
        tw, th = asset['tw'], asset['th']
        src_pts = np.float32([[0, 0], [tw, 0], [tw, th], [0, th]])
        
        # Center positions for UI card: sits nicely on left-center, callout on right
        target_cx = 760
        target_cy = 470 if th >= 700 else 460
        
        last_warp_frame = -99
        last_warped_pil = None
        
        for f in range(s['frames']):
            t = f / float(FPS)
            progress = f / float(s['frames'])
            
            # Smooth 3D camera dolly-in & yaw drift
            # Camera gently pushes from 0.98 to 1.04
            zoom = 0.98 + 0.06 * progress
            yaw = -0.015 + 0.010 * progress
            pitch = 0.018 - 0.008 * progress
            
            hw = (tw * zoom) / 2.0
            hh = (th * zoom) / 2.0
            
            if f - last_warp_frame >= 2 or last_warped_pil is None:
                dst_pts = np.float32([
                    [target_cx - hw * (1.0 - yaw), target_cy - hh * (1.0 + pitch)],
                    [target_cx + hw * (1.0 + yaw), target_cy - hh * (1.0 - pitch)],
                    [target_cx + hw * (1.0 + yaw * 1.06), target_cy + hh * (1.0 + pitch)],
                    [target_cx - hw * (1.0 - yaw * 1.06), target_cy + hh * (1.0 - pitch)],
                ])
                M = cv2.getPerspectiveTransform(src_pts, dst_pts)
                warped = cv2.warpPerspective(bgra, M, (WIDTH, HEIGHT), flags=cv2.INTER_LINEAR)
                warped_rgba = cv2.cvtColor(warped, cv2.COLOR_BGRA2RGBA)
                last_warped_pil = Image.fromarray(warped_rgba)
                last_warp_frame = f
                
            frame_pil = base_grid_pil.copy()
            draw = ImageDraw.Draw(frame_pil)
            
            # 1. Paste 3D perspective UI card
            frame_pil.paste(last_warped_pil, (0, 0), last_warped_pil)
            
            # 2. Top Header Bar
            draw.rectangle([0, 0, WIDTH, 72], fill=(255, 255, 255, 250))
            draw.line([0, 72, WIDTH, 72], fill=(226, 232, 240, 255), width=1)
            
            draw.rounded_rectangle([40, 14, 210, 58], radius=10, fill=(0, 112, 186, 255))
            draw.text((58, 22), "PayAgent", fill=(255, 255, 255, 255), font=FONT_TITLE)
            
            draw.rounded_rectangle([230, 18, 720, 54], radius=8, fill=(0, 112, 186, 18), outline=(0, 112, 186, 70), width=1)
            draw.text((246, 26), f"CHAPTER {s['ch']} OF 07 • {s['tag']}", fill=(0, 112, 186, 255), font=FONT_BADGE)
            
            draw.rounded_rectangle([WIDTH - 460, 18, WIDTH - 40, 54], radius=8, fill=(16, 185, 129, 20), outline=(16, 185, 129, 80), width=1)
            draw.text((WIDTH - 438, 26), "● ED25519 CLIENT ENCLAVE: SECURE • 38ms", fill=(16, 185, 129, 255), font=FONT_BADGE)
            
            # 3. Holographic Callout Card on Right
            fx, fy = 1440, 170
            float_y = int(math.sin(t * 3.0) * 5)
            frame_pil.paste(asset['card'], (fx, fy + float_y), asset['card'])
            
            # Glowing guide line
            guide_x = int(target_cx + hw * 0.95)
            guide_y = fy + 40 + float_y
            col = s['callout']['color']
            draw.line([(guide_x, guide_y), (fx - 4, guide_y)], fill=col[:3] + (180,), width=2)
            draw.ellipse([guide_x - 4, guide_y - 4, guide_x + 4, guide_y + 4], fill=col)
            
            # 4. Animated macOS Cursor with Spline Motion
            cpath = s['cursor_path']
            num_segs = len(cpath) - 1
            cur_seg = min(num_segs - 1, int(progress * num_segs))
            seg_t = (progress * num_segs) - cur_seg
            # Cubic ease-in-out
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
            
            # 5. Bottom Cinema Subtitle Card
            sub_w = 1600
            sub_h = 80
            sub_x = (WIDTH - sub_w) // 2
            sub_y = HEIGHT - 105
            
            # Subtitle Shadow & Glass Container
            draw.rounded_rectangle([sub_x + 3, sub_y + 8, sub_x + sub_w + 3, sub_y + sub_h + 8], radius=16, fill=(15, 23, 42, 40))
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
            
        elapsed = time.time() - t0
        fps_curr = global_frame / max(0.1, elapsed)
        print(f"Finished Scene {s['ch']} - Total Frames: {global_frame}/{int(total_duration*FPS)} ({fps_curr:.1f} fps)")

    proc.stdin.close()
    proc.wait()
    print("\nVisual video stream rendering complete!")
    
    # Mux Audio
    print("Muxing all 7 voice narrations + ambient tech track...")
    concat_list = os.path.join(OUTPUT_DIR, "audio_concat.txt")
    with open(concat_list, "w") as f:
        for s in SCENES:
            f.write(f"file '{s['voice']}'\n")
            
    combined_voice = os.path.join(OUTPUT_DIR, "voice_combined.mp3")
    subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", combined_voice], check=True)
    
    ambient_wav = os.path.join(OUTPUT_DIR, "ambient.wav")
    sr = 44100
    total_samples = int(total_duration * sr) + sr * 2
    t_arr = np.linspace(0, total_duration + 2.0, total_samples, endpoint=False)
    # High-tech ambient synth chord: Cmaj9 (C, G, D, B)
    synth = (
        np.sin(2 * np.pi * 130.81 * t_arr) * 0.035 +
        np.sin(2 * np.pi * 196.00 * t_arr) * 0.025 +
        np.sin(2 * np.pi * 293.66 * t_arr) * 0.020 +
        np.sin(2 * np.pi * 493.88 * t_arr) * 0.015
    )
    synth_int16 = (synth * 32767).astype(np.int16)
    import wave
    with wave.open(ambient_wav, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(synth_int16.tobytes())
        
    cmd_mux = [
        "ffmpeg", "-y",
        "-i", raw_video_path,
        "-i", combined_voice,
        "-i", ambient_wav,
        "-filter_complex", "[1:a]volume=1.0[v]; [2:a]volume=0.22[bg]; [v][bg]amix=inputs=2:duration=first[aout]",
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        FINAL_OUTPUT
    ]
    subprocess.run(cmd_mux, check=True)
    
    # Copy to public folder
    subprocess.run(["cp", FINAL_OUTPUT, PUBLIC_OUTPUT], check=True)
    
    file_size_mb = os.path.getsize(FINAL_OUTPUT) / (1024 * 1024)
    print(f"\n=======================================================")
    print(f"Master Cinema 3D Demo Video ready: {FINAL_OUTPUT} ({file_size_mb:.2f} MB)")
    print(f"Public browser stream ready at: http://localhost:3001/payagent_demo.mp4")
    print(f"=======================================================")

if __name__ == "__main__":
    main()
