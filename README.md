# HELLDIVERS: BEHIND ENEMY LINES

An unofficial, fan-made, pixel-art side-scrolling Metroidvania prototype.

## Play online

Once GitHub Pages publishes the latest workflow build, open:

**https://dreadcaptjames.github.io/behindenemylines/**

Use **Settings → Pages → Source: GitHub Actions**. The workflow is **Publish Behind Enemy Lines** in the Actions tab. A green check indicates the deployment job completed.

## Mobile touch controls

Touch-capable browsers now have a responsive dual-thumb control layer, supplied from the versioned files in [mobile/](mobile/):

- Left directional pad — move and enter Stratagem codes
- Right circular pad — drag to aim and fire simultaneously
- Jump, Dive, Use
- Reload, Stratagem, EMP, Map, Pause
- Deploy, Continue, and Resume Checkpoint buttons

For phone play, rotate to landscape. Tablet landscape provides more room. The **TOUCH ON/OFF** button hides the touch UI if you have a keyboard or gamepad.

Keyboard, mouse, and gamepad controls remain available.

## Release archive and deployment

The repository preserves each full game ZIP (including art, audio, Godot source, and browser demo), and keeps independent touch control source files. The current archived base is **v1.0.1**; the mobile touch-control overlay is committed separately. A complete **v1.0.2** ZIP can also be uploaded to archive this milestone.

The [Pages workflow](.github/workflows/pages.yml) chooses the highest version-numbered `Helldivers_Behind_Enemy_Lines_v*.zip`, extracts `browser-demo/`, `art/`, and `audio/`, and includes `mobile/` from this repository. It creates a playable root `index.html` that forwards to the game.

To archive a future full release: upload its ZIP **unchanged** to the repository root, commit to `main`, and check [Actions](../../actions).

If the site shows this README rather than the game, switch **Settings → Pages → Source** to **GitHub Actions**, then manually run **Publish Behind Enemy Lines** from the Actions tab.

## Copyright

This is an unofficial fan project, not affiliated with Arrowhead Game Studios or Sony Interactive Entertainment. Helldivers names and setting are protected intellectual property; public distribution may require permission from the rights holders.
