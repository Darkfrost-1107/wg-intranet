#!/bin/bash

# Activar el servicio WireGuard
echo "Configurando red de WireGuard..."


# Configuración para el usuario
elif [ "$1" == "usuario" ]; then
    echo "Configurando cliente WireGuard..."
    wg-quick up wg-client
    echo "Cliente WireGuard conectado."