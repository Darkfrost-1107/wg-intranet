
#!/bin/bash

# Activar el servicio WireGuard
echo "Configurando red de WireGuard..."
# Configuración para el repetidor
elif [ "$1" == "repetidor" ]; then
    echo "Configurando repetidor WireGuard..."
    wg-quick up wg-repeater
    echo "Repetidor WireGuard conectado."