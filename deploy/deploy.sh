#!/usr/bin/env bash
# Загрузка приложения на сервер по SSH.
#
# Использование:
#   SERVER=user@1.2.3.4 ./deploy/deploy.sh
#   SERVER=user@1.2.3.4 TARGET=/var/www/bim-academy ./deploy/deploy.sh
#
# Копируются только сами файлы приложения: ни .git, ни служебные каталоги.
# Файлы, которых больше нет в репозитории, удаляются и на сервере.

set -euo pipefail

: "${SERVER:?Укажите сервер: SERVER=user@host ./deploy/deploy.sh}"
TARGET="${TARGET:-/var/www/bim-academy}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Проверка данных приложения перед выгрузкой..."
node deploy/check-content.cjs

echo "Выгрузка $ROOT -> $SERVER:$TARGET"
rsync -avz --delete \
  --exclude '.git/' \
  --exclude '.github/' \
  --exclude 'deploy/' \
  --exclude 'docker-compose.yml' \
  --exclude '.env' \
  --exclude '*.md' \
  --exclude 'build-icons.cjs' \
  ./ "$SERVER:$TARGET/"

echo "Готово. Проверьте версию:"
VERSION="$(node -e 'process.stdout.write(require("./version.json").version)')"
echo "  ожидается $VERSION в /version.json на сайте"
