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

# Known issues

`cmd+z` doesn't work - it will not remove your reminder from server unless you reload the app, or update it manually.

# TODO

- [x] Update manifest
- [ ] Add suppoert for AM/PM hours
- [ ] remove todos
- [ ] check licenses
- [x] `src/widget` move commands outside -> look at documentation
- [x] change the name of the directory `pwa`
- [ ] add typescipt for server side
- [ ] remove `local-notes.md` afterwards
- [ ] `core/services` add dev / prod variables for urls
- [ ] text is not updated
- [ ] deleted in selection not working | there is no date / time as well sometimes
- [x] removing only rem tag should remove reminder
- [ ] refactorize path `./index` export items
- [x] when opening powerup and remove selected items from the list it will not remove items properly
- [ ] ASK: comments - ask about them in the mr

---

Current work

- [ ] handle delete then ctrl - z
