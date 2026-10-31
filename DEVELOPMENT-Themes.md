# Clash Verge Themes for Windows

Based on upstream v2.5.8, commit 4337bd85758d54d7b9044b2da3c9ac1176eae1f3.
Project: D:\aproject\ClashMetaForWindows
Repository: https://github.com/Wodecj/ClashMetaForWindows

## Use

Open Settings → Theme (the custom-theme editor), choose a background image,
select its fit and overlay level, then Save. PNG, JPG, WebP and BMP images up to
5 MiB are supported. The preview shows the selected original image.

Contain is the default: no cropping or distortion, with margins when aspect
ratios differ. Cover preserves proportions and crops edges. Stretch fills the
window and may distort the picture. Overlay 0% shows the image clearly; 100%
hides it. Remove image restores the regular theme after saving. Cancel discards
unsaved image and appearance changes. Text contrast shadows are not added.

Images are stored inside local configuration, independent of the original file.
Settings survive restart. Backups of configuration can include the image.

## Environment and build

Windows 10/11, Visual Studio 2022 Build Tools (Desktop development with C++,
Windows SDK and ARM64 MSVC tools for cross compilation), WebView2 Runtime,
Node.js 24.21.0, pnpm 12.10.0, Rust 1.99.0. Versions follow upstream v2.5.8.

```powershell
git clone https://github.com/Wodecj/ClashMetaForWindows.git D:\aproject\ClashMetaForWindows
cd D:\aproject\ClashMetaForWindows
npm install -g pnpm@12.10.0
rustup toolchain install 1.99.0
rustup default 1.99.0
rustup target add aarch64-pc-windows-msvc x86_64-pc-windows-msvc
pnpm install --frozen-lockfile
pnpm typecheck
pnpm prebuild aarch64-pc-windows-msvc
node node_modules/@tauri-apps/cli/tauri.js build --target aarch64-pc-windows-msvc --bundles nsis -- --locked
```

For x64 use x86_64-pc-windows-msvc in both prebuild and build commands. Output:
target/<target>/release/bundle/nsis/*-setup.exe. For development run
`pnpm prebuild x86_64-pc-windows-msvc` then `pnpm dev:tauri`.

## Packaging and publishing

The Windows Themes Actions workflow builds both Windows architectures, checks
TypeScript and changed frontend files, then uploads installers, source archive,
license, notices, source commit, third-party version record and SHA-256 sums.
Publish only artifacts from a successful run, in a release targeting that exact
source commit. Mark the release as Latest after verifying the assets. Ship GPL
source and notices together with installers. Preserve dependency license files.

This initial community build uses manual release downloads. Automatic updates
are disabled by default; upstream update endpoints are replaced with this fork's
endpoint. No updater manifest is published for this initial version.
Windows Authenticode signing requires the publisher's certificate; no such
certificate is included. A build without it is an unsigned community installer.

The application name is Clash Verge Themes and its data directory is
%APPDATA%\io.github.wodecj.clash-verge-themes. Official configuration is not
automatically imported. The underlying upstream service is shared: exit the
other Clash Verge instance before running this fork.

## Main changes

Frontend: theme-viewer.tsx, use-custom-theme.ts, utils/wallpaper.ts.
Backend: IVergeTheme persists background_image, background_fit and
background_opacity. Configuration mutations use the existing shared intent and
patch/persistence path. Image selection uses the WebView's file picker.

The original upstream workflows are retained in .github/upstream-workflows
as reference, rather than running upstream release and notification jobs in
this independent repository. GPL-3.0-only applies; see LICENSE and NOTICE-Themes.md.
