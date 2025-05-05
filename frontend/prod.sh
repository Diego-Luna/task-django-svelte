#!/bin/bash
# Asegúrate de tener una clave secreta segura para producción
if [ -z "$DJANGO_SECRET_KEY" ]; then
  echo "DJANGO_SECRET_KEY no está definida. Generando una clave temporal..."
  export DJANGO_SECRET_KEY=$(openssl rand -base64 32)
fi

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d "$@"