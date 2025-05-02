# reminders

Simple plugin to set reminders and get notifications from Remnote.

## Usage

<!-- TODO: Describe usage -->

`pnpm run dev`

<!-- ignore-after -->

Install mongodb

[install mongodb](https://www.mongodb.com/docs/manual/installation/)

run mogno:

`brew services start mongodb-community@8.0`

stop it:

`brew services stop mongodb-community@8.0`

---

structure:

```
  widgets/
    core/         <--- core plugin logic
      component/  <--- core logic components
      services/   <--- api calls, etc.
      settings/   <--- plugin settings configuration
      utils/      <--- utilities
    shared/       <--- Shared components, settings, utils, etc.
    UI/           <--- UI layer of the plugin
    mongo/        <--- Directory for mongo db image
```

---

branch naming convention:

`type/number-name`

`feat/#2/add-rending-reminders`

index.html - this is simple html site that redirects directly to rem in the application

---

# Known issues

`cmd+z` doesn't work - it will not remove your reminder from server unless you reload the app, or update it manually.

# Docker

## 1 Build the image

Create .env.prod file from .env.template
Keep in mind that mongo has different path for docker versions so this `MONGODB_URI=mongodb://localhost:27017/db_name` would be this `mongodb://mongo:27017/db_name`

To build an image you have to go to sever and `rm -rf dist` then `pnpm build` then you can build and run a docker image via:

```bash
docker compose --env-file .env up
# or
docker compose --env-file .env.prod up
```

## 2 Tag the image

Then you have to tag your images

```
docker tag <image_id> docker_hub_username/repository_name:tagName
```

> - application_name is a repository name. There you have to have server & mongo image

## 3 Push the image

then you can push it to docker hub

```
docker push docker_hub_username/repository_name_:tag
```

## 4 Pull the image

then pull the image on the server

```
docker pull docker_hub_username/repository_name:tag-name
```

Then you can run the image on the vps, to do that use `docker.compose.vps.yml` it's modified composer file to run image and load the variables. Before you do that make sure you have env file on the vps.

Edit this line in `docker-compose.vps.yml`:

```yml
image: dockerhub_username/repository:tag
```

then you can run the image on your vps

```bash
docker compose --env-file .env up -d
```
