# Changelog

## v10.0.0

### Fixes
- **Bat skins now apply.** A skin equipped from the Locker (including from the game-over screen or mid-match) shows on your bat immediately and after Rematch; online opponents see the change too.
- **Phones:** superpower and AIM buttons moved out of the court into the control deck (AIM replaces Chrono while you serve), so they no longer cover your bat; one-row header in matches; toasts at the top; no controls showing through menus.
- **Updates show up immediately:** the page and scripts are served `no-cache` and the service worker always revalidates (`neon-pong-v2`).
- AIM buttons no longer appear during the start countdown.

### New
- **Same-device 2-player mode** (👥 on the menu): P1 = WASD + Space / Left-Shift, P2 = arrows + Enter / Right-Shift; on a touchscreen each player drags and taps on their own half (double-tap = Chrono). No coins or RP; no assist or superpowers.
- **Stakes pot:** coins fly from both scoreboards into a pot at kick-off ("POT LOCKED") and to the winner at the end; **🔥 Double or Nothing** rematch (up to 🪙200 each).
- **Mega Bat** (+35% for 6 s) and **Shrink Ray** (rival −30% for 5 s) over-the-net pickups.
- **2.5D tilted court** (Controls → Court View), drawn by the GPU with exact touch/mouse mapping; a slight lean follows the ball. FLAT turns it off.

### Design
- Results screen: victory/defeat kicker in the winner's colour, labelled stat cards, pot payout chip, clearer rematch buttons.
- Menu: the three ways to play side by side (stacked on phones); consistent glass panels, HUD score glows.
- No purple anywhere (bounty pill amber/teal, spin trail teal, rainbow trail skips purple hues).

### Network
- Protocol version 15 (skin message, stakes up to 200, bat-size sync): players on older copies are asked to refresh.

## v9.0.1 (performance hotfix)
- Game-over screen now appears instantly (a 1.25 s "GAME!" delay was removed) so Rematch / Play again can be hit straight away.
- Drawing is ~7x cheaper per frame: bat and ball glows are layered strokes instead of blur filters; remaining blurs are capped.
- Online guests no longer touch the page for every network packet (HUD only updates when a value changes).
- Removed repainting animations (title shimmer, overdrive filter pulse), the big rally ghost number and full-screen blur on phones; title-screen demo runs at 30 fps.

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
