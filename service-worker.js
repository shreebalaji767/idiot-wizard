const CACHE="iw-v6";
const PRECACHE=[
  "./",
  "./index.html",
  "./learn.html",
  "./practical.html",
  "./deep.html",
  "./deep-learning.html",
  "./manifest.json",
  "./service-worker.js",
  "./pwa.js",
  "./icon.svg",
  "./responsive.css",
  "./robots.txt",
  "./sitemap.xml"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(PRECACHE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(key=>key.startsWith("iw-") && key!==CACHE).map(key=>caches.delete(key))
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("message",event=>{
  if(event.data && event.data.type==="SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const request=event.request;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;

  const isHTML=request.mode==="navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname==="/" ||
    url.pathname.endsWith("/");

  if(isHTML){
    event.respondWith(
      fetch(request)
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy));
          return response;
        })
        .catch(()=>caches.match(request).then(cached=>cached||caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached=>{
      if(cached) return cached;
      return fetch(request).then(response=>{
        if(response && response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(request,copy));
        }
        return response;
      }).catch(()=>caches.match("./index.html"));
    })
  );
});