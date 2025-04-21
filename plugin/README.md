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
