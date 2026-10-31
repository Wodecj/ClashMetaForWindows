# Clash Verge Themes

Community modification by Wodecj, 2026-11-01, based on Clash Verge Rev v2.5.8
(commit 4337bd85758d54d7b9044b2da3c9ac1176eae1f3).

Upstream: https://github.com/clash-verge-rev/clash-verge-rev
Modified source: https://github.com/Wodecj/ClashMetaForWindows

The application and these modifications are licensed under GPL-3.0-only.
The original LICENSE and upstream copyright notices are retained.
This is an independent community fork, not an official Clash Verge Rev release.

Changes: local background image selection, persistent image settings, contain /
cover / stretch modes, adjustable overlay, image removal, wallpaper-aware page
surfaces, and separate application identity and configuration directory.

Mihomo and the upstream service remain separately licensed components. Their
versions are recorded in THIRD-PARTY-VERSIONS.json in the build artifacts.
Mihomo source: https://github.com/MetaCubeX/mihomo (GPL-3.0).
Service source: https://github.com/clash-verge-rev/clash-verge-service-ipc.
JavaScript and Rust dependencies retain their own licenses; exact versions and
source revisions are recorded in pnpm-lock.yaml and Cargo.lock.

The background image is embedded in the local verge.yaml configuration and can
therefore be included in user-created configuration backups. No image is sent
to this repository or uploaded by the wallpaper feature.

Version 2.5.8-themes.2 (2026-11-01): fixes ordinary, hovered and selected proxy
surfaces, subscriptions, extension cards and page input backgrounds so they all
follow wallpaper overlay opacity. Selected nodes retain their border indicator.
This release builds and distributes Windows x64 only.
