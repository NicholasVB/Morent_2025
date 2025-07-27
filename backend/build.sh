#!/usr/bin/env bash
set -o errexit

echo "➡️  Переключаемся в /frontend и билдим фронт"
cd frontend
npm install
npm run build

echo "➡️  Копируем билд во внутреннюю папку Django (backend/frontend)"
mkdir -p ../backend/frontend
rm -rf ../backend/frontend/build
cp -r build ../backend/frontend/build

echo "📂 Содержимое backend/frontend после копирования:"
ls -la ../backend/frontend
echo "📂 Содержимое backend/frontend/build:"
ls -la ../backend/frontend/build
echo "📂 Содержимое backend/frontend/build/static:"
ls -la ../backend/frontend/build/static || echo "❌ static не существует"

echo "➡️  Устанавливаем зависимости Python"

cd ../backend
pip install -r requirements-prod.txt

# mkdir -p /media
echo "➡️  collectstatic"

python manage.py collectstatic --no-input
# echo "➡️  migrate"
python manage.py migrate

# echo "➡️  Наполняем БД"
# custome command for filling db 
python manage.py db --clear --fill