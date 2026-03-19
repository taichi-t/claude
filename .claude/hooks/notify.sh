#!/bin/bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

TYPE="${1:-notification}"

case "$TYPE" in
  stop)
    CWD="${CLAUDE_PROJECT_DIR:-$PWD}"
    TITLE="Claude Code"
    MESSAGE="作業が完了しました"
    SOUND="Hero"
    ;;
  notification)
    INPUT=$(cat)
    CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
    if [ -z "$CWD" ]; then CWD="${CLAUDE_PROJECT_DIR:-$PWD}"; fi
    TITLE=$(echo "$INPUT" | jq -r '.title // "Claude Code"')
    MESSAGE=$(echo "$INPUT" | jq -r '.message // "承認が必要です"')
    SOUND="Glass"
    ;;
esac

WORKTREE=$(basename "$CWD")

# macOS 通知（クリックでCursorを開く）
terminal-notifier \
  -title "$TITLE" \
  -subtitle "$WORKTREE" \
  -message "$MESSAGE" \
  -sound "$SOUND" \
  -execute "/usr/local/bin/cursor \"$CWD\""
