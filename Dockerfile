version: "3.8"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DEBUG=0
      - VITE_HTTP_URL=http://backend:8000
      - VITE_WS_URL=ws://backend:8000

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3039:3039"
    environment:
      - VITE_HTTP_URL=http://backend:8000
    depends_on:
      - backend