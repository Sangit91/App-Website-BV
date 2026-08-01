$ErrorActionPreference = "Stop"
Add-Type -TypeDefinition @"
using System.Net;
using System.Security.Cryptography.X509Certificates;
public class TrustAllWs : ICertificatePolicy {
  public bool CheckValidationResult(ServicePoint sp, X509Certificate cert, WebRequest req, int prob) { return true; }
}
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllWs
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$client = New-Object Net.WebClient
$clientJs = $client.DownloadString("https://localhost:8443/@vite/client")
if ($clientJs -notmatch 'wsToken = "([^"]+)"') { Write-Output "NO_TOKEN"; exit 1 }
$token = $Matches[1]

$uri = "wss://localhost:8443/?token=$token"
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = New-Object System.Threading.CancellationTokenSource
try {
  $ws.Options.AddSubProtocol("vite-hmr")
  $ws.ConnectAsync([Uri]$uri, $ct.Token).Wait(10000)
  Write-Output "WS STATE: $($ws.State)"
  if ($ws.State -eq 'Open') {
    Write-Output "CONNECT OK via nginx 8443"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes('{"type":"ping"}')
    $seg = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
    $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct.Token).Wait(5000)
    $recv = New-Object System.ArraySegment[byte] -ArgumentList @(,(New-Object byte[] 1024))
    $res = $ws.ReceiveAsync($recv, $ct.Token)
    $res.Wait(5000)
    $msg = [System.Text.Encoding]::UTF8.GetString($recv.Array, 0, $res.Result.Count)
    Write-Output "RECEIVED: $msg"
    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "done", $ct.Token).Wait()
  }
} catch {
  Write-Output "WS ERROR: $($_.Exception.InnerException.Message)"
}
