// Service worker de l'administration : mode hors-ligne minimal + notifications de nouvelles demandes.
const CACHE = "sta-admin-v1"
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.add("/admin/")).then(() => self.skipWaiting())) })
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())) })
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url)
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api/") || !(u.pathname.startsWith("/admin") || u.pathname.startsWith("/assets/"))) return
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return r }).catch(() => caches.match(e.request).then((r) => r || caches.match("/admin/"))))
})
const LABEL = { devis: "Devis", partenariat: "Partenariat", contact: "Contact", produit: "Liste d'attente" }
self.addEventListener("push", (e) => {
  e.waitUntil((async () => {
    let title = "Nouvelle demande", body = "Ouvrez le tableau de bord."
    try {
      const r = await fetch("/api/admin.php?a=latest", { credentials: "include", headers: { "X-STA": "1" } })
      if (r.ok) { const j = await r.json(); if (j.last) { title = (LABEL[j.last.type] || "Demande") + " · " + j.last.name; body = j.new > 1 ? j.new + " demandes en attente" : "Nouvelle demande reçue" } }
    } catch (_) { /* notification générique */ }
    await self.registration.showNotification(title, { body, icon: "/admin/icon-192.png", badge: "/admin/icon-192.png", tag: "sta-request", renotify: true, data: { url: "/admin/#/demandes" } })
  })())
})
self.addEventListener("notificationclick", (e) => {
  e.notification.close()
  const url = (e.notification.data && e.notification.data.url) || "/admin/"
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) if (c.url.includes("/admin")) { c.focus(); return "navigate" in c ? c.navigate(url) : null }
    return self.clients.openWindow(url)
  }))
})
