# ============================================================
#  Spotify Starry Night Theme + Ad Blocker Setup Script
#  Uses: Spicetify CLI (https://spicetify.app)
# ============================================================
#
#  PREREQUISITES:
#    - Spotify Desktop App installed (NOT the Microsoft Store version)
#    - If you have the Store version, uninstall it and install from https://www.spotify.com/download
#    - Run this script in PowerShell as your normal user (NOT as Admin)
#
#  USAGE:
#    Right-click this file -> "Run with PowerShell"
#    OR open PowerShell and run:  .\spotify-starrynight.ps1
#
# ============================================================

# --- Helper Functions ---
function Write-Step {
    param([string]$Message)
    Write-Host "`n★  $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓  $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "⚠  $Message" -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Message)
    Write-Host "✗  $Message" -ForegroundColor Red
}

# --- Banner ---
Write-Host @"

    ╔══════════════════════════════════════════════════╗
    ║       ✦  Spotify Starry Night Installer  ✦      ║
    ║         Theme + Ad Blocker via Spicetify         ║
    ╚══════════════════════════════════════════════════╝

"@ -ForegroundColor Magenta

# ============================================================
# STEP 1: Close Spotify if running
# ============================================================
Write-Step "Closing Spotify if it's running..."
$spotifyProcess = Get-Process -Name "Spotify" -ErrorAction SilentlyContinue
if ($spotifyProcess) {
    Stop-Process -Name "Spotify" -Force
    Start-Sleep -Seconds 2
    Write-Success "Spotify closed."
} else {
    Write-Success "Spotify is not running."
}

# ============================================================
# STEP 2: Install Spicetify CLI
# ============================================================
Write-Step "Installing Spicetify CLI..."

$spicetifyCmd = Get-Command spicetify -ErrorAction SilentlyContinue
if ($spicetifyCmd) {
    Write-Success "Spicetify is already installed at: $($spicetifyCmd.Source)"
    Write-Host "   Updating to latest version..." -ForegroundColor Gray
    Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/spicetify/cli/main/install.ps1" | Invoke-Expression
} else {
    Write-Host "   Downloading and installing Spicetify..." -ForegroundColor Gray
    Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/spicetify/cli/main/install.ps1" | Invoke-Expression
}

# Refresh PATH so spicetify is available
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "User") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "Machine")

# Verify installation
$spicetifyCmd = Get-Command spicetify -ErrorAction SilentlyContinue
if (-not $spicetifyCmd) {
    $spicetifyPath = "$env:LOCALAPPDATA\spicetify"
    if (Test-Path "$spicetifyPath\spicetify.exe") {
        $env:Path += ";$spicetifyPath"
    } else {
        Write-Err "Spicetify installation failed. Please try manually:"
        Write-Host '   Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/spicetify/cli/main/install.ps1" | Invoke-Expression'
        exit 1
    }
}

Write-Success "Spicetify CLI is ready."

# ============================================================
# STEP 3: Initial Spicetify backup
# ============================================================
Write-Step "Creating Spicetify backup of Spotify..."
spicetify backup apply 2>$null
Write-Success "Backup complete."

# ============================================================
# STEP 4: Install Spicetify Marketplace (for themes & extensions)
# ============================================================
Write-Step "Installing Spicetify Marketplace..."
Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/spicetify/marketplace/main/resources/install.ps1" | Invoke-Expression
Write-Success "Marketplace installed."

# ============================================================
# STEP 5: Create the Starry Night custom theme
# ============================================================
Write-Step "Creating Starry Night theme..."

$themesDir = "$env:LOCALAPPDATA\spicetify\Themes"
$themeDir  = "$themesDir\StarryNight"

# Create theme directory
if (-not (Test-Path $themeDir)) {
    New-Item -Path $themeDir -ItemType Directory -Force | Out-Null
}

# --- color.ini ---
$colorIni = @"
[Base]
; ── Starry Night Palette ──
; Inspired by Van Gogh's "The Starry Night"
; Deep midnight blues, swirling gold/amber, and soft starlight

text                = F0E6D3
subtext             = B8A99A
main                = 0A0E1A
sidebar             = 070B15
player              = 0D1225
card                = 141B33
shadow              = 000000
selected-row        = 1A2340
button              = C9A227
button-active       = E8C547
button-disabled     = 3A3F5C
tab-active          = C9A227
notification        = 1E3A5F
notification-error  = 8B2252
misc                = 6B8EBF

; ── Additional UI Colors ──
play-button                = C9A227
play-button-active         = E8C547
progress-fg                = C9A227
progress-bg                = 1A2340
heart                      = E8C547
pagelink-active            = C9A227
radio-btn-active           = C9A227
sidebar-indicator          = C9A227

[Dark]
; ── Deeper variant for OLED/dark preference ──
text                = E8DCC8
subtext             = 9A8B7C
main                = 05080F
sidebar             = 030610
player              = 080C1A
card                = 0F1528
shadow              = 000000
selected-row        = 151D38
button              = B8912A
button-active       = D4A83E
button-disabled     = 2E3350
tab-active          = B8912A
notification        = 162F4E
notification-error  = 7A1E48
misc                = 5A7DAE
play-button                = B8912A
play-button-active         = D4A83E
progress-fg                = B8912A
progress-bg                = 151D38
heart                      = D4A83E
pagelink-active            = B8912A
radio-btn-active           = B8912A
sidebar-indicator          = B8912A
"@

Set-Content -Path "$themeDir\color.ini" -Value $colorIni -Encoding UTF8
Write-Success "color.ini created."

# --- user.css ---
$userCss = @"
/* ============================================================
   ✦ STARRY NIGHT THEME for Spotify (Spicetify) ✦
   Inspired by Vincent van Gogh's "The Starry Night" (1889)
   ============================================================ */

/* ── Google Font ── */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap');

/* ── Root Variables ── */
:root {
  --starry-gold:       #C9A227;
  --starry-gold-light: #E8C547;
  --starry-blue-deep:  #0A0E1A;
  --starry-blue-mid:   #1E3A5F;
  --starry-blue-soft:  #6B8EBF;
  --starry-cream:      #F0E6D3;
  --starry-swirl:      #2A4A7F;
  --starry-cyan:       #4A8BA8;
  --font-display:      'Cormorant Garamond', Georgia, serif;
  --font-body:         'Inter', -apple-system, sans-serif;
}

/* ── Base Typography ── */
body {
  font-family: var(--font-body) !important;
}

/* ── Starry Background on Main View ── */
.Root__main-view {
  background:
    radial-gradient(ellipse 1200px 800px at 20% 30%, rgba(42,74,127,0.25), transparent),
    radial-gradient(ellipse 800px 600px at 80% 60%, rgba(30,58,95,0.2), transparent),
    radial-gradient(ellipse 400px 400px at 50% 20%, rgba(74,139,168,0.1), transparent),
    var(--spice-main) !important;
}

/* ── Twinkling Stars Animation ── */
.Root__main-view::before {
  content: '';
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(1px 1px at 10% 15%, rgba(240,230,211,0.7), transparent),
    radial-gradient(1.5px 1.5px at 25% 35%, rgba(232,197,71,0.5), transparent),
    radial-gradient(1px 1px at 40% 10%, rgba(240,230,211,0.6), transparent),
    radial-gradient(2px 2px at 55% 55%, rgba(232,197,71,0.4), transparent),
    radial-gradient(1px 1px at 70% 25%, rgba(240,230,211,0.8), transparent),
    radial-gradient(1.5px 1.5px at 85% 45%, rgba(201,162,39,0.5), transparent),
    radial-gradient(1px 1px at 15% 70%, rgba(240,230,211,0.5), transparent),
    radial-gradient(1px 1px at 30% 85%, rgba(232,197,71,0.4), transparent),
    radial-gradient(2px 2px at 60% 80%, rgba(240,230,211,0.6), transparent),
    radial-gradient(1px 1px at 90% 75%, rgba(201,162,39,0.7), transparent),
    radial-gradient(1px 1px at 5% 50%, rgba(240,230,211,0.5), transparent),
    radial-gradient(1.5px 1.5px at 45% 42%, rgba(232,197,71,0.3), transparent),
    radial-gradient(1px 1px at 75% 65%, rgba(240,230,211,0.6), transparent),
    radial-gradient(1px 1px at 95% 20%, rgba(201,162,39,0.5), transparent),
    radial-gradient(1px 1px at 50% 90%, rgba(240,230,211,0.4), transparent);
  animation: starTwinkle 6s ease-in-out infinite alternate;
}

@keyframes starTwinkle {
  0%   { opacity: 0.6; }
  50%  { opacity: 1.0; }
  100% { opacity: 0.7; }
}

/* ── Swirling Moon Glow (top-right corner) ── */
.Root__main-view::after {
  content: '';
  position: fixed;
  top: -60px; right: -60px;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(232,197,71,0.25) 0%,
    rgba(201,162,39,0.15) 30%,
    rgba(30,58,95,0.05) 60%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
  animation: moonPulse 8s ease-in-out infinite;
}

@keyframes moonPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50%      { transform: scale(1.15); opacity: 1; }
}

/* ── Sidebar Styling ── */
.Root__nav-bar {
  background: linear-gradient(
    180deg,
    rgba(7,11,21,0.97) 0%,
    rgba(10,14,26,0.99) 100%
  ) !important;
  border-right: 1px solid rgba(201,162,39,0.15) !important;
}

/* ── Now Playing Bar ── */
.Root__now-playing-bar {
  background: linear-gradient(
    90deg,
    rgba(13,18,37,0.98) 0%,
    rgba(20,27,51,0.95) 50%,
    rgba(13,18,37,0.98) 100%
  ) !important;
  border-top: 1px solid rgba(201,162,39,0.2) !important;
  backdrop-filter: blur(20px);
}

/* ── Track Title ── */
.Root__now-playing-bar a[data-testid="context-item-link"] {
  font-family: var(--font-display) !important;
  font-weight: 600 !important;
  font-size: 1.05em !important;
  letter-spacing: 0.3px;
}

/* ── Cards (Playlists, Albums) ── */
.Card,
.encore-card {
  background: rgba(20,27,51,0.6) !important;
  border: 1px solid rgba(201,162,39,0.08) !important;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  overflow: hidden;
}

.Card:hover,
.encore-card:hover {
  background: rgba(26,35,64,0.8) !important;
  border-color: rgba(201,162,39,0.25) !important;
  transform: translateY(-4px) !important;
  box-shadow:
    0 8px 25px rgba(0,0,0,0.4),
    0 0 15px rgba(201,162,39,0.1) !important;
}

/* ── Play Button ── */
.encore-button--supersize,
button[data-testid="play-button"] {
  background: linear-gradient(135deg, var(--starry-gold), var(--starry-gold-light)) !important;
  box-shadow: 0 4px 15px rgba(201,162,39,0.3) !important;
  transition: all 0.25s ease !important;
}

.encore-button--supersize:hover,
button[data-testid="play-button"]:hover {
  transform: scale(1.08) !important;
  box-shadow: 0 6px 20px rgba(201,162,39,0.5) !important;
}

/* ── Progress Bar ── */
.playback-bar .progress-bar__fg {
  background: linear-gradient(90deg, var(--starry-gold), var(--starry-gold-light)) !important;
}

.playback-bar .progress-bar {
  background: rgba(26,35,64,0.6) !important;
  border-radius: 4px !important;
}

/* ── Scrollbar ── */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(10,14,26,0.5);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--starry-swirl), var(--starry-blue-mid));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--starry-blue-mid), var(--starry-gold));
}

/* ── Section Headings ── */
.main-shelf-title,
h2, h1 {
  font-family: var(--font-display) !important;
  letter-spacing: 0.5px !important;
}

/* ── Search Input ── */
input[role="searchbox"] {
  background: rgba(20,27,51,0.7) !important;
  border: 1px solid rgba(201,162,39,0.15) !important;
  border-radius: 20px !important;
  color: var(--starry-cream) !important;
  transition: border-color 0.3s ease !important;
}

input[role="searchbox"]:focus {
  border-color: rgba(201,162,39,0.5) !important;
  box-shadow: 0 0 12px rgba(201,162,39,0.15) !important;
}

/* ── Track List Rows ── */
.main-trackList-trackListRow:hover {
  background: rgba(42,74,127,0.15) !important;
}

.main-trackList-trackListRow[aria-selected="true"] {
  background: rgba(201,162,39,0.08) !important;
}

/* ── Navigation Back/Forward Buttons ── */
.main-topBar-button {
  background: rgba(20,27,51,0.6) !important;
  border: 1px solid rgba(201,162,39,0.1) !important;
  transition: all 0.2s ease !important;
}

.main-topBar-button:hover {
  background: rgba(42,74,127,0.3) !important;
  border-color: rgba(201,162,39,0.3) !important;
}

/* ── Liked Songs Heart ── */
button[data-testid="add-button"] svg,
.control-button-heart svg {
  transition: all 0.3s ease !important;
}

button[data-testid="add-button"]:hover svg,
.control-button-heart:hover svg {
  filter: drop-shadow(0 0 6px rgba(232,197,71,0.6)) !important;
}

/* ── Top Bar Gradient ── */
.main-topBar-background {
  background: linear-gradient(
    180deg,
    rgba(10,14,26,0.95) 0%,
    transparent 100%
  ) !important;
}

/* ── Context Menus ── */
.main-contextMenu-menu {
  background: rgba(15,21,40,0.95) !important;
  border: 1px solid rgba(201,162,39,0.12) !important;
  border-radius: 10px !important;
  backdrop-filter: blur(20px) !important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
}

.main-contextMenu-menuItem:hover {
  background: rgba(42,74,127,0.25) !important;
}

/* ── Tooltips ── */
[data-tippy-root] .tippy-box {
  background: rgba(15,21,40,0.95) !important;
  border: 1px solid rgba(201,162,39,0.15) !important;
  border-radius: 8px !important;
}

/* ── Lyrics Page ── */
.lyrics-lyrics-contentWrapper {
  background: transparent !important;
}

.lyrics-lyricsContent-lyric {
  font-family: var(--font-display) !important;
  font-weight: 400 !important;
  font-size: 1.1em !important;
}

/* ── Friend Activity ── */
.Root__right-sidebar {
  background: rgba(7,11,21,0.95) !important;
  border-left: 1px solid rgba(201,162,39,0.1) !important;
}

/* ── Ensure content sits above star background ── */
.Root__main-view > * {
  position: relative;
  z-index: 1;
}
"@

Set-Content -Path "$themeDir\user.css" -Value $userCss -Encoding UTF8
Write-Success "user.css created with Starry Night styles."

# ============================================================
# STEP 6: Apply the Starry Night theme via Spicetify
# ============================================================
Write-Step "Applying Starry Night theme..."

spicetify config current_theme StarryNight
spicetify config color_scheme Base
Write-Success "Theme set to StarryNight."

# ============================================================
# STEP 7: Install adblock extension
# ============================================================
Write-Step "Setting up ad blocker..."

# Use the built-in Spicetify adblock extension
$extensionsDir = "$env:LOCALAPPDATA\spicetify\Extensions"
if (-not (Test-Path $extensionsDir)) {
    New-Item -Path $extensionsDir -ItemType Directory -Force | Out-Null
}

# Create the adblock extension
$adblockJs = @"
// Spicetify Ad Blocker Extension
// Blocks audio ads, video ads, banner ads, and upgrade prompts

(function SpicetifyAdBlock() {
    if (!Spicetify.Player || !Spicetify.Platform) {
        setTimeout(SpicetifyAdBlock, 300);
        return;
    }

    // --- Block Audio/Video Ads ---
    const originalPlay = Spicetify.Player.play;
    
    // Monitor playback state for ad detection
    Spicetify.Player.addEventListener("songchange", () => {
        const data = Spicetify.Player.data;
        if (!data) return;
        
        // Check if current track is an ad
        const isAd = (
            data.track?.metadata?.is_advertisement === "true" ||
            data.track?.metadata?.["commerce.type"] ||
            data.track?.provider === "ad" ||
            data.track?.uri?.includes("spotify:ad:")
        );

        if (isAd) {
            // Skip the ad immediately
            Spicetify.Player.next();
            console.log("[StarryNight AdBlock] Audio ad skipped.");
        }
    });

    // --- Remove Banner / Visual Ads from DOM ---
    function removeBannerAds() {
        const adSelectors = [
            '.main-leaderboardComponent-container',
            '.sponsor-container',
            'aside[aria-label*="Advertisement"]',
            'div[data-testid="ad-slot"]',
            '.desktoproutes-homepage-takeover',
            'a[href*="premium"]',
            '.upgrade-button',
            '[class*="UpgradeButton"]',
            'button[data-testid="upgrade-button"]',
            '.main-topBar-UpgradeButton',
        ];

        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });
    }

    // Run DOM cleanup periodically
    const observer = new MutationObserver(removeBannerAds);
    observer.observe(document.body, { childList: true, subtree: true });
    removeBannerAds();

    // --- Mute ads that slip through ---
    let savedVolume = null;
    Spicetify.Player.addEventListener("onplaypause", () => {
        const data = Spicetify.Player.data;
        if (!data) return;

        const isAd = (
            data.track?.metadata?.is_advertisement === "true" ||
            data.track?.provider === "ad"
        );

        if (isAd && savedVolume === null) {
            savedVolume = Spicetify.Player.getVolume();
            Spicetify.Player.setVolume(0);
            console.log("[StarryNight AdBlock] Ad muted.");
        } else if (!isAd && savedVolume !== null) {
            Spicetify.Player.setVolume(savedVolume);
            savedVolume = null;
            console.log("[StarryNight AdBlock] Volume restored.");
        }
    });

    console.log("[StarryNight AdBlock] ✦ Ad blocker active.");
})();
"@

Set-Content -Path "$extensionsDir\starryNightAdblock.js" -Value $adblockJs -Encoding UTF8
Write-Success "Ad blocker extension created."

# Enable the extension
spicetify config extensions starryNightAdblock.js
Write-Success "Ad blocker extension enabled."

# ============================================================
# STEP 8: Apply all changes
# ============================================================
Write-Step "Applying all changes to Spotify..."

spicetify apply

if ($LASTEXITCODE -eq 0) {
    Write-Success "All changes applied successfully!"
} else {
    Write-Warn "Apply returned a non-zero exit code. Trying with backup restore..."
    spicetify backup apply
}

# ============================================================
# DONE
# ============================================================
Write-Host @"

    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║    ✦  Starry Night Theme Applied!  ✦            ║
    ║                                                  ║
    ║    Your Spotify now features:                    ║
    ║    • Deep midnight blue backgrounds              ║
    ║    • Golden amber accents (Van Gogh palette)     ║
    ║    • Twinkling star animations                   ║
    ║    • Glowing moon effect                         ║
    ║    • Elegant serif typography                    ║
    ║    • Ad blocker (audio + visual)                 ║
    ║                                                  ║
    ║    Spotify will restart automatically.            ║
    ║                                                  ║
    ║    COMMANDS TO REMEMBER:                         ║
    ║    • spicetify apply   (re-apply after updates)  ║
    ║    • spicetify restore (undo all changes)        ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝

"@ -ForegroundColor Magenta

# Launch Spotify
Write-Step "Launching Spotify..."
Start-Process "$env:APPDATA\Spotify\Spotify.exe" -ErrorAction SilentlyContinue
Write-Success "Enjoy your Starry Night Spotify! ✦"
