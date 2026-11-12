import os
import subprocess
import time
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = "/tmp/payagent_video_frames"
os.makedirs(OUTPUT_DIR, exist_ok=True)
WIDTH, HEIGHT = 1920, 1080

def get_font(size, bold=False):
    # Try standard system truetype fonts
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/TTF/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/liberation-sans/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/liberation-sans/LiberationSans-Regular.ttf",
        "/usr/share/fonts/noto/NotoSans-Bold.ttf" if bold else "/usr/share/fonts/noto/NotoSans-Regular.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_title_slide(filename, badge, title, subtitle, details):
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(6, 9, 17))
    draw = ImageDraw.Draw(img)

    # Draw gradient mesh background simulation
    for y in range(HEIGHT):
        alpha = int(25 * (1 - y / HEIGHT))
        draw.line([(0, y), (WIDTH, y)], fill=(6 + alpha // 2, 9 + alpha, 17 + alpha * 2))

    # Decorative top bar
    draw.rectangle([(0, 0), (WIDTH, 8)], fill=(0, 112, 186))

    f_badge = get_font(26, bold=True)
    f_title = get_font(56, bold=True)
    f_sub = get_font(30, bold=False)
    f_det = get_font(24, bold=False)

    # Badge pill
    badge_text = f"  {badge}  "
    draw.rounded_rectangle([(120, 140), (740, 195)], radius=14, fill=(0, 112, 186), outline=(0, 207, 232), width=2)
    draw.text((140, 148), badge_text, font=f_badge, fill=(255, 255, 255))

    # Main Title
    draw.text((120, 240), title, font=f_title, fill=(255, 255, 255))

    # Subtitle
    draw.text((120, 330), subtitle, font=f_sub, fill=(0, 207, 232))

    # Divider line
    draw.line([(120, 400), (1800, 400)], fill=(255, 255, 255, 40), width=2)

    # Bullet Details
    y_pos = 450
    for bullet in details:
        draw.ellipse([(120, y_pos + 8), (136, y_pos + 24)], fill=(0, 112, 186), outline=(0, 207, 232))
        draw.text((160, y_pos), bullet, font=f_det, fill=(226, 232, 240))
        y_pos += 65

    # Bottom watermark
    draw.text((120, 980), "PayPal AI Hackathon 2026 • Built with PayPal Orders v2 Sandbox & AG Grid v36", font=f_det, fill=(148, 163, 184))
    img.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Created slide: {filename}")

def composite_app_slide(filename, screenshot_path, banner_title, banner_desc, highlight_pills):
    # Base canvas 1920x1080
    base = Image.new("RGB", (WIDTH, HEIGHT), color=(6, 9, 17))
    draw = ImageDraw.Draw(base)

    # Draw header bar
    draw.rectangle([(0, 0), (WIDTH, 130)], fill=(13, 19, 33))
    draw.line([(0, 130), (WIDTH, 130)], fill=(0, 112, 186), width=2)

    f_title = get_font(36, bold=True)
    f_desc = get_font(20, bold=False)
    f_pill = get_font(18, bold=True)

    draw.text((50, 25), banner_title, font=f_title, fill=(255, 255, 255))
    draw.text((50, 75), banner_desc, font=f_desc, fill=(148, 163, 184))

    # Highlight pills on the right of header
    x_pill = WIDTH - 50
    for pill in reversed(highlight_pills):
        bbox = draw.textbbox((0, 0), pill, font=f_pill)
        pill_w = (bbox[2] - bbox[0]) + 30
        x_start = x_pill - pill_w
        draw.rounded_rectangle([(x_start, 45), (x_pill, 90)], radius=12, fill=(0, 48, 135), outline=(0, 207, 232), width=1)
        draw.text((x_start + 15, 55), pill, font=f_pill, fill=(0, 207, 232))
        x_pill = x_start - 15

    # Paste screenshot into viewport
    if os.path.exists(screenshot_path):
        shot = Image.open(screenshot_path)
        # Resize shot to fit nicely with padding: 1820x900
        shot = shot.resize((1820, 900), Image.Resampling.LANCZOS)
        base.paste(shot, (50, 150))
        # Border around shot
        draw.rounded_rectangle([(48, 148), (1872, 1052)], radius=16, outline=(255, 255, 255, 60), width=2)

    base.save(os.path.join(OUTPUT_DIR, filename))
    print(f"Created composite: {filename}")

def capture_screenshots():
    shots = [
        ("canvas_light.png", "http://localhost:3001/?tab=canvas&theme=light"),
        ("canvas_dark.png", "http://localhost:3001/?tab=canvas&theme=dark"),
        ("merchant_light.png", "http://localhost:3001/?tab=merchant&theme=light"),
        ("merchant_dark.png", "http://localhost:3001/?tab=merchant&theme=dark"),
        ("api_playground.png", "http://localhost:3001/?tab=api&theme=dark"),
    ]
    for filename, url in shots:
        dest = os.path.join(OUTPUT_DIR, filename)
        if not os.path.exists(dest):
            cmd = f'firefox --headless --no-remote --profile $(mktemp -d) --screenshot {dest} --window-size=1440,900 "{url}"'
            subprocess.run(cmd, shell=True)
            time.sleep(1)

def main():
    print("Capturing live application screenshots...")
    capture_screenshots()

    print("Rendering presentation slides...")
    # 1. Intro Slide
    create_title_slide(
        "frame_01_intro.png",
        "PAYPAL AI HACKATHON 2026 SUBMISSION",
        "PayAgent Sentinel: Autonomous Agentic Commerce",
        "APCP Protocol × PayPal Orders v2 Sandbox × AG Grid Intelligence",
        [
            "Solves Safe Autonomous Spending: Cryptographic spending mandates enforce buyer budget ceilings.",
            "Multi-Agent Arbitration Engine: Automates 10% partner rebates & PayPal Green offsets.",
            "1-Click Sandbox Execution: End-to-end cryptographic intent capture via PayPal Orders v2.",
            "AG Grid Enterprise Hub: Real-time transaction streaming & 1-click PayPal Dispute Defense dossiers.",
        ]
    )

    # 2. Shopper Canvas Light Mode
    composite_app_slide(
        "frame_02_canvas_light.png",
        os.path.join(OUTPUT_DIR, "canvas_light.png"),
        "1. Shopper Agentic Canvas (Pristine Light Theme)",
        "Buyers set dynamic spending mandates ($100 max ceiling, eco-priority, auto-rebate concessions).",
        ["APCP Guardrails", "Zero-Overage", "PayPal Sandbox Ready"]
    )

    # 3. Shopper Canvas Dark Mode
    composite_app_slide(
        "frame_03_canvas_dark.png",
        os.path.join(OUTPUT_DIR, "canvas_dark.png"),
        "2. Real-Time Multi-Agent Arbitration Pipeline",
        "Shopper Agent negotiates catalog price (-10% rebate) and signs Ed25519 consent nonces.",
        ["Live Telemetry", "1-Click Capture", "PayPal / Venmo / Pay in 4"]
    )

    # 4. AG Grid Terminal Light Mode
    composite_app_slide(
        "frame_04_merchant_light.png",
        os.path.join(OUTPUT_DIR, "merchant_light.png"),
        "3. AG Grid Enterprise Intelligence Terminal",
        "High-density data grid (AG Grid v36 Quartz) with live streaming telemetry & instant CSV export.",
        ["AG Grid v36", "Sylwia Vargas Track", "Live 3.5s Stream"]
    )

    # 5. AG Grid Terminal Dark Mode & Dispute Shield
    composite_app_slide(
        "frame_05_merchant_dark.png",
        os.path.join(OUTPUT_DIR, "merchant_dark.png"),
        "4. AI Risk Audit & 1-Click PayPal Dispute Defense Dossier",
        "AI evaluates fraud vectors and generates ready-to-file legal affidavits for PayPal Resolution Center.",
        ["Zero-Dispute Shield", "Risk Scoring", "Evidence Generation"]
    )

    # 6. API Playground
    composite_app_slide(
        "frame_06_api.png",
        os.path.join(OUTPUT_DIR, "api_playground.png"),
        "5. PayPal Orders v2 Developer REST Playground",
        "Interactive sandbox testing for POST /v2/checkout/orders, capture requests, and webhook relays.",
        ["Orders v2 REST", "Idempotency Nonces", "Live Response Log"]
    )

    # 7. Architecture & Outro
    create_title_slide(
        "frame_07_outro.png",
        "COMPLETE OPEN-SOURCE DELIVERABLE",
        "PayAgent Sentinel: Ready for Hackathon Evaluation",
        "Open Source under MIT License • Complete Setup Instructions Included",
        [
            "Repository: GitHub Public Repository with clean MIT License & automated deployment.",
            "Grand Prize Alignment: Demonstrates genuine agentic autonomy powered by PayPal developer APIs.",
            "Partner Prize Alignment: Built with official AG Grid Community v36 data grid components.",
            "Submission Codebase: Tested and verified production Next.js 16.4.6 build.",
        ]
    )

    print("Encoding video with ffmpeg...")
    # Generate MP4 video where each slide stays for 8 seconds with smooth 1-second crossfades or simple concat
    # We will build a concat file:
    concat_txt = os.path.join(OUTPUT_DIR, "concat.txt")
    frames = [
        "frame_01_intro.png",
        "frame_02_canvas_light.png",
        "frame_03_canvas_dark.png",
        "frame_04_merchant_light.png",
        "frame_05_merchant_dark.png",
        "frame_06_api.png",
        "frame_07_outro.png",
    ]
    with open(concat_txt, "w") as f:
        for frame in frames:
            f.write(f"file '{frame}'\n")
            f.write("duration 10\n")
        # repeat last frame once
        f.write(f"file '{frames[-1]}'\n")

    output_video = "/home/Brathap/payagent/payagent_demo.mp4"
    ffmpeg_cmd = (
        f"ffmpeg -y -f concat -safe 0 -i {concat_txt} "
        f"-vf 'fps=25,format=yuv420p' -c:v libx264 -preset fast -crf 18 {output_video}"
    )
    subprocess.run(ffmpeg_cmd, shell=True, cwd=OUTPUT_DIR)
    if os.path.exists(output_video):
        size_mb = os.path.getsize(output_video) / (1024 * 1024)
        print(f"SUCCESS: Video generated at {output_video} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    main()
