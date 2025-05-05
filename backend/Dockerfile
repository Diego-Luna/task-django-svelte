FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias
COPY requirements.txt .
COPY requirements-prod.txt .

# Instalar dependencias base
RUN pip install --no-cache-dir -r requirements.txt

# Instalar dependencias de producción condicionalmente
ARG ENVIRONMENT=development
RUN if [ "$ENVIRONMENT" = "production" ] ; then pip install --no-cache-dir -r requirements-prod.txt ; fi

# Copiar el código de la aplicación
COPY . .

# Crear un usuario no root para ejecutar la aplicación
RUN useradd -m appuser
RUN chown -R appuser:appuser /app
USER appuser

# Exponer puerto
EXPOSE 8000

# El comando será anulado por docker-compose
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# FROM python:3.13.3-bullseye

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install -r requirements.txt

# COPY . .

# EXPOSE 8000

# # Esta línea es opcional ya que docker-compose.yml especifica un comando
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]