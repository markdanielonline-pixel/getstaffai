Copy-Item "C:\Users\Dell Latitude\OneDrive\Desktop\StaffAi\StaffAI_Full_Website_Copy_V2_COMPLETE.docx" "staffai.zip" -Force
Expand-Archive -Path "staffai.zip" -DestinationPath "extracted_staffai" -Force
$xml = [xml](Get-Content -Path "extracted_staffai\word\document.xml" -Raw)
$ns = New-Object Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$paragraphs = $xml.SelectNodes("//w:p", $ns)
$lines = foreach ($p in $paragraphs) {
    $textNodes = $p.SelectNodes(".//w:t", $ns)
    if ($textNodes.Count -gt 0) {
        ($textNodes | ForEach-Object { $_.InnerText }) -join ""
    } else {
        ""
    }
}
$lines | Out-File -FilePath "extracted_staffai.txt" -Encoding UTF8
