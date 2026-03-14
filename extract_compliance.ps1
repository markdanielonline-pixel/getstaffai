Copy-Item "C:\Users\Dell Latitude\OneDrive\Desktop\StaffAi\Sankofa Website Compliance.docx" "compliance.zip" -Force
Expand-Archive -Path "compliance.zip" -DestinationPath "extracted_compliance" -Force
$xml = [xml](Get-Content -Path "extracted_compliance\word\document.xml" -Raw)
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
$lines | Out-File -FilePath "extracted_compliance.txt" -Encoding UTF8
