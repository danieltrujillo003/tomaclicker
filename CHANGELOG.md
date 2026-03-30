# Changelog

## [1.1.0] - 2026-03-30
### Added
- **High-Performance Audio Engine:** Migrated SFX from HTML5 `<audio>` element pooling to the **Web Audio API** (`AudioContext`), achieving zero-latency playback even during extreme high-CPS (clicks-per-second) interactions.
- **Advanced Audio Routing (GainNodes):** Implemented `GainNode` routing to decouple application volume from the OS hardware volume, successfully bypassing iOS Safari's native volume-lock restrictions.
- **UX Audio Ducking:** Introduced a dynamic crossfade system at the climax (click 95). The background track smoothly fades in (from 0.05 to 1.0) while the splash SFX fades out (to 0.4), shifting user focus naturally.
- **Stealth Onboarding:** Redesigned the initial UI state to display a minimal dash (`-`). This acts as a disguised "Tap to Start" interaction, allowing the app to silently unlock iOS audio policies without disrupting the extreme simplicity of the UX.

### Changed
- **Architecture:** Reorganized the Vanilla JS into strict vertical blocks (DOM/State, Audio Engine, UI/Logic, Interaction Controller, Event Bindings) to prevent spaghetti code and improve maintainability.
- **Event Synchronization:** Removed fragile `setTimeout` logic for the final phrase trigger. Synchronization is now anchored strictly to the media clock via a self-destructing `timeupdate` event listener, eliminating drift caused by UI thread congestion.
- **Rendering Optimization:** Wrapped the `createDrop` DOM mutations inside `requestAnimationFrame` to batch rendering processes and eliminate UI lag/layout thrashing.

### Fixed
- **The iOS "Silent First Click" Bug:** Engineered a "Ghost Audio Unlocker" that plays a 1ms silent buffer on the first interaction, permanently waking up the WebKit audio context without dropping the first visual feedback.
- **Mobile Web App Feel (CSS):** Locked down the viewport entirely. Added `touch-action: none` to eliminate the 300ms tap delay and block double-tap zoom, alongside `overscroll-behavior: none`, `user-select: none`, and `-webkit-user-drag: none` to prevent native browser UI interruptions.
- **Promise Choking:** Decoupled UI updates from asynchronous audio unlocking promises, ensuring the visual counter responds instantly regardless of hardware audio initialization delays.

---

## [1.0.0] - 2026-03-29
### Added
- **Cross-Platform Support:** Fully optimized for iOS Safari, Android, and Desktop Chrome.
- **Architecture:** Migrated to use the scripts as ES Modules for better separation of concerns.
- **Directory-based Routing:** Transitioned to route-specific directories (`/info/`, `/play/`) to enable "Pretty URLs" and keep the root directory clean.
- **Dynamic Config:** Versioning is now managed via `config.json`.
- **Info Page:** Added an accessible app information route.

### Fixed
- **Performance:** Replaced `setTimeout` cleanup with `animationend` events to prevent memory leaks.
- **UI:** Fixed CSS `:active` states and viewport "bounce" issues on iPhone.

---

## [0.1.0] - 2025-01-03
### Accomplishments
- **Core Game Engine:** Developed a functional clicker loop featuring custom exponential growth scaling logic.
- **Interactive Visuals:** Engineered the "Tomato Drop" animation system to create a dynamic and engaging user interface.
- **Multimedia Synthesis:** Integrated custom audio remixing with interactive sound effects tied to user clicks.
- **Proposal Trigger Logic:** Implemented the secret click-threshold system (95 clicks) to transition the app into its sentimental climax.
- **Purpose-Built Design:** Created a personalized, high-stakes digital experience that successfully delivered a marriage proposal.