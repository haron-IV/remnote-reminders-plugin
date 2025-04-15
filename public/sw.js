// Notification.requestPermission().then(function (permission) {
//   if (permission === 'granted') {
//     console.log('Notification permission granted.')
//   } else {
//     console.log('Unable to get permission to notify.')
//   }
// })



// navigator.serviceWorker.ready.then(function (registration) {
//   registration.pushManager
//     .subscribe({ userVisibleOnly: true })
//     .then(function (subscription) {
//       console.log('Subscribed for push:', subscription.endpoint)
//     })
//     .catch(function (error) {
//       console.log('Subscription failed:', error)
//     })
// })

// self.addEventListener('push', function (event) {
//   const title = 'New Message'
//   const options = {
//     body: 'Hello, world!',
//   }
//   event.waitUntil(self.registration.showNotification(title, options))
// })