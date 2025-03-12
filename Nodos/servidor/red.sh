#!/bin/bash

# Activar el servicio WireGuard
echo "Configurando red de WireGuard..."

# Configuración para el servidor
echo "Configurando servidor WireGuard..."
wg-quick up wg0
echo "Servidor WireGuard iniciado."