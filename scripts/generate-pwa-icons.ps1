param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $ProjectRoot "public\nasayem-logo.png"
$outputDirectory = Join-Path $ProjectRoot "public\pwa"

if (-not (Test-Path -LiteralPath $sourcePath)) {
  throw "Official icon source not found: $sourcePath"
}

New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

function Save-ResizedIcon {
  param(
    [System.Drawing.Image]$Source,
    [int]$Size,
    [string]$OutputPath
  )

  $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($Source, 0, 0, $Size, $Size)
  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

function Save-MaskableIcon {
  param(
    [System.Drawing.Image]$Source,
    [string]$OutputPath
  )

  $size = 512
  $artworkSize = 410
  $offset = [int](($size - $artworkSize) / 2)
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml("#F7F4ED"))
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($Source, $offset, $offset, $artworkSize, $artworkSize)
  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

$source = [System.Drawing.Image]::FromFile($sourcePath)

try {
  Save-ResizedIcon -Source $source -Size 32 -OutputPath (Join-Path $outputDirectory "favicon-32.png")
  Save-ResizedIcon -Source $source -Size 180 -OutputPath (Join-Path $outputDirectory "apple-touch-icon.png")
  Save-ResizedIcon -Source $source -Size 192 -OutputPath (Join-Path $outputDirectory "icon-192.png")
  Save-ResizedIcon -Source $source -Size 512 -OutputPath (Join-Path $outputDirectory "icon-512.png")
  Save-MaskableIcon -Source $source -OutputPath (Join-Path $outputDirectory "icon-maskable-512.png")
} finally {
  $source.Dispose()
}

Write-Output "Generated official PWA icon derivatives in public\pwa"
