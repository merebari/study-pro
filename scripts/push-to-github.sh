#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Study Pro → GitHub push helper
# Usage:  bash scripts/push-to-github.sh [repo-name] [--private]
# ─────────────────────────────────────────────────────────────
set -euo pipefail

REPO_NAME="${1:-study-pro}"
VISIBILITY="--public"
[ "${2:-}" = "--private" ] && VISIBILITY="--private"

green() { printf "\033[1;32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[1;33m%s\033[0m\n" "$*"; }
red() { printf "\033[1;31m%s\033[0m\n" "$*"; }

# 1 ─ Ensure gh CLI exists
if ! command -v gh >/dev/null 2>&1; then
  yellow "GitHub CLI (gh) not found — installing to ~/.local/bin …"
  mkdir -p ~/.local/bin /tmp/gh-install
  curl -fsSL "https://github.com/cli/cli/releases/download/v2.63.2/gh_2.63.2_linux_amd64.tar.gz" \
    -o /tmp/gh-install/gh.tgz
  tar -xzf /tmp/gh-install/gh.tgz -C /tmp/gh-install
  cp /tmp/gh-install/gh_2.63.2_linux_amd64/bin/gh ~/.local/bin/gh
  export PATH="$HOME/.local/bin:$PATH"
fi
green "✓ gh $(gh --version | head -1)"

# 2 ─ Ensure authenticated (opens a one-time device-flow code if not)
if ! gh auth status >/dev/null 2>&1; then
  yellow "You need to sign in to GitHub once."
  gh auth login --web -h github.com -p https -s repo,workflow
fi
GH_USER="$(gh api user --jq .login)"
green "✓ Signed in as @$GH_USER"

# 3 ─ Ensure local repo is ready
git symbolic-ref -q main >/dev/null 2>&1 || git branch -M main 2>/dev/null || true

# 4 ─ Create the remote repo (idempotent) & wire the remote
if gh repo view "$GH_USER/$REPO_NAME" >/dev/null 2>&1; then
  yellow "Repo $GH_USER/$REPO_NAME already exists — reusing it."
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git"
else
  gh repo create "$REPO_NAME" "$VISIBILITY" --source=. --remote=origin --description "The Nigerian study app for Primary 1 → SS3: lesson notes, quizzes, past questions, CBT, flashcards, tools (Next.js 16 + PostgreSQL)"
fi
green "✓ Remote ready: https://github.com/$GH_USER/$REPO_NAME"

# 5 ─ Personalise README badges with the real username, commit if changed
if grep -q "YOUR-USERNAME" README.md 2>/dev/null; then
  sed -i "s/YOUR-USERNAME/$GH_USER/g" README.md
  git add README.md
  git commit -q -m "chore: set GitHub username (@$GH_USER) in README badges" || true
fi

# 6 ─ Push
git push -u origin main
green "🎉 Pushed! https://github.com/$GH_USER/$REPO_NAME"
echo
yellow "Next: Actions tab → watch CI go green, then Netlify → Import from GitHub (netlify.toml is ready)."
