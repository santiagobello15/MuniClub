FROM python:3.11 AS backend
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend/ .
RUN yarn build
EXPOSE 3039
CMD ["yarn", "dev", "--host"]