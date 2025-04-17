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

index.html - this is simple html site that redirects directly to rem in the application

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