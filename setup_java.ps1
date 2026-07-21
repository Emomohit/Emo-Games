$ErrorActionPreference = "Stop"

$jdkUrl = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.11%2B10/OpenJDK21U-jdk_x64_windows_hotspot_21.0.11_10.zip"
$zipFile = "e:\Emo Games\jdk21.zip"
$extractDir = "e:\Emo Games\jdk21"

Write-Host "Downloading JDK 21..."
Invoke-WebRequest -Uri $jdkUrl -OutFile $zipFile

Write-Host "Extracting JDK 21..."
if (Test-Path $extractDir) { Remove-Item -Recurse -Force $extractDir }
New-Item -ItemType Directory -Force -Path $extractDir | Out-Null
Expand-Archive -Path $zipFile -DestinationPath $extractDir -Force

$jdkDir = Get-ChildItem -Path $extractDir -Directory | Select-Object -First 1
Write-Host "JDK extracted to: $($jdkDir.FullName)"

$env:JAVA_HOME = $jdkDir.FullName
$env:Path = "$($jdkDir.FullName)\bin;" + $env:Path

Write-Host "Starting Gradle Build..."
Set-Location "e:\Emo Games\OpenTune"
.\gradlew.bat clean assembleDebug
