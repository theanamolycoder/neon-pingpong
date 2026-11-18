# Changelog

## v9.0.0

### Gameplay
- Six rackets (new **Phantom Edge**, **Volt Striker**), each with a passive ability and new ultimates (Ghost Shot, Zigzag Bolt).
- Bat physics: inertia per racket, sweetspot and edge hits, tilt steering, swing follow-through.
- Serve aiming with a wall-bounce preview and a small random wobble (Q/E, wheel, AIM buttons).
- Human-like AI (reaction time, misreads, speed limit), tuned to ~26% / 47% / 64% win rate for Casual / Pro / Godlike against a mid-skill player; independent of screen refresh rate.
- Over-the-net pickups: 2X Fever, Mirage, Coin Burst, Time Warp; net ripple; speed streaks.
- "Last point" slow-mo, match-point vignette, "GAME!" finish.
- Fix: bat could not move away from a wall during very fast balls (aim-assist and hit-freeze rework).

### Economy and social
- Card packs (Rookie / Pro / Legend), 30 cosmetics with rarities, duplicate refunds.
- Daily login streak (7-day cycle, free pack on day 7).
- Racket skins (synced to your opponent).
- Superpowers: 6 consumable powers, 2 loadout slots (Z / X), off in ranked.
- Friend stakes, head-to-head records, 8 emotes.

### UI / UX
- New menu: racket stat bars, remembered settings, title-screen demo rally, V9 title.
- One-row header with emote popover, key badges, speed colour ramp, rally ghost counter, confetti, nudge dots, toasts and focus outlines.
- Keyboard shortcuts everywhere (H lists them), pause, controller support.

### Performance and robustness
- Cached backdrop, cheaper glows, pixel budget for large screens, faster auto-LITE.
- Crash-proof game loop, auto-pause on focus loss, leave-warning in live online matches, multi-tab profile sync.
- Offline play via a network-first service worker (`sw.js`).
- Stake forfeits on disconnect, fresh powers/stakes on rematch, ping quality colours.

### Network / backend (**action needed**, see SETUP.md → "Production release")
- Network protocol version 14: players on older copies are asked to refresh.
- `firestore.rules`: new optional profile fields (`ball`, `netFx`, `skin`, `lastDay`, `streak`, `powers`, `loadout`); `unlocked` limit raised to 60.
- `firebase.json`: `sw.js` is served with `no-cache`.
