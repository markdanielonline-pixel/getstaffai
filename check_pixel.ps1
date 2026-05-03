Add-Type -AssemblyName System.Drawing
$f = "C:\Users\Dell Latitude\OneDrive\Desktop\Kenetix\kenetix logo2.png"
$img = [System.Drawing.Bitmap]::FromFile($f)
$cx = [math]::Floor($img.Width / 2)
$cy = [math]::Floor($img.Height / 2)
$pixel = $img.GetPixel($cx, $cy)
Write-Output "Center: R=$($pixel.R) G=$($pixel.G) B=$($pixel.B) A=$($pixel.A)"

# Let's find the first non-transparent pixel to see its color
$found = $false
for ($y=0; $y -lt $img.Height; $y+=10) {
    for ($x=0; $x -lt $img.Width; $x+=10) {
        $p = $img.GetPixel($x, $y)
        if ($p.A -gt 50) {
            Write-Output "Content Pixel at ($x, $y): R=$($p.R) G=$($p.G) B=$($p.B) A=$($p.A)"
            $found = $true
            break
        }
    }
    if ($found) { break }
}
$img.Dispose()
