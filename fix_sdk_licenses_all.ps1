$ErrorActionPreference = "Stop"

Write-Host "Setting up Variables..."
$env:JAVA_HOME = "e:\Emo Games\jdk21\jdk-21.0.11+10"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
$env:ANDROID_HOME = "e:\Android\Sdk"
$sdkmanager = "e:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"

Write-Host "Accepting ALL Licenses..."
1..20 | ForEach-Object { "y" } | & $sdkmanager --licenses

Write-Host "Building App..."
Set-Location "e:\Emo Games\OpenTune"
.\gradlew.bat assembleDebug
