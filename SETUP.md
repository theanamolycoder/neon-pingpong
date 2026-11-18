# Neon Pong: switching on accounts and the global leaderboard

The game works without any of this. Until you paste a Firebase config into `index.html`, everyone plays as a guest and progress stays on their own device.

Setup takes about 10 minutes and stays on Firebase's free **Spark** plan.

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com>, click **Add project**, and give it a name. You can turn Analytics off.
2. On the project home page, click the **Web** icon (`</>`) to add a web app. Hosting isn't needed.
3. Firebase shows a `firebaseConfig = { ... }` block. Open `index.html`, search for `PASTE_API_KEY`, and replace the six `PASTE_...` values with yours.
4. When Firebase shows the "Add Firebase SDK" step, click **Continue**. The game already loads Firebase itself.

> These config values aren't secret, so it's fine to commit them. `firestore.rules` is what protects the data.

## 2. Turn on sign-in

**Build → Authentication → Get started → Sign-in method**

- **Google**: enable it and choose a support email.
- **Email/Password**: enable it. Leave the passwordless email link option off.

## 3. Authorize your website

**Authentication → Settings → Authorized domains → Add domain**

- Add `theanamolycoder.github.io`.
- `localhost` is already in the list, so local testing works.

If you skip this, Google sign-in fails with *"This website isn't on the Firebase authorized-domains list"*.

## 4. Create the database

**Build → Firestore Database → Create database**

1. For location, choose **asia-south1 (Mumbai)**, or the region closest to your players. You can't change it later.
2. Choose **production mode**.
3. Open the **Rules** tab, delete everything there, paste the **whole** `firestore.rules` file, and click **Publish**.

You don't need any indexes. The leaderboard query uses a single field.

## 5. Publish

```bash
git add index.html firestore.rules firebase.json SETUP.md
git commit -m "Add Firebase accounts + global leaderboard"
git push
```

Wait about a minute for GitHub Pages to update, then hard-refresh the site (Ctrl+Shift+R, or Cmd+Shift+R on a Mac).

## 6. Test it

1. Tap **👤 Sign in** and sign in with Google. The button should turn green and show your name.
2. Play an **Invite Friend** match against a friend, or against your own second phone or browser that is also signed in.
3. Open **🏆 Ranks → 🌍 GLOBAL**. You should be listed, with your row highlighted.

If something fails, open the browser console (F12 → Console) and look for lines starting with `[cloud]` or `auth/`.

| Message | Fix |
|---|---|
| `auth/unauthorized-domain` | Do step 3 again. |
| `auth/operation-not-allowed` | Turn on that sign-in method (step 2). |
| `api-key-not-valid` | Copy `apiKey` from the console again. It's easy to mistype `0`/`O` or `I`/`l`. |
| `permission-denied` | The rules weren't published, or only part of the file was pasted (step 4.3). |

## How it works

- **Cloud save** (`users/{uid}`, private): RP, coins, unlocks, equipped trail, theme, ball, net and racket skin, daily-streak day, power charges and loadout, and bounty progress. It's written at most once every 20 seconds, and also right at match end. A typical match costs about 2 writes per player.
- **Ranked stats** (`leaderboard/{uid}`, readable by signed-in players): ranked RP (Elo-style, 5 to 40 per match), wins, losses, top speed and best rally. Only **online matches against a real player while signed in** count. AI matches never do.
- **New accounts** take the current guest progress with them, once. The guest slot on that device then resets.
- **Global board**: shows the top 25 by ranked RP, cached for 60 seconds per player to save reads.
- **Firebase down or not configured?** The game silently falls back to guest mode.

## Limits

- **Cheating:** matches run peer-to-peer, so nothing on the server watches the game. The rules cap how fast ranked stats can change: at most 3 matches per write, at most 40 RP per match, writes at least 10 seconds apart, and win/loss counts can only go up. That slows down a faker but can't stop one. Real anti-cheat needs a paid server that runs or verifies the matches.
- **Leaderboard privacy:** only signed-in players can read the board, so nobody can scrape it anonymously and burn your read quota. To make it public, change the `allow get` and `allow list` lines in `firestore.rules` to `if true` and publish again.
- **Free quota:** Spark gives 50k reads and 20k writes per day. If you run out, Firebase pauses until the next day instead of charging you. Don't add a billing account unless you want that behaviour to change.
- **Deleting an account:** delete the user under Authentication → Users, and their two documents under Firestore (`users/<uid>` and `leaderboard/<uid>`).

---

# Production release (v9.0.0)

Do these in order. Everything stays on the free **Spark** plan. Project id: `neon-ping-pong`.

## A. Publish the new rules **first**

The v9 game saves extra fields (`ball`, `netFx`, `skin`, `lastDay`, `streak`, `powers`, `loadout`). They are optional in the new rules, so older cached copies of the game keep saving while players update.

Either paste the whole `firestore.rules` into **Firestore Database → Rules → Publish**, or from the project folder:

```bash
npx firebase-tools login          # once
npx firebase-tools deploy --only firestore:rules --project neon-ping-pong
```

(If you deploy the game before the rules, nothing breaks: the game detects `permission-denied` and saves in the old format until the rules are live. Cloud saves just won't include the new fields until then.)

## B. Deploy the game

```bash
npx firebase-tools deploy --only hosting --project neon-ping-pong
```

This uploads `index.html`, `sw.js`, `manifest.webmanifest` and `icon.svg`. Docs and hidden folders are ignored by `firebase.json`. `index.html` and `sw.js` are served with `Cache-Control: no-cache`, so players get the new version on their next visit.

Or both at once: `npx firebase-tools deploy --only hosting,firestore:rules`.

If you also host on GitHub Pages, `git push` updates it after about a minute.

## C. Console checks (one time)

1. **Authentication → Settings → Authorized domains:** make sure every domain the game runs on is listed: `neon-ping-pong.web.app`, `neon-ping-pong.firebaseapp.com` (both are added automatically), `theanamolycoder.github.io` if you use GitHub Pages, and any custom domain. Otherwise Google sign-in fails.
2. **Authentication → Sign-in method:** Google and Email/Password still enabled.
3. **Firestore → Rules:** the *Published* time should be today, and the text should contain `Fields added in v9 are optional`.
4. **Usage and billing → Spark plan:** leave it without a billing account (quota exhaustion pauses instead of charging). Optionally set an alert.

## D. Smoke test on the live URL (5 minutes)

1. Open the site in a private window. You should see the **V9** badge and a daily reward popup.
2. Sign in with Google. Open the browser console (F12): there must be **no** `permission-denied` lines starting with `[cloud]`.
3. Buy a power in **Locker → ⚡ POWERS**, reload, sign in again: the charge is still there (this proves the new fields were saved to the cloud).
4. Play an Invite Friend match from a second device. Both players should see "Powers/skins", pings and the same court. A ranked match must show powers as unavailable.
5. **Ranks → 🌍 GLOBAL** still lists you after the ranked match.
6. Turn on airplane mode after loading once and reload: the menu and vs-AI play still work (service worker).

## E. Things players will notice

- Anyone with an old copy open will see the "refresh to update" message when joining a v9 player: that is the network version check (v14) doing its job.
- Existing players get a free 🛡️ Goal Guard and ⚡ Overload once, and their daily streak starts at day 1.
- The service worker keeps one copy of the game for offline play. It is network-first, so it never serves an old version while online.

## F. Roll back

- **Hosting:** Firebase console → Hosting → Release history → ⋮ → **Rollback** on the previous release.
- **Rules:** Firestore → Rules → history, or restore the v8 file from git: `git show 3556353:firestore.rules > firestore.rules` and deploy it.
- Data written by v9 stays valid: older versions ignore the extra fields.
