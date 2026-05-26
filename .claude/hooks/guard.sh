#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || echo "")

# コマンドが空の場合はスキップ
if [ -z "$COMMAND" ]; then
  exit 0
fi

# git commitは除外する
if echo "$COMMAND" | grep -q "^git commit"; then
  exit 0
fi

if echo "$COMMAND" | grep -q "production"; then
  echo "本番環境への直接操作は禁止されています"
  exit 2
fi

exit 0
