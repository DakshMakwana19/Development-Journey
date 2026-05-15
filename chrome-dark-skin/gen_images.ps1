Add-Type -AssemblyName System.Drawing

$basePath = "C:\Users\daksh\.gemini\antigravity\scratch\chrome-ambient-theme\chrome-dark-skin\images"

# Frame image - needs to be larger for Chrome to accept it
# Using a gradient from dark purple-black to slightly lighter for depth
$width = 200
$height = 80
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)

# Create a subtle gradient
$topColor = [System.Drawing.Color]::FromArgb(255, 10, 10, 18)
$bottomColor = [System.Drawing.Color]::FromArgb(255, 14, 12, 24)
$rect = New-Object System.Drawing.Rectangle 0, 0, $width, $height
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $topColor, $bottomColor, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$g.FillRectangle($brush, $rect)

$g.Dispose()
$brush.Dispose()
$bmp.Save("$basePath\frame.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Created frame.png ($width x $height)"

Write-Host "Done! Theme images ready."
