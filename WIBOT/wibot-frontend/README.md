# WIBOT - Frontend

Interface web React pour le chatbot d'entreprise WIDIP.

## Stack Technique

- **Framework** : React 18 + TypeScript
- **Build** : Vite
- **Styling** : Tailwind CSS
- **State** : Zustand
- **Routing** : React Router v6
- **HTTP** : Axios
- **Markdown** : react-markdown + remark-gfm
- **Code Highlighting** : react-syntax-highlighter
- **Icons** : Lucide React
- **Upload** : react-dropzone

## Installation

```bash
# Cloner le projet
cd wibot-frontend

# Installer les dependances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement dans .env
```

## Developpement

```bash
# Lancer le serveur de developpement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Build Production

```bash
# Generer le build de production
npm run build

# Previsualiser le build
npm run preview
```

## Configuration

Variables d'environnement (`.env`) :

| Variable | Description | Defaut |
|----------|-------------|--------|
| `VITE_API_URL` | URL du backend n8n | `http://localhost:5678` |
| `VITE_MAX_FILE_SIZE` | Taille max fichiers (bytes) | `10485760` (10MB) |
| `VITE_APP_NAME` | Nom de l'application | `WIBOT` |

## Structure du Projet

```
src/
  main.tsx            # Point d'entree
  App.tsx             # Composant racine + routing
  pages/              # Pages (Login, Chat)
  components/
    layout/           # Header, Sidebar, InputBar
    chat/             # ChatWindow, Message, CodeBlock
    upload/           # FileDropzone, FilePreview
    ui/               # Button, Input, Spinner
  services/           # API, Auth
  hooks/              # useAuth, useChat, useConversations
  store/              # Zustand store
  types/              # TypeScript types
  styles/             # CSS global
```
