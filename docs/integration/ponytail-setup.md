# Ponytail Plugin — Setup

> Installed from: https://github.com/DietrichGebert/ponytail.git

---

## What was done

**1. Created `.opencode/` folder structure**
```
.opencode/plugins/      # plugin files
.opencode/skills/       # skill definitions
.opencode/command/      # /ponytail CLI commands
```

**2. Cloned ponytail repo**
```
git clone https://github.com/DietrichGebert/ponytail.git
```

**3. Copied files from ponytail repo into this project**

| File/dir | Destination | Purpose |
|---|---|---|
| `.opencode/plugins/ponytail.mjs` | `.opencode/plugins/` | Core plugin — injects ruleset every turn, handles `/ponytail` commands |
| `hooks/` | project root | Shared JS files (`ponytail-instructions.js`, `ponytail-config.js`, etc.) |
| `skills/` | project root | Ponytail skill definitions for lite/full/ultra/review modes |
| `.opencode/command/*.md` | `.opencode/command/` | 6 command files: `ponytail`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`, `ponytail-review` |

**4. Created `opencode.json`**

At project root, references the plugin:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["./.opencode/plugins/ponytail.mjs"]
}
```

---

## How it works

- **`ponytail.mjs`** — An OpenCode server plugin that hooks into `experimental.chat.system.transform` to inject the Ponytail ruleset into every turn's system prompt
- **Mode persistence** — The plugin reads/writes a state file at `~/.config/opencode/.ponytail-active` to remember the active mode (lite/full/ultra/off) across sessions
- **Skill discovery** — Registers `skills/` directory so OpenCode discovers the ponytail skills at runtime
- **Commands** — `/ponytail` commands are separate `.md` files in `.opencode/command/` that OpenCode discovers from the project

---

## File structure

```
project-root/
├── .opencode/
│   ├── plugins/ponytail.mjs      # plugin entry
│   ├── command/ponytail*.md      # 6 command definitions
│   └── skills/                   # (moved to project-root/skills/)
├── hooks/                        # shared JS logic (imported by plugin)
├── skills/                       # ponytail skill SKILL.md files
└── opencode.json                 # loads the plugin
```

---

## To share across projects

Replace `./.opencode/plugins/ponytail.mjs` with an absolute path in `opencode.json`:

```json
{
  "plugin": ["/absolute/path/to/ponytail/.opencode/plugins/ponytail.mjs"]
}
```

And symlink commands globally:
```bash
ln -sf /absolute/path/to/ponytail/.opencode/command/* ~/.config/opencode/command/
```
