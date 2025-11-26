# FishFlow

[![AWS](https://img.shields.io/badge/AWS-Amplify-orange)](https://aws.amazon.com/amplify/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.13+-green)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Sistema Cloud SaaS basato su AI per l'Analisi dei Flussi di Persone nelle Attività Commerciali

FishFlow è una piattaforma cloud-based progettata per analizzare i flussi di persone all'interno di ambienti commerciali, con particolare attenzione alla Grande Distribuzione Organizzata (GDO). Utilizzando tecniche di computer vision e intelligenza artificiale, il sistema elabora video di sorveglianza per fornire dati utili all'ottimizzazione degli spazi e delle strategie di vendita, garantendo il pieno rispetto della privacy degli utenti (GDPR compliant).

## 📋 Indice

- [Caratteristiche Principali](#-caratteristiche-principali)
- [Architettura del Sistema](#-architettura-del-sistema)
- [Tecnologie Utilizzate](#-tecnologie-utilizzate)
- [Prerequisiti](#-prerequisiti)
- [Installazione](#-installazione)
- [Configurazione AWS](#-configurazione-aws)
- [Utilizzo](#-utilizzo)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Funzionalità Implementate](#-funzionalità-implementate)
- [Roadmap](#-roadmap)
- [Limitazioni Conosciute](#-limitazioni-conosciute)
- [Contribuire](#-contribuire)
- [Licenza](#-licenza)
- [Contatti](#-contatti)

## ✨ Caratteristiche Principali

- **Analisi Video Intelligente**: Rilevamento automatico delle persone tramite YOLO (You Only Look Once)
- **Mappe di Calore**: Visualizzazione dei percorsi più frequentati all'interno degli ambienti
- **Privacy-First**: Analisi completamente anonima, conforme al GDPR
- **Cloud-Native**: Architettura serverless scalabile basata su AWS
- **Multi-Tenant**: Supporto per gestione di più aziende e punti vendita
- **Dashboard Intuitiva**: Interfaccia web moderna e responsive

## 🏗️ Architettura del Sistema

FishFlow è strutturato in tre livelli principali:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (React)                    │
│              AWS Amplify + TailwindCSS + TypeScript          │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                    Backend Cloud (AWS)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Cognito  │  │   S3     │  │DynamoDB  │  │ Lambda   │   │
│  │  (Auth)  │  │(Storage) │  │   (DB)   │  │(Serverless)│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│              AI Processing Module (Python)                   │
│         YOLO + OpenCV + Docker Container on ECS              │
└─────────────────────────────────────────────────────────────┘
```

### Flusso dei Dati

1. L'utente carica un video tramite il frontend
2. Il file viene salvato su Amazon S3
3. Una Lambda function registra il video in DynamoDB
4. L'utente avvia manualmente l'analisi
5. Un task ECS elabora il video con YOLO
6. I risultati (JSON, immagini annotate, heatmap) vengono salvati su S3
7. Il frontend visualizza i risultati all'utente

## 🛠️ Tecnologie Utilizzate

### Frontend
- **React 18+** - Framework UI
- **TypeScript** - Type safety e migliore developer experience
- **TailwindCSS** - Styling utility-first
- **AWS Amplify** - Deploy e integrazione con AWS

### Backend
- **AWS Amplify** - Infrastruttura gestita
- **Amazon Cognito** - Autenticazione e gestione utenti
- **Amazon S3** - Storage di video e risultati
- **Amazon DynamoDB** - Database NoSQL
- **AWS Lambda** - Funzioni serverless
- **Amazon ECS** - Orchestrazione container Docker

### AI/Computer Vision
- **Python 3.13+** - Linguaggio di sviluppo
- **YOLO (YOLOv8)** - Rilevamento persone in tempo reale
- **OpenCV** - Elaborazione video e frame
- **NumPy** - Calcoli numerici
- **Matplotlib** - Generazione visualizzazioni
- **Docker** - Containerizzazione

## 📦 Prerequisiti

- Node.js 18+ e npm/yarn
- Python 3.13+
- Account AWS con accesso a:
  - Amplify
  - Cognito
  - S3
  - DynamoDB
  - Lambda
  - ECS
- Docker Desktop (per sviluppo locale del modulo AI)
- AWS CLI configurato

## 🚀 Installazione

### 1. Clone del Repository

```bash
git clone https://github.com/smilefabri/fishflow-thesis.git
cd fishflow-thesis
```

### 2. Installazione Frontend

```bash
# Installa le dipendenze
npm install

# Configura Amplify (segui le istruzioni interattive)
npm install -g @aws-amplify/cli
amplify configure
amplify init
```

### 3. Configurazione Modulo AI

```bash
cd ai-module

# Crea ambiente virtuale Python
python -m venv venv
source venv/bin/activate  # Su Windows: venv\Scripts\activate

# Installa dipendenze
pip install -r requirements.txt

# Build del container Docker
docker build -t fishflow-ai .
```

## ⚙️ Configurazione AWS

### 1. Amplify Backend

```bash
# Deploy delle risorse AWS
amplify push
```

### 2. Cognito User Pool

Crea i gruppi utente:
- `ADMIN` - Amministratori di sistema
- `ADMIN_AZIENDA` - Amministratori aziendali
- `USERS` - Utenti standard

### 3. S3 Bucket

Struttura cartelle consigliata:
```
fishflow-bucket/
├── media/
│   └── videos/
│       └── {userId}/
│           └── video.mp4
└── results/
    └── {videoId}/
        ├── output.json
        ├── annotated_frames/
        └── heatmap.png
```

### 4. DynamoDB Tables

Le tabelle vengono create automaticamente da Amplify:
- `Collaboratori`
- `Azienda`
- `Video`
- `Analisi`

### 5. Lambda Functions

Funzioni automatiche (trigger S3):
- `on-upload-handler` - Registra nuovi video
- `on-delete-handler` - Pulizia su eliminazione

Mutazioni GraphQL:
- `create-user` - Creazione nuovi utenti
- `custom-create-analisi` - Avvio analisi video

### 6. ECS Configuration

Configura un cluster ECS con task definition per il container Python.

## 🎯 Utilizzo

### Avvio in Locale

```bash
# Frontend
npm run dev

# Modulo AI (test locale)
cd ai-module
python main.py --video path/to/video.mp4
```

### Workflow Utente

1. **Login**: Accedi con le credenziali fornite dall'amministratore
2. **Conferma Account**: Inserisci il codice OTP ricevuto via email (primo accesso)
3. **Dashboard**: Visualizza i tuoi video e analisi
4. **Carica Video**: Upload di un nuovo video di sorveglianza
5. **Avvia Analisi**: Seleziona il video e avvia l'elaborazione
6. **Visualizza Risultati**: Consulta conteggi, frame annotati e mappe di calore

### API GraphQL

Esempio di query per ottenere i video:

```graphql
query ListVideos {
  listVideos {
    items {
      id
      name
      path
      size
      collaboratoreId
      createdAt
    }
  }
}
```

Esempio di mutation per creare un'analisi:

```graphql
mutation CreateAnalisi($input: CreateAnalisiInput!) {
  customCreateAnalisi(input: $input) {
    id
    name
    status
    result
  }
}
```

## 📁 Struttura del Progetto

```
fishflow-thesis/
├── amplify/                    # Configurazione AWS Amplify
│   ├── backend/
│   ├── data/                   # Lambda functions (mutazioni)
│   └── storage/                # Lambda functions (trigger S3)
├── src/
│   ├── App.tsx                 # Entry point
│   ├── module/
│   │   ├── auth/               # Componenti autenticazione
│   │   │   ├── signIn.tsx
│   │   │   ├── signOut.tsx
│   │   │   └── confirmSignUp.tsx
│   │   └── home/               # Dashboard e componenti principali
│   └── components/             # Componenti riutilizzabili
├── ai-module/                  # Modulo Python per analisi video
│   ├── main.py
│   ├── video_processing.py
│   ├── track_model.py
│   ├── visualize_tracking.py
│   ├── requirements.txt
│   └── Dockerfile
├── public/
├── package.json
└── README.md
```

## 🎨 Funzionalità Implementate

### ✅ Completate

- [x] Autenticazione multi-tenant con Cognito
- [x] Upload video su S3
- [x] Trigger automatici Lambda su upload/delete
- [x] Analisi video con YOLO
- [x] Rilevamento persone frame-by-frame
- [x] Generazione output JSON con coordinate
- [x] Creazione frame annotati con bounding box
- [x] Generazione mappe di calore
- [x] Dashboard base per gestione video
- [x] Sistema di routing con protezione route

### 🚧 In Sviluppo

- [ ] Dashboard interattiva per visualizzazione risultati
- [ ] Grafici temporali dei flussi
- [ ] Filtri avanzati per data/punto vendita
- [ ] Export report in PDF/CSV
- [ ] Supporto multi-camera
- [ ] Elaborazione automatica su upload
- [ ] Notifiche real-time su analisi completata

## 🗺️ Roadmap

### Fase 1 - Q1 2025 (Completamento MVP)
- Completamento dashboard visualizzazione risultati
- Implementazione grafici e statistiche aggregate
- Sistema di notifiche utente

### Fase 2 - Q2 2025 (Funzionalità Avanzate)
- Analisi predittiva dei flussi
- Supporto elaborazione multi-camera
- Report personalizzabili

### Fase 3 - Q3 2025 (Ottimizzazione)
- Riduzione latenza elaborazione
- Ottimizzazione costi AWS
- Miglioramento accuratezza YOLO

### Fase 4 - Q4 2025 (Produzione)
- Testing estensivo
- Documentazione completa
- Deploy in produzione

## ⚠️ Limitazioni Conosciute

- **Demo Version**: Il sistema attuale è una versione dimostrativa funzionante
- **Elaborazione Manuale**: L'analisi deve essere avviata manualmente dall'utente
- **Single Camera**: Supporto attualmente limitato a un singolo video alla volta
- **Latenza**: I tempi di elaborazione dipendono dalla lunghezza del video
- **Costi AWS**: L'utilizzo intensivo di ECS può generare costi significativi

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. Fai fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è stato sviluppato come tesi di laurea triennale presso l'Università degli Studi di Torino.

**Autore**: Jean Roland Fabrizio Agbonson  
**Relatore**: Prof.ssa Claudia Picardi  
**Anno Accademico**: 2024/2025

## 📧 Contatti

**Jean Roland Fabrizio Agbonson**
- GitHub: [@smilefabri](https://github.com/smilefabri)
- LinkedIn: [Il tuo profilo LinkedIn]
- Email: [La tua email]

**Azienda**: Bagubits

---

## 🙏 Ringraziamenti

Questo progetto è stato realizzato durante il tirocinio curriculare presso l'azienda **Bagubits**.

Un ringraziamento particolare a:
- Prof.ssa **Claudia Picardi** per la supervisione e la guida
- Il team di **Bagubits** per l'opportunità e il supporto tecnico
- La community di **Stack Overflow** per il supporto nello sviluppo

---

⭐ Se questo progetto ti è stato utile, considera di mettere una stella su GitHub!

**Realizzato con ❤️ per migliorare l'esperienza retail attraverso l'AI**