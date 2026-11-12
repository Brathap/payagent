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

def render_kinetic_frame(sec_idx, frame_num, total_frames, narration_text):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(6, 9, 17))
    draw = ImageDraw.Draw(img)

    # 1. Subtle animated background grid & floating neon particles
    progress = frame_num / max(total_frames, 1)
    
    # Particle constellation
    random.seed(sec_idx * 1000)
    for p_i in range(35):
        base_x = (random.random() * WIDTH + progress * 80) % WIDTH
        base_y = (random.random() * HEIGHT + progress * 40) % HEIGHT
        r = random.random() * 2 + 1
        alpha = int(120 + 80 * math.sin(progress * 6.28 + p_i))
        draw.ellipse([(base_x - r, base_y - r), (base_x + r, base_y + r)], fill=(0, 207, 232, alpha))

    # Top brand bar with glowing laser
    draw.rectangle([(0, 0), (WIDTH, 90)], fill=(13, 19, 33))
    laser_x = int((progress * (WIDTH + 400)) % (WIDTH + 400)) - 200
    draw.rectangle([(laser_x - 150, 88), (laser_x + 150, 90)], fill=(0, 207, 232))

    f_logo = get_font(28, bold=True)
    f_badge = get_font(18, bold=True)
    f_sub = get_font(18, bold=False)
    f_title = get_font(42, bold=True)
    f_card_title = get_font(24, bold=True)
    f_body = get_font(20, bold=False)
    f_caption = get_font(22, bold=False)

    # Brand Title
    draw.text((60, 26), "PayPal NOVA", font=f_logo, fill=(255, 255, 255))
    draw.rounded_rectangle([(270, 28), (385, 62)], radius=8, fill=(0, 112, 186))
    draw.text((285, 34), "AGENTIC", font=f_badge, fill=(255, 255, 255))

    draw.text((410, 34), "•  Autonomous Commerce  •  PayPal Orders v2  •  AG Grid v36", font=f_sub, fill=(148, 163, 184))

    # Live pulse badge
    draw.ellipse([(WIDTH - 220, 38), (WIDTH - 208, 50)], fill=(16, 185, 129))
    draw.text((WIDTH - 195, 34), "SANDBOX LIVE", font=f_badge, fill=(52, 211, 153))

    # 2. Main Center Content depending on section
    if sec_idx == 0:
        # Kinetic Intro Screen
        draw.text((120, 180), "PAYPAL AI HACKATHON 2026", font=get_font(24, bold=True), fill=(0, 207, 232))
        draw.text((120, 230), "PayAgent Sentinel", font=get_font(68, bold=True), fill=(255, 255, 255))
        draw.text((120, 320), "Autonomous Agentic Commerce & Enterprise AG Grid Intelligence", font=get_font(32, bold=False), fill=(148, 163, 184))
        
        # 3 Pillar feature boxes
        pillars = [
            ("APCP Protocol", "Cryptographic spending mandates that lock budget ceilings and eliminate hallucinations."),
            ("Orders v2 Capture", "Autonomous price negotiation (-10% rebate) with instant 1-click PayPal sandbox execution."),
            ("AG Grid Terminal", "Real-time streaming telemetry, fraud diagnostics, and automated legal dispute affidavits."),
        ]
        box_w = 520
        for i, (p_t, p_d) in enumerate(pillars):
            bx = 120 + i * 560
            by = 430
            glow = (0, 112, 186) if i == int(progress * 3) % 3 else (255, 255, 255, 40)
            draw.rounded_rectangle([(bx, by), (bx + box_w, by + 460)], radius=24, fill=(15, 23, 42), outline=glow, width=2)
            draw.rounded_rectangle([(bx + 25, by + 30), (bx + 85, by + 90)], radius=16, fill=(0, 112, 186))
            draw.text((bx + 40, by + 45), f"0{i+1}", font=get_font(24, bold=True), fill=(255, 255, 255))
            draw.text((bx + 25, by + 120), p_t, font=f_card_title, fill=(255, 255, 255))
            draw.text((bx + 25, by + 175), p_d, font=f_body, fill=(148, 163, 184))

    elif sec_idx == 1:
        # Shopper Canvas & Live Typing Action
        draw.text((80, 130), "1. Autonomous Shopper Canvas • Spending Mandate Enforcement", font=f_title, fill=(255, 255, 255))
        
        # Mandate Bar
        draw.rounded_rectangle([(80, 200), (1840, 310)], radius=20, fill=(15, 23, 42), outline=(0, 112, 186), width=2)
        draw.text((120, 230), "ACTIVE SPENDING MANDATE: Strict Buyer Ceiling", font=get_font(20, bold=True), fill=(255, 255, 255))
        draw.text((120, 265), "Enforced non-bypassable cap on every autonomous purchase", font=f_sub, fill=(148, 163, 184))
        
        # Budget Slider animation (sliding from $100 to $85)
        slider_val = int(100 - (progress * 15))
        draw.rounded_rectangle([(1200, 240), (1600, 270)], radius=8, fill=(30, 41, 59))
        bar_fill = int((slider_val - 30) / 220 * 400)
        draw.rounded_rectangle([(1200, 240), (1200 + bar_fill, 270)], radius=8, fill=(0, 112, 186))
        draw.ellipse([(1190 + bar_fill, 230), (1220 + bar_fill, 280)], fill=(0, 207, 232))
        draw.text((1630, 240), f"${slider_val}.00 USD", font=get_font(24, bold=True), fill=(0, 207, 232))

        # Command Bar with real typewriter effect
        draw.rounded_rectangle([(80, 340), (1840, 450)], radius=20, fill=(15, 23, 42), outline=(0, 207, 232), width=2)
        full_query = "Eco travel backpack under $70 with 10% partner rebate..."
        typed_len = min(len(full_query), int(progress * len(full_query) * 1.5))
        draw.text((120, 380), f">  {full_query[:typed_len]}", font=get_font(28, bold=True), fill=(255, 255, 255))
        # Cursor blink
        if int(frame_num / 8) % 2 == 0:
            cursor_x = 120 + draw.textlength(f">  {full_query[:typed_len]}", font=get_font(28, bold=True)) + 5
            draw.rectangle([(cursor_x, 380), (cursor_x + 3, 415)], fill=(0, 207, 232))

        # Product Staged Preview
        draw.rounded_rectangle([(80, 480), (1840, 940)], radius=24, fill=(13, 19, 33), outline=(255, 255, 255, 30), width=1)
        draw.rounded_rectangle([(120, 520), (520, 900)], radius=16, fill=(30, 41, 59))
        draw.text((170, 700), "[ 4K Product Preview ]", font=f_card_title, fill=(148, 163, 184))
        draw.text((560, 530), "AeroGlide Eco Travel Backpack 30L", font=get_font(34, bold=True), fill=(255, 255, 255))
        draw.text((560, 590), "Weatherproof recycled ocean-nylon travel pack with dedicated laptop compartment.", font=f_body, fill=(148, 163, 184))
        
        # Financial math
        draw.text((560, 670), "Catalog List Price: $68.00 USD", font=f_body, fill=(203, 213, 225))
        draw.text((560, 715), "Autonomous AI Partner Rebate: -$6.80 USD (10% Discount Applied)", font=get_font(20, bold=True), fill=(52, 211, 153))
        draw.text((560, 760), "PayPal Green Offset: +$0.50 USD", font=f_body, fill=(56, 189, 248))
        draw.text((560, 830), "Net Due: $61.70 USD  (Safely under $85 Mandate Ceiling)", font=get_font(28, bold=True), fill=(0, 207, 232))

    elif sec_idx == 2:
        # 1-Click PayPal Sandbox Checkout & Confetti Burst
        draw.text((80, 130), "2. PayPal Orders v2 Sandbox • Cryptographic Intent Capture", font=f_title, fill=(255, 255, 255))

        # APCP Cryptographic Nonce Card
        draw.rounded_rectangle([(80, 200), (920, 940)], radius=24, fill=(15, 23, 42), outline=(0, 112, 186), width=2)
        draw.text((120, 240), "APCP Nonce Attestation", font=f_card_title, fill=(255, 255, 255))
        draw.text((120, 285), "Cryptographically binding buyer consent to PayPal Orders v2", font=f_sub, fill=(148, 163, 184))
        
        steps_list = [
            "APCP Mandate Verification: PASS ($85.00 Cap)",
            "Catalog Line-Item Integrity: VERIFIED",
            "Ed25519 Intent Nonce: 0x7e4b...91aa",
            "PayPal OAuth2 Token Handshake: OK",
            "Order Status: INTENT_CAPTURE_STAGED",
        ]
        for s_i, s_t in enumerate(steps_list):
            sy = 360 + s_i * 85
            draw.rounded_rectangle([(120, sy), (880, sy + 65)], radius=14, fill=(30, 41, 59))
            draw.ellipse([(145, sy + 22), (165, sy + 42)], fill=(16, 185, 129))
            draw.text((185, sy + 20), s_t, font=f_body, fill=(241, 245, 249))

        # Checkout Action Card & Simulated Confetti
        draw.rounded_rectangle([(960, 200), (1840, 940)], radius=24, fill=(13, 19, 33), outline=(0, 207, 232), width=2)
        draw.text((1000, 240), "PayPal Smart Sandbox Stage", font=f_card_title, fill=(255, 255, 255))
        draw.text((1000, 285), "Direct capture via POST /v2/checkout/orders/{id}/capture", font=f_sub, fill=(148, 163, 184))

        # PayPal Yellow 1-Click Button
        btn_y = 360
        btn_scale = 0.96 if 0.3 < progress < 0.45 else 1.0
        draw.rounded_rectangle([(1000, btn_y), (1800, btn_y + 90)], radius=20, fill=(255, 196, 57))
        draw.text((1220, btn_y + 26), "PayPal  1-CLICK SANDBOX CHECKOUT ($61.70)", font=get_font(22, bold=True), fill=(0, 48, 135))

        # Captured Settlement Pass reveal
        if progress > 0.4:
            draw.rounded_rectangle([(1000, 490), (1800, 900)], radius=20, fill=(6, 78, 59, 120), outline=(52, 211, 153), width=2)
            draw.text((1040, 520), "✓  PAYPAL DIGITAL SETTLEMENT PASS ISSUED", font=get_font(24, bold=True), fill=(52, 211, 153))
            draw.text((1040, 575), "Order ID: PAYPAL-SBX-9941208  •  Status: CAPTURED", font=f_body, fill=(255, 255, 255))
            draw.text((1040, 625), "Settlement Amount: $61.70 USD via PayPal Balance", font=f_body, fill=(203, 213, 225))
            draw.text((1040, 675), "Cryptographic Signature Nonce: 0x7e4b...91aa", font=get_font(18, bold=True), fill=(0, 207, 232))
            draw.text((1040, 725), "PayPal Green Offset: Staged for Climate Partner Relay", font=f_body, fill=(148, 163, 184))

            # Confetti Particle Physics
            confetti_seed = 42
            random.seed(confetti_seed)
            for c_i in range(80):
                cx = 1400 + (random.random() - 0.5) * 800 * (progress - 0.4) * 2.5
                cy = 500 + (random.random() * 600) * (progress - 0.4) * 2.5 + (progress - 0.4) * 120
                c_color = random.choice([(0, 112, 186), (0, 207, 232), (16, 185, 129), (255, 196, 57)])
                draw.rectangle([(cx, cy), (cx + 12, cy + 8)], fill=c_color)

    elif sec_idx == 3:
        # AG Grid Enterprise Terminal Live Telemetry
        draw.text((80, 130), "3. AG Grid Enterprise Intelligence Terminal (AG Grid v36)", font=f_title, fill=(255, 255, 255))

        # AG Grid Stats KPI Strip
        kpis = [
            ("TOTAL SETTLED VOLUME", "$4,892.40 USD", (0, 207, 232)),
            ("ACTIVE ORDERS", "18 Captured", (255, 255, 255)),
            ("FLAGGED DISPUTE RISK", "0 Orders (0.0%)", (52, 211, 153)),
            ("STREAM STATUS", "Streaming Live (3.5s)", (56, 189, 248)),
        ]
        for ki, (kt, kv, kc) in enumerate(kpis):
            kx = 80 + ki * 440
            draw.rounded_rectangle([(kx, 200), (kx + 420, 280)], radius=16, fill=(15, 23, 42), outline=(0, 112, 186), width=1)
            draw.text((kx + 20, 215), kt, font=get_font(14, bold=True), fill=(148, 163, 184))
            draw.text((kx + 20, 242), kv, font=get_font(22, bold=True), fill=kc)

        # AG Grid Table View
        draw.rounded_rectangle([(80, 310), (1840, 940)], radius=20, fill=(11, 17, 30), outline=(0, 112, 186), width=2)
        # Header row
        draw.rectangle([(82, 312), (1838, 365)], fill=(15, 24, 43))
        cols = ["ORDER ID", "PAYPAL ORDER ID", "CUSTOMER", "ITEM DISPATCHED", "AMOUNT", "STATUS", "AI RISK"]
        col_xs = [110, 260, 520, 840, 1250, 1450, 1650]
        for ci, cname in enumerate(cols):
            draw.text((col_xs[ci], 330), cname, font=get_font(15, bold=True), fill=(148, 163, 184))

        # Table rows with newly arrived order glowing at top
        rows = [
            ("ORD-9824", "PAYPAL-SBX-9941208", "PayPal Judge (judge@paypal.dev)", "AeroGlide Eco Travel Backpack 30L", "$61.70", "COMPLETED", "12/100 (CLEAN)"),
            ("ORD-9823", "5KJ82910AA331201", "Sylwia Vargas (sylwia@ag-grid.com)", "SonicShield ANC Headphones", "$89.99", "COMPLETED", "18/100 (CLEAN)"),
            ("ORD-9822", "8PL91024BB110942", "Marcus Vance (marcus.v@acme.ai)", "PulseFlow True Wireless Earbuds", "$39.00", "COMPLETED", "14/100 (CLEAN)"),
            ("ORD-9821", "2MM48192CC449102", "Elena Rostova (elena.rostova@meta.org)", "SolCharge 20000mAh Solar Bank", "$34.00", "COMPLETED", "22/100 (CLEAN)"),
            ("ORD-9820", "9XX10294DD771923", "Trevor Phillips (suspicious@proxy.net)", "AeroGlide Eco Travel Backpack 30L", "$68.00", "FLAGGED", "74/100 (HIGH)"),
        ]
        for ri, row in enumerate(rows):
            ry = 375 + ri * 105
            is_top = (ri == 0)
            row_fill = (0, 112, 186, 60) if is_top else (15, 23, 42, 40)
            draw.rounded_rectangle([(95, ry), (1825, ry + 90)], radius=12, fill=row_fill)
            if is_top:
                draw.rounded_rectangle([(95, ry), (1825, ry + 90)], radius=12, outline=(0, 207, 232), width=2)
            
            draw.text((col_xs[0], ry + 32), row[0], font=get_font(18, bold=True), fill=(0, 207, 232) if is_top else (255, 255, 255))
            draw.text((col_xs[1], ry + 34), row[1], font=get_font(15, bold=False), fill=(203, 213, 225))
            draw.text((col_xs[2], ry + 34), row[2], font=get_font(16, bold=True), fill=(255, 255, 255))
            draw.text((col_xs[3], ry + 34), row[3], font=get_font(16, bold=False), fill=(203, 213, 225))
            draw.text((col_xs[4], ry + 32), row[4], font=get_font(20, bold=True), fill=(52, 211, 153))
            
            # Status badge
            draw.rounded_rectangle([(col_xs[5], ry + 25), (col_xs[5] + 120, ry + 65)], radius=8, fill=(6, 78, 59) if row[5] == "COMPLETED" else (159, 18, 57))
            draw.text((col_xs[5] + 15, ry + 34), row[5], font=get_font(13, bold=True), fill=(255, 255, 255))

            # Risk score badge
            draw.text((col_xs[6], ry + 34), row[6], font=get_font(16, bold=True), fill=(52, 211, 153) if "CLEAN" in row[6] else (244, 63, 94))

    elif sec_idx == 4:
        # AI PayPal Dispute Defense Dossier Generation
        draw.text((80, 130), "4. AI Fraud Audit & 1-Click PayPal Dispute Defense Dossier", font=f_title, fill=(255, 255, 255))

        # Dossier Container
        draw.rounded_rectangle([(80, 200), (1840, 940)], radius=24, fill=(13, 19, 33), outline=(0, 112, 186), width=2)
        draw.text((120, 235), "PAYPAL DISPUTE EVIDENCE & RESOLUTION DOSSIER", font=get_font(24, bold=True), fill=(0, 207, 232))
        draw.text((120, 275), "Generated by PayAgent Sentinel Autonomous Intelligence for PayPal Resolution Center", font=f_sub, fill=(148, 163, 184))

        # Code Dossier Box
        draw.rounded_rectangle([(120, 320), (1800, 900)], radius=16, fill=(5, 8, 16), outline=(255, 255, 255, 30), width=1)
        dossier_lines = [
            "CASE REFERENCE: PayPal Sandbox Dispute Pre-emption on Order PAYPAL-SBX-9941208",
            "COUNTERPARTY: judge@paypalaihackathon.dev (Verified PayPal Sandbox Account)",
            "SETTLEMENT VALUE: $61.70 USD  •  CAPTURE TIMESTAMP: 2026-11-12T13:40:00Z",
            "-----------------------------------------------------------------------------------------",
            "1. CRYPTOGRAPHIC INTENT VERIFICATION:",
            "   - Intent Protocol: PayAgent Sentinel Ed25519 Curve Nonce Match (0x7e4b...91aa)",
            "   - API Route: /v2/checkout/orders/PAYPAL-SBX-9941208/capture (HTTP 201 Created)",
            "   - Manifest: 1x AeroGlide Eco Travel Backpack 30L ($68.00 - 10% AI Rebate + $0.50 Green Offset)",
            "",
            "2. AI FRAUD ENGINE DIAGNOSTICS:",
            "   - Risk Score at Check-out: 12/100 (CLEAN - LOW RISK)",
            "   - Diagnostics: Clean device fingerprint. Continuous IP session. Validated spending mandate ceiling.",
            "",
            "3. MERCHANT AFFIDAVIT & SELLER PROTECTION ATTESTATION:",
            "   Transaction was executed via authenticated buyer consent. Staged for automated fulfillment.",
        ]
        visible_lines = min(len(dossier_lines), int(progress * len(dossier_lines) * 1.6))
        for d_i, d_l in enumerate(dossier_lines[:visible_lines]):
            f_color = (0, 207, 232) if "1." in d_l or "2." in d_l or "3." in d_l or "CASE" in d_l else (203, 213, 225)
            draw.text((150, 350 + d_i * 38), d_l, font=get_font(18, bold=False), fill=f_color)

    elif sec_idx == 5:
        # Outro & Evaluation Summary
        draw.text((120, 180), "OFFICIAL HACKATHON DELIVERABLE", font=get_font(24, bold=True), fill=(0, 207, 232))
        draw.text((120, 230), "PayAgent Sentinel", font=get_font(68, bold=True), fill=(255, 255, 255))
        draw.text((120, 320), "Built with PayPal Developer Platform & AG Grid Community SDK", font=get_font(32, bold=False), fill=(148, 163, 184))

        summary_boxes = [
            ("PayPal Integration", "Meaningfully integrates PayPal Orders v2 Sandbox with create, capture, nonces, and webhooks."),
            ("AI Behind the Wheel", "Multi-agent price negotiation, cryptographic spending mandates, and dispute evidence generation."),
            ("AG Grid Category Prize", "High-density AG Grid v36 table with live order streaming, sorting, and CSV export."),
            ("Open Source & Verified", "Public GitHub repository with MIT License visible in repo root. Ready for judges."),
        ]
        for s_i, (s_t, s_d) in enumerate(summary_boxes):
            bx = 120 + (s_i % 2) * 840
            by = 420 + (s_i // 2) * 230
            draw.rounded_rectangle([(bx, by), (bx + 800, by + 190)], radius=20, fill=(15, 23, 42), outline=(0, 112, 186), width=2)
            draw.text((bx + 35, by + 30), f"✓  {s_t}", font=get_font(24, bold=True), fill=(0, 207, 232))
            draw.text((bx + 35, by + 75), s_d, font=f_body, fill=(203, 213, 225))

    # 3. Synchronized Lower-Third Captions Bar
    draw.rounded_rectangle([(140, 975), (1780, 1045)], radius=14, fill=(15, 23, 42), outline=(0, 207, 232), width=1)
    draw.text((170, 995), f"🎙  {narration_text}", font=f_caption, fill=(241, 245, 249))

    return img

def main():
    print("=== Step 1: Generating Neural Studio Voiceovers ===")
    story_durations = []
    voice_files = []
    for idx, item in enumerate(STORY):
        v_file, dur = generate_voice(idx, item["narration"])
        # Add 0.8s tail
        t_dur = dur + 0.8
        voice_files.append(v_file)
        story_durations.append(t_dur)
        print(f"  Scene {idx+1}: {t_dur:.2f}s ({item['id']})")

    total_time = sum(story_durations)
    print(f"Total video duration will be: {total_time:.1f}s (~{total_time/60:.1f} mins)")

    print("\n=== Step 2: Generating Ambient High-Tech Music Track ===")
    ambient_wav = os.path.join(ASSETS_DIR, "ambient.wav")
    generate_ambient_music(int(total_time) + 4, ambient_wav)

    print("\n=== Step 3: Rendering Animated Kinetic Frames & Encoding Video Clips ===")
    clip_files = []
    for s_idx, s_item in enumerate(STORY):
        dur = story_durations[s_idx]
        total_frames = int(dur * FPS)
        s_frames_dir = os.path.join(ASSETS_DIR, f"frames_scene_{s_idx}")
        os.makedirs(s_frames_dir, exist_ok=True)
        
        print(f"Rendering Scene {s_idx+1}/{len(STORY)} ({total_frames} frames)...")
        for f_num in range(total_frames):
            frame_img = render_kinetic_frame(s_idx, f_num, total_frames, s_item["narration"])
            frame_img.save(os.path.join(s_frames_dir, f"frame_{f_num:05d}.png"))

        clip_mp4 = os.path.join(ASSETS_DIR, f"clip_{s_idx:02d}.mp4")
        # Encode scene clip with voice track
        ffmpeg_clip_cmd = [
            "ffmpeg", "-y",
            "-framerate", str(FPS),
            "-i", os.path.join(s_frames_dir, "frame_%05d.png"),
            "-i", voice_files[s_idx],
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            "-t", str(dur),
            clip_mp4
        ]
        subprocess.run(ffmpeg_clip_cmd, check=True)
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
    # Mix ambient audio lightly (-20dB) under the master video
    mix_cmd = (
        f"ffmpeg -y -i {unmixed_video} -i {ambient_wav} "
        f"-filter_complex \"[0:a][1:a]amix=inputs=2:duration=first:weights=1 0.15[a]\" "
        f"-map 0:v -map \"[a]\" -c:v copy -c:a aac -b:a 192k {master_final}"
    )
    subprocess.run(mix_cmd, shell=True, check=True)

    # Copy to public folder for direct browser streaming
    subprocess.run(f"cp {master_final} /home/Brathap/payagent/public/payagent_demo.mp4", shell=True)
    
    print("\n=======================================================")
    print(f"KINETIC DEMO VIDEO SUCCEEDED!")
    print(f"Saved at: {master_final}")
    print(f"Available at: http://localhost:3001/payagent_demo.mp4")
    print("=======================================================")

if __name__ == "__main__":
    main()
