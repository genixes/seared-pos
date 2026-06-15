# Seared POS

A real-time restaurant POS (Firebase + plain HTML). All screens share one
Firebase project, so any number of devices stay in sync in real time.

## Files
- `index.html` - home launcher (open this first on each device)
- `setup.html` - one-time: load the 55-item menu into Firebase
- `floor.html` - tables overview
- `order.html` - waiter order entry (+ transfer table, void with manager PIN)
- `kitchen.html` - kitchen display (with new-order sound)
- `billing.html` - cashier billing + printable receipt
- `dashboard.html` - manager dashboard + end-of-day report
- `config.js` - **your Firebase config goes here, ONCE**
- `hardware.js` - printer + cash drawer layer (wired later for real hardware)

## One-time setup
1. Open `config.js` in a text editor and paste your Firebase config from the
   Firebase console (Project settings > Your apps > web app). Save.
   You only paste it here - every screen reads from this file.
2. Open `setup.html` once and click **Load menu into Firebase** (only if the
   menu has not been loaded yet).

## Running on multiple devices
Host the whole folder once (see below), then on each device open the URL:
- Waiter tablets -> `order.html`
- Kitchen tablet -> `kitchen.html`  (tap "Enable sound" each shift)
- Cashier -> `billing.html`  (and `floor.html` if needed)
- Manager -> `dashboard.html`

## Deploying to GitHub Pages
1. Create a new GitHub repository (e.g. `seared-pos`).
2. Upload ALL files in this folder to the repo (keep the same file names).
3. Repo **Settings > Pages** > Source: `main` branch, `/root` > Save.
4. After a minute you get a URL like `https://yourname.github.io/seared-pos/`.
5. Open that URL on each device.

> Security note: while Firestore is in **test mode**, anyone with the URL can
> read/write the data. This is fine for your own testing, but DO NOT share the
> URL publicly or use it with the real client until Phase 7.2 (staff login +
> locked-down security rules) is done.

## Hardware (later)
The printer and cash drawer are handled only in `hardware.js`. When the
thermal printer + electric drawer arrive, that single file is updated (e.g. to
use the RawBT print bridge) - no other file changes.


## Staff login & roles (Phase 7.2)
Staff sign in with their **first name + password** (no email). Roles and
passwords are managed by the manager.

First-time setup:
1. Firebase console > Authentication > Sign-in method > enable **Email/Password**.
2. Open `manage.html`. Since no staff exist yet, it lets you create the first
   **manager** account (first name + password).
3. As manager, use `manage.html` (also linked from the dashboard's "Manage"
   button) to add staff: first name, role (waiter/cashier/kitchen/manager),
   and a password you set while they watch.
4. Each staff signs in at `login.html` with their first name + password.
   They can change their own password from the key button on the logout pill.

Note: a forgotten password can be reset by the staff themselves once signed in.
Manager-side password reset for someone who is locked out needs a small server
function (Cloud Functions) - we can add that later if needed.
