# Usa una imagen oficial de Python
FROM python:3.11

# Define el directorio de trabajo
WORKDIR /app

# Instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código de Django
COPY . .

# Expone el puerto 8000
EXPOSE 8000

# Comando de inicio
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]