# HELLDIVERS: BEHIND ENEMY LINES

An unofficial fan-made, pixel-art side-scrolling Metroidvania prototype.

## Play in your browser

Once the latest complete release ZIP is uploaded and **GitHub Pages → Source → GitHub Actions** is enabled, the playable browser game will be published at:

**https://dreadcaptjames.github.io/behindenemylines/**

The [GitHub Actions workflow](.github/workflows/pages.yml) automatically extracts the browser build, artwork, and audio from the newest complete release ZIP. The original ZIP stays in the repository as an **archive of the entire release**, including the editable Godot source.

## How to add a release

1. Download the complete release ZIP from the ChatGPT development conversation.
2. In this repository, choose **Add file → Upload files**.
3. Upload the ZIP to the **repository root** without changing its filename, e.g. `Helldivers_Behind_Enemy_Lines_v1.0.1.zip`.
4. Commit to `main`. GitHub Actions will prepare the latest ZIP for GitHub Pages.
5. Under **Settings → Pages**, choose **GitHub Actions** as the publishing source if it is not already selected.

The workflow deliberately never overwrites an older release. Each release is preserved as its own ZIP and Git commit.

## Repository organization

- `.github/workflows/pages.yml`: unpack and deploy the latest complete release ZIP
- `Helldivers_Behind_Enemy_Lines_v*.zip`: archived playable builds, Godot source, art and audio
- `README.md`: setup and release instructions

## Important

This is an **unofficial fan project**, not affiliated with or endorsed by Arrowhead Game Studios or Sony Interactive Entertainment. Helldivers and its associated intellectual property belong to their respective owners. Publishing a fan game publicly may require permission from the rights holders.

**Current repository state:** deployment workflow prepared. Upload a complete game ZIP before the site can be played.
