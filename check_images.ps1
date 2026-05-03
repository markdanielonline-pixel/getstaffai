Add-Type -AssemblyName System.Drawing
$files = @("C:\Users\Dell Latitude\OneDrive\Desktop\Kenetix\GPT Kenetix logo.png", "C:\Users\Dell Latitude\OneDrive\Desktop\Kenetix\kenetix logo2.png")
foreach ($f in $files) {
    if (Test-Path $f) {
        $img = [System.Drawing.Bitmap]::FromFile($f)
        $pixel = $img.GetPixel(0, 0)
        Write-Output "$f - Width: $($img.Width), Height: $($img.Height), TopLeft: R=$($pixel.R) G=$($pixel.G) B=$($pixel.B) A=$($pixel.A)"
        $img.Dispose()
    }
}
