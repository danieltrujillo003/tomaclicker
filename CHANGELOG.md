# Changelog

## [1.0.0] - 2026-03-29
### Added
- **Cross-Platform Support:** Fully optimized for iOS Safari, Android, and Desktop Chrome.
- **Audio Engine:** Implemented audio pooling to prevent stuttering during rapid clicks.
- **Architecture:** Migrated to use the scripts as ES Modules for better separation of concerns.
- **Directory-based Routing:** Transitioned to route-specific directories (`/info/`, `/play/`) to enable "Pretty URLs" and keep the root directory clean.
- **Dynamic Config:** Versioning is now managed via `config.json`.
- **Info Page:** Added an accessible app information route.

### Fixed
- **iOS Audio:** Resolved the "silent audio" bug by implementing an interaction-based unlock.
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
