/* =====================================================================
   Auth guard (shared by every screen except login.html and manage.html).
   - If nobody is signed in, redirect to login.html.
   - If signed in, look up the staff role (staff/{uid}) and expose
     window.currentUser + window.currentRole, then fire "auth-ready".
   - Adds a "name - role - Logout / Change password" pill (bottom-right).
   ===================================================================== */
(function () {
  if (!window.CONFIG_OK) return;

  var rootEl = document.documentElement;
  rootEl.style.visibility = "hidden";
  function reveal() { rootEl.style.visibility = "visible"; }

  function changePassword() {
    var np = prompt("Enter a new password (at least 6 characters):");
    if (!np) return;
    if (np.length < 6) { alert("Password must be at least 6 characters."); return; }
    firebase.auth().currentUser.updatePassword(np)
      .then(function () { alert("Password updated."); })
      .catch(function (e) {
        if (e && e.code === "auth/requires-recent-login")
          alert("For security, please log out and sign in again, then change your password.");
        else alert("Could not update password: " + (e.message || e));
      });
  }

  function addPill(name, role) {
    if (document.getElementById("authPill")) return;
    var pill = document.createElement("div");
    pill.id = "authPill";
    pill.style.cssText = "position:fixed;right:12px;bottom:12px;z-index:9999;display:flex;gap:.5rem;align-items:center;background:#2a2019;border:1px solid #3d2f25;color:#cdbea2;border-radius:10px;padding:.4rem .55rem;font:500 .8rem system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.35)";
    var label = document.createElement("span");
    label.textContent = (name || "staff") + " \u00b7 " + (role || "staff");
    var keyBtn = document.createElement("button");
    keyBtn.textContent = "\uD83D\uDD11";
    keyBtn.title = "Change my password";
    keyBtn.style.cssText = "background:none;border:1px solid #5a4a3a;color:#cdbea2;border-radius:7px;padding:.35rem .55rem;font:600 .8rem system-ui,sans-serif;cursor:pointer";
    keyBtn.onclick = changePassword;
    var out = document.createElement("button");
    out.textContent = "Logout";
    out.style.cssText = "background:none;border:1px solid #5a4a3a;color:#e2942f;border-radius:7px;padding:.35rem .6rem;font:600 .8rem system-ui,sans-serif;cursor:pointer";
    out.onclick = function () { firebase.auth().signOut().then(function () { location.replace("login.html"); }); };
    pill.appendChild(label); pill.appendChild(keyBtn); pill.appendChild(out);
    document.body.appendChild(pill);
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (!user) { location.replace("login.html"); return; }
    window.currentUser = user;
    var finish = function (name, role) {
      window.currentRole = role;
      window.currentName = name;
      reveal();
      var go = function () { addPill(name, role); };
      if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
      document.dispatchEvent(new Event("auth-ready"));
    };
    if (window.db) {
      window.db.collection("staff").doc(user.uid).get()
        .then(function (d) {
          if (d.exists) finish(d.data().loginName || "staff", d.data().role || "unassigned");
          else finish("staff", "unassigned");
        })
        .catch(function () { finish("staff", "unassigned"); });
    } else { finish("staff", "unassigned"); }
  });
})();
