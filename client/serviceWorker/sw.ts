/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis
sw.addEventListener("install", function(event){
    console.log("Installation of service worker was successful", event)
})

sw.addEventListener("notificationclick", function(event){
    console.log("Notification Clicked!")
})

sw.addEventListener("notificationclose", function(event){
    console.log('Notification close action')
})

sw.addEventListener("push", function(event){
    const data = event.data.json()

    console.log("Push Notification received", data)

    const notificationConfig = {
        body: data?.body,
        data: {
            url: data?.url
        }
    }

    event.waitUntil(
        sw.registration.showNotification(data?.title, notificationConfig)
    )
})