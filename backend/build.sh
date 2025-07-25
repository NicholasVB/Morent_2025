#!/usr/bin/env bash
set -o errexit

cd frontend
npm install
npm run build

cd ../backend
pip install -r requirements-prod.txt

mkdir -p /media

python manage.py collectstatic --no-input
python manage.py migrate

# custome command for filling db 
python manage.py db --clear --fill