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


```

---

branch names:

`type/number-name`

`feat/#2/add-rending-reminders`

index.html - this is simple html site that redirects directly to rem in the application

---

# Functionalities

- add reminder to single rem
- add reminder to selected rems
- removing selected rems also removes reminders
- Get notifications through telegram messages
- Open Remnote app on desired rem when clicking on the notification

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
docker pull <image_id> docker_hub_username/application_name:v1.0
```

Then TBD... **another composer file for server**
