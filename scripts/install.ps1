$ErrorActionPreference = 'Stop'
$nodeDir = 'C:\Program Files\nodejs'
$env:Path = "$nodeDir;$env:Path"
& "$nodeDir\npm.cmd" install --no-fund --no-audit


