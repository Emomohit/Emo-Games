$ErrorActionPreference = "Stop"

$sdkToolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
$zipFile = "e:\Android\cmdline-tools.zip"
$sdkDir = "e:\Android\Sdk"
$cmdlineDir = "$sdkDir\cmdline-tools"
$latestDir = "$cmdlineDir\latest"

if (!(Test-Path "e:\Android")) { New-Item -ItemType Directory -Force -Path "e:\Android" | Out-Null }

Write-Host "Downloading Android Command Line Tools..."
Invoke-WebRequest -Uri $sdkToolsUrl -OutFile $zipFile

Write-Host "Extracting Android Command Line Tools..."
if (Test-Path $cmdlineDir) { Remove-Item -Recurse -Force $cmdlineDir }
New-Item -ItemType Directory -Force -Path $cmdlineDir | Out-Null
Expand-Archive -Path $zipFile -DestinationPath $cmdlineDir -Force

# The zip contains a folder named "cmdline-tools", we need to rename it to "latest" inside "cmdline-tools"
Rename-Item -Path "$cmdlineDir\cmdline-tools" -NewName "latest"

$sdkmanager = "$latestDir\bin\sdkmanager.bat"

Write-Host "Accepting Licenses and Installing Packages..."
# Set ANDROID_HOME for sdkmanager
$env:ANDROID_HOME = $sdkDir

# Automatically accept licenses (echo y into sdkmanager)
cmd.exe /c "echo y| $sdkmanager --licenses"

# Install platform-tools and API 36 platform
& $sdkmanager "platform-tools" "platforms;android-36"

Write-Host "Configuring Project local.properties..."
$localProperties = "e:\Emo Games\OpenTune\local.properties"
$sdkDirEscaped = $sdkDir -replace "\\", "\\"
"sdk.dir=$sdkDirEscaped" | Out-File -FilePath $localProperties -Encoding UTF8

Write-Host "Setting JAVA_HOME and Building App..."
$env:JAVA_HOME = "e:\Emo Games\jdk21\jdk-21.0.11+10"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path

Set-Location "e:\Emo Games\OpenTune"
.\gradlew.bat assembleDebug
