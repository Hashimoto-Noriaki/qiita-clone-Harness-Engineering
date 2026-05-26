#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

# gh コマンドは除外
if echo "$COMMAND" | grep -q "^gh "; then
  exit 0
fi

# git commitは除外
if echo "$COMMAND" | grep -q "^git commit"; then
  exit 0
fi

# 本番環境への直接操作をブロック
if echo "$COMMAND" | grep -q "production"; then
  echo "本番環境への直接操作は禁止されています"
  exit 2
fi

exit 0
