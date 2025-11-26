FROM python:3.13-slim-bookworm

WORKDIR /app

# Imposta variabili di ambiente per evitare buffering e migliorare logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Installa librerie di sistema necessarie per OpenCV e altro
RUN apt-get update && apt-get install -y \
    gcc \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/* && apt-get clean


# Copia e installa i requirements
COPY requirements.txt .
RUN pip install --no-cache-dir  -r requirements.txt

# Copia il codice sorgente
COPY src/ ./src/
COPY result/ ./result/
COPY main.py .


# Comando di default (modifica con l'entrypoint del tuo script)
CMD ["python", "main.py"]