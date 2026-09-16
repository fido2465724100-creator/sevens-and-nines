#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=========================================================="
echo " Публикация Sevens and Nines в Snap Store"
echo "=========================================================="
echo ""

# 1. Проверка snapcraft
if ! command -v snapcraft &> /dev/null; then
    echo "[Шаг 1/3] Утилита snapcraft не найдена. Устанавливаем..."
    echo "Потребуется ввести пароль sudo от вашего компьютера:"
    sudo snap install snapcraft --classic
    echo "Snapcraft успешно установлен!"
    echo ""
else
    echo "[Шаг 1/3] Snapcraft уже установлен."
    echo ""
fi

# 2. Проверка логина snapcraft
echo "[Шаг 2/3] Авторизация в Snap Store (Ubuntu One)..."
echo "Введите email и пароль от вашего аккаунта snapcraft.io:"
snapcraft login

echo ""
echo "[Шаг 3/3] Загрузка пакета sevens-and-nines в магазин..."
snapcraft upload release/sevens-and-nines_1.0.0_amd64.snap --release=stable

echo ""
echo "=========================================================="
echo " УСПЕШНО ЗАГРУЖЕНО!"
echo " Теперь перейдите в браузер на вкладку 'My published snaps'"
echo " и обновите страницу."
echo "=========================================================="
echo "Нажмите Enter, чтобы закрыть это окно..."
read -r
