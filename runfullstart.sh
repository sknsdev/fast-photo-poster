#!/bin/bash

# Отображаем текущее расположение скрипта
script_path="$( cd "$(dirname "$0")" ; pwd -P )"
echo "Открытие папки с проектом: $script_path"

echo "Установка зависимостей..."
# Выполняем команду npm install
npm install

echo "Запуск приложения"
# Вызываем команду npm run dev
npm run dev