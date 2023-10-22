$env:PRESENZE_PORT=3000
$env:DB_HOST="127.0.0.1"
$env:DB_USER="presenze"
$env:DB_PASSWORD="SalveMondo"
$env:DB_DATABASE="presenze"
node.exe .\index.js $args[0]