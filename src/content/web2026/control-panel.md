---
title: Control Panel
published: false
---

# Control Panel

Buttons for the web2026 authoring workflow. Open this note in **Reading** or **Live Preview** mode so the buttons render. Requires the Meta Bind, Obsidian Git, Slides Extended, and Shell commands plugins.

## Slides

```meta-bind-button
label: "▶ Show slide preview"
icon: "presentation"
style: primary
action:
  type: command
  command: slides-extended:open-preview
```

```meta-bind-button
label: "↻ Reload preview"
icon: "refresh-cw"
style: default
action:
  type: command
  command: slides-extended:reload-preview
```

```meta-bind-button
label: "Open preview in browser"
icon: "external-link"
style: default
action:
  type: open
  link: "http://localhost:3000"
```

```meta-bind-button
label: "Start preview server"
icon: "play"
style: default
action:
  type: command
  command: slides-extended:start-server-preview
```

```meta-bind-button
label: "Stop preview server"
icon: "square"
style: default
action:
  type: command
  command: slides-extended:stop-server-preview
```

> To **export** the current deck, open the preview (button above) and use the export control in the Slides Extended preview pane's toolbar. Slides Extended does not expose export as a command, so it can't be a button.

## Git

```meta-bind-button
label: "✓ Commit & push"
icon: "upload"
style: primary
action:
  type: command
  command: obsidian-git:commit-push-specified-message
```

```meta-bind-button
label: "Push"
icon: "arrow-up"
style: default
action:
  type: command
  command: obsidian-git:push
```

```meta-bind-button
label: "Pull"
icon: "arrow-down"
style: default
action:
  type: command
  command: obsidian-git:pull
```

```meta-bind-button
label: "Open Source Control"
icon: "git-branch"
style: default
action:
  type: command
  command: obsidian-git:open-git-view
```

*"Commit & push" prompts you for a single-line message each time (semantic style, e.g. `feat: add day 3 slides`). No auto-commit is configured.*

## Slide assets

```meta-bind-button
label: "Normalize current deck's asset paths"
icon: "wand-2"
style: default
action:
  type: command
  command: obsidian-shellcommands:shell-command-normalize-slides
```

> **One-time setup for the button above.** Open Settings → Shell commands → New shell command, paste:
> ```
> node scripts/normalize-slide-assets.mjs "{{file_path:absolute}}"
> ```
> Set its working directory to the repo root (the `teaching-main` folder), give it the alias `Normalize slide assets`, and enable "command palette". If the button reports an unknown command, replace `shell-command-normalize-slides` above with the id shown in the shell command's settings (it looks like `shell-command-<number>`).
