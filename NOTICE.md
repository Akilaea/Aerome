# NOTICE

This is a derivative work of [Mineradio](https://github.com/XxHuberrr/Mineradio).

Aerome uses the following third-party projects or services. All rights reserved by their respective authors.

## Copyright Notices

```
Copyright (C) 2026 XxHuberrr
  — original Mineradio project, https://github.com/XxHuberrr/Mineradio

Copyright (C) 2026 Akilaea
  — Aerome derivative work, https://github.com/Akilaea/Aerome
```

Both copyright lines apply to this distribution. The GPL-3.0 license in [LICENSE](./LICENSE) covers the combined work.

## Third-party Libraries

- Electron
- Three.js
- GSAP
- music-tempo
- NeteaseCloudMusicApi
- mpg123-decoder

## Third-party Services

Aerome may interact with the following third-party services via user-owned accounts or public anonymous APIs:

- NetEase Cloud Music
- QQ Music
- Bilibili (anonymous public APIs only)
- Open-Meteo (weather)
- GitHub (release update check)

Aerome is not an official client of any music platform and is not affiliated with the above companies. Users must comply with each platform's terms of service, copyright rules, and membership rules.

## Original Design Attribution

The Mineradio name, MR Logo, interface visual design, startup animation direction, particle visual experience, and the product expression of the cinematic lens system are the original design of XxHuberrr, used in the upstream project. The Aerome derivative uses an independent name, icon, and branding to avoid confusion with the original.

emily is acknowledged as a co-creator and inspiration for the early visual layer and the `emily` preset improvements.

The upstream author thanks 小天才e宝、应春日、锋将军、軌跡、林中、骊、风痕、花椰菜🥦 for early testing and release preparation.

## Derivative Work Notes

The Aerome derivative is maintained by [Akilaea](https://github.com/Akilaea). The following changes have been applied on top of Mineradio v1.1.0:

- Renamed project to Aerome with new appId, executable name, NSIS configuration, and icon
- Tightened local HTTP service to 127.0.0.1 with loopback-only CORS
- Added Bilibili audio source integration (anonymous, no login)
- Backward-compatible environment variable support (`AEROME_*` preferred, `MINERADIO_*` fallback)
