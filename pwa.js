/* IDIOT → WIZARD PWA runtime — BLSSNVJ21 */
(function(){
  "use strict";

  var installPrompt = null;

  function addInstallButton(){
    if(document.getElementById("iw-install")) return;
    var button=document.createElement("button");
    button.id="iw-install";
    button.type="button";
    button.textContent="⬇ Install App";
    button.style.cssText="position:fixed;right:16px;bottom:16px;z-index:9999;background:#7c3aed;color:#fff;border:1px solid #a78bfa;border-radius:12px;padding:11px 15px;font:700 14px system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.35);display:none;cursor:pointer";
    button.addEventListener("click",async function(){
      if(!installPrompt) return;
      installPrompt.prompt();
      try{ await installPrompt.userChoice; }catch(_){}
      installPrompt=null;
      button.remove();
    });
    document.body.appendChild(button);
    return button;
  }

  function registerSW(){
    if(!("serviceWorker" in navigator)) return;
    window.addEventListener("load",function(){
      navigator.serviceWorker.register("./service-worker.js",{scope:"./"})
        .then(function(reg){
          reg.addEventListener("updatefound",function(){
            var worker=reg.installing;
            if(!worker) return;
            worker.addEventListener("statechange",function(){
              if(worker.state==="installed" && navigator.serviceWorker.controller){
                var n=document.createElement("div");
                n.textContent="✨ A new IDIOT → WIZARD version is ready. Reload to update.";
                n.style.cssText="position:fixed;left:12px;right:12px;bottom:12px;z-index:9998;background:#101a2c;color:#eef3ff;border:1px solid #8b5cf6;border-radius:12px;padding:12px 15px;font:600 14px system-ui,sans-serif;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.35);cursor:pointer";
                n.addEventListener("click",function(){location.reload()});
                document.body.appendChild(n);
              }
            });
          });
        })
        .catch(function(err){console.warn("PWA service worker registration failed:",err)});
    });
  }

  window.addEventListener("beforeinstallprompt",function(event){
    event.preventDefault();
    installPrompt=event;
    var b=addInstallButton();
    if(b) b.style.display="block";
  });

  window.addEventListener("appinstalled",function(){
    installPrompt=null;
    var b=document.getElementById("iw-install");
    if(b) b.remove();
  });

  document.addEventListener("DOMContentLoaded",function(){
    document.querySelectorAll(".logo,.brand").forEach(function(el){
      if(el.querySelector(".iw-brand-icon")) return;
      var img=document.createElement("img");
      img.className="iw-brand-icon";
      img.src="icon.svg";
      img.alt="";
      img.width=34;
      img.height=34;
      img.style.cssText="width:34px;height:34px;vertical-align:middle;margin-right:8px;border-radius:9px;object-fit:cover";
      el.prepend(img);
    });
    var footer=document.createElement("footer");
    footer.setAttribute("aria-label","Site footer");
    footer.textContent="⚡ IDIOT → WIZARD · BLSSNVJ21 · Learn by breaking, debugging and building.";
    footer.style.cssText="max-width:1100px;margin:30px auto 0;padding:18px 14px;color:#9aa8c4;text-align:center;font:12px/1.5 system-ui,sans-serif;border-top:1px solid rgba(43,58,88,.7)";
    document.body.appendChild(footer);
    document.documentElement.classList.add("iw-ready");
  });

  registerSW();
})();