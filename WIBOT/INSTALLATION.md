# WIBOT - Guide d'Installation Complet

Ce guide explique comment installer WIBOT sur un nouveau poste Ubuntu/Debian.

---

## Prerequis Systeme

- **OS** : Ubuntu 20.04+ / Debian 11+
- **RAM** : 4 Go minimum (8 Go recommande)
- **Disque** : 10 Go minimum
- **Acces** : Droits sudo

---

## 1. Installation des Dependances Systeme

### 1.1 Mettre a jour le systeme

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Installer Git

```bash
sudo apt install -y git
```

### 1.3 Installer Docker

```bash
# Installer les prerequis
sudo apt install -y ca-certificates curl gnupg lsb-release

# Ajouter la cle GPG officielle Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Ajouter le repository Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Ajouter l'utilisateur au groupe docker (evite sudo)
sudo usermod -aG docker $USER

# Appliquer les changements de groupe (ou deconnectez-vous/reconnectez-vous)
newgrp docker
```

### 1.4 Verifier Docker

```bash
docker --version
docker compose version
```

### 1.5 Installer Node.js (pour le developpement frontend)

```bash
# Installer Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifier l'installation
node --version   # v20.x.x
npm --version    # 10.x.x
```

---

## 2. Cloner le Projet

```bash
cd /home/$USER/Documents
git clone https://github.com/KhoraCK/WIDIP-Global.git
cd WIDIP-Global/WIBOT
```

---

## 3. Configuration

### 3.1 Variables d'environnement (optionnel)

Creer un fichier `.env` dans `wibot-backend/` pour personnaliser :

```bash
cd wibot-backend
nano .env
```

Contenu du fichier `.env` :

```env
# PostgreSQL
POSTGRES_DB=wibot
POSTGRES_USER=widip
POSTGRES_PASSWORD=votre_mot_de_passe_securise

# n8n
N8N_HOST=localhost
N8N_PROTOCOL=http
N8N_USER=admin
N8N_PASSWORD=votre_mot_de_passe_n8n
WEBHOOK_URL=http://localhost:5679

# JWT
JWT_SECRET=votre_secret_jwt_minimum_32_caracteres

# Mistral AI (obligatoire pour le chat)
MISTRAL_API_KEY=votre_cle_api_mistral
```

> **Note** : Sans fichier `.env`, les valeurs par defaut du `docker-compose.yml` seront utilisees.

### 3.2 Obtenir une cle API Mistral

1. Aller sur [console.mistral.ai](https://console.mistral.ai)
2. Creer un compte
3. Generer une cle API
4. Ajouter la cle dans le fichier `.env`

---

## 4. Lancer les Services Backend

```bash
cd /home/$USER/Documents/WIDIP-Global/WIBOT/wibot-backend

# Lancer tous les conteneurs
docker compose up -d

# Verifier que tout fonctionne
docker ps
```

Vous devriez voir 3 conteneurs :
- `wibot-postgres` (base de donnees)
- `wibot-n8n` (API backend)
- `wibot-nginx` (serveur web)

### 4.1 Verifier les logs (si probleme)

```bash
docker logs wibot-postgres
docker logs wibot-n8n
docker logs wibot-nginx
```

---

## 5. Configuration n8n (Workflows)

### 5.1 Acceder a n8n

Ouvrir dans le navigateur : **http://localhost:5679**

Identifiants par defaut :
- **User** : admin
- **Password** : wibot_admin_2024

### 5.2 Configurer la connexion PostgreSQL

1. Aller dans **Settings** > **Credentials**
2. Cliquer **Add Credential** > **Postgres**
3. Configurer :
   - **Name** : `WIBOT PostgreSQL`
   - **Host** : `postgres`
   - **Database** : `wibot`
   - **User** : `widip`
   - **Password** : `widip_secure_password_2024` (ou votre mot de passe)
   - **Port** : `5432`
4. Cliquer **Save**

### 5.3 Importer les Workflows

Pour chaque fichier dans `wibot-backend/workflows/` :

1. Cliquer **Add workflow** > **Import from file**
2. Selectionner le fichier `.json`
3. **Activer** le workflow (toggle en haut a droite)

Fichiers a importer (dans l'ordre recommande) :
1. `auth_login.json` - Authentification
2. `get_conversations.json` - Liste conversations
3. `create_conversation.json` - Creer conversation
4. `get_messages.json` - Messages d'une conversation
5. `rename_conversation.json` - Renommer conversation
6. `delete_conversation.json` - Supprimer conversation
7. `get_user_tokens.json` - Tokens utilisateur
8. `chat_main.json` - Chat principal (IA)
9. `rag_ingestion.json` - Ingestion documents RAG
10. `analytics.json` - Statistiques admin
11. `admin_users.json` - Gestion utilisateurs admin

> **Important** : Activer TOUS les workflows apres import !

---

## 6. Build du Frontend

### 6.1 Installer les dependances

```bash
cd /home/$USER/Documents/WIDIP-Global/WIBOT/wibot-frontend
npm install
```

### 6.2 Build pour production

```bash
npm run build
```

### 6.3 Deployer sur nginx

```bash
cp -r dist/* ../wibot-backend/frontend/
```

---

## 7. Acces a l'Application

Ouvrir dans le navigateur : **http://localhost:8080**

### Compte admin par defaut

- **Username** : khora
- **Password** : test123

---

## 8. Commandes Utiles

### Gestion Docker

```bash
# Voir les conteneurs
docker ps

# Arreter tous les services
docker compose down

# Redemarrer tous les services
docker compose restart

# Voir les logs en temps reel
docker compose logs -f

# Reconstruire apres modification
docker compose up -d --build
```

### Gestion Base de Donnees

```bash
# Se connecter a PostgreSQL
docker exec -it wibot-postgres psql -U widip -d wibot

# Lister les tables
\dt

# Voir les utilisateurs
SELECT * FROM users;

# Quitter
\q
```

### Rebuild Frontend

```bash
cd /home/$USER/Documents/WIDIP-Global/WIBOT/wibot-frontend
npm run build
cp -r dist/* ../wibot-backend/frontend/
docker restart wibot-nginx
```

---

## 9. Structure du Projet

```
WIBOT/
├── wibot-backend/
│   ├── docker-compose.yml    # Configuration Docker
│   ├── init.sql              # Schema base de donnees
│   ├── nginx.conf            # Configuration Nginx
│   ├── frontend/             # Build frontend (genere)
│   ├── workflows/            # Workflows n8n
│   │   ├── auth_login.json
│   │   ├── chat_main.json
│   │   ├── analytics.json
│   │   ├── admin_users.json
│   │   └── ...
│   └── migrations/           # Scripts SQL migration
│
└── wibot-frontend/
    ├── src/
    │   ├── components/       # Composants React
    │   ├── pages/            # Pages
    │   ├── hooks/            # Hooks personnalises
    │   ├── services/         # API calls
    │   ├── store/            # State management (Zustand)
    │   └── types/            # Types TypeScript
    ├── package.json
    └── vite.config.ts
```

---

## 10. Ports Utilises

| Service    | Port  | Description              |
|------------|-------|--------------------------|
| Nginx      | 8080  | Application web          |
| n8n        | 5679  | Interface n8n            |
| PostgreSQL | 5433  | Base de donnees (expose) |

---

## 11. Depannage

### Erreur "tsc: not found"

```bash
cd wibot-frontend
npm install
```

### Erreur connexion PostgreSQL dans n8n

Verifier que le credential utilise :
- Host : `postgres` (pas localhost)
- Port : `5432` (port interne Docker)

### Les workflows ne repondent pas

1. Verifier que le workflow est **active** (toggle vert)
2. Verifier les credentials PostgreSQL
3. Regarder les logs : `docker logs wibot-n8n`

### Page blanche sur http://localhost:8080

1. Verifier que le build existe : `ls wibot-backend/frontend/`
2. Si vide, rebuild le frontend
3. Redemarrer nginx : `docker restart wibot-nginx`

### Erreur "MISTRAL_API_KEY"

Ajouter votre cle API Mistral dans le fichier `.env` ou directement dans `docker-compose.yml`

---

## 12. Mise a Jour

Pour mettre a jour WIBOT :

```bash
cd /home/$USER/Documents/WIDIP-Global

# Recuperer les dernieres modifications
git pull

# Rebuild frontend
cd WIBOT/wibot-frontend
npm install
npm run build
cp -r dist/* ../wibot-backend/frontend/

# Redemarrer les services
cd ../wibot-backend
docker compose down
docker compose up -d
```

---

## 13. Sauvegarde

### Sauvegarder la base de donnees

```bash
docker exec wibot-postgres pg_dump -U widip wibot > backup_$(date +%Y%m%d).sql
```

### Restaurer une sauvegarde

```bash
docker exec -i wibot-postgres psql -U widip -d wibot < backup_20241231.sql
```

---

## Support

En cas de probleme, verifier :
1. Les logs Docker : `docker compose logs`
2. La console navigateur (F12)
3. L'execution des workflows dans n8n

---

*Documentation generee pour WIBOT v1.0*
