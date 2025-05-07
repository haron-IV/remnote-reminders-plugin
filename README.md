# 🔔 Reminders Plugin

Straightforward RemNote plugin for reminders. Set, Edit, Delete reminders to be notified about specific things.

---

## 🧱 Project Structure

```
widgets/
├── core/                      # Core plugin logic
│   ├── component/             # Core logic components
│   ├── services/              # API calls, business logic
│   ├── settings/              # Plugin settings
│   └── utils/                 # Utilities and helpers
├── shared/                    # Shared components, settings, utils
├── UI/                        # UI layer of the plugin
└── mongo/                     # MongoDB image and config
└── redirection-page/          # A minimal page that redirects directly to a RemNote "rem"
```

---

## 🛠️ Requirements

### 📦 Install MongoDB

Follow the official MongoDB installation guide **👉 [MongoDB Installation Manual](https://www.mongodb.com/docs/manual/installation/)**

### 🐳 Install Docker

Official Docker Documentation **👉 [Docker Docs](https://docs.docker.com/get-started/)**

### 📦 Node

If you use `nvm` you can just run the command `nvm use`. It will switch to the correct version of node.

---

## 🚀 Getting Started

1️⃣ Install packages

```bash
pnpm install
```

2️⃣ Run the plugin in development mode:

```bash
cd plugin
pnpm dev
```

3️⃣ Run server in development mode

```bash
cd server
pnpm dev
```

---

## 🐳 Docker Guide

### 1️⃣ Build the Image

Create a `.env.prod` file based on `.env.template`.

> **Note:** MongoDB connection string differs for Docker:
>
> - Local: `mongodb://localhost:27017/db_name`
> - Docker: `mongodb://mongo:27017/db_name`

To build the image:

```bash
cd server
rm -rf dist
pnpm build
cd ..
docker compose --env-file .env up
# or for production:
docker compose --env-file .env.prod up
```

---

### 2️⃣ Tag the Image

```bash
docker tag <image_id> dockerhub_username/repository_name:tag
```

---

### 3️⃣ Push the Image

```bash
docker push dockerhub_username/repository_name:tag
```

---

### 4️⃣ Pull the Image on the VPS

```bash
docker pull dockerhub_username/repository_name:tag
```

### 5️⃣ Edit files and run containers

Edit the `docker-compose.vps.yml` lines in:

```yaml
server:
  image: dockerhub_username/repository_name:tag
#...
mongo:
  image: dockerhub_username/repository_name:tag
```

These 2 lines should point to your docker images.

Ensure `.env` file is present on the VPS as same as `docker-compose.yml` file, then run:

```bash
docker compose --env-file .env up -d
```

## 🌿 Branch Naming Convention

Follow this format for branch names:

`type/#issue-number/description-of-the-issue`

**Example:**

`feat/#2/add-rendering-reminders`

---

## 💽 Backup

In order to backup the db data you just have to use `scripts/backup.sh`. Basically you have to move it to your VPS. It will make a dump and copy it. If there is any error while running the script you probably have to create `backup` directory. You can also use crontab to make backups automatically.

```bash
crontab -e
# and paste it will run once per 5 minutes
*/5 * * * * /home/application/backup.sh
```

```bash
# set sudo command to be called without password
sudo visudo
# than set it (application is an user on vps)
application ALL=(ALL) NOPASSWD: /home/applicattion/backup.sh
```

Set execution rights for the script

```bash
chmod +x /home/application/backup.sh
```

## 🐛 Known Issues

- `Cmd + Z` does **not** undo deleted reminders on the server.  
  To restore a reminder, you must **manually refresh** the app or **recreate** it.

---
