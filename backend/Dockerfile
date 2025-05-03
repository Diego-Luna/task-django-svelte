FROM python:3.13.3-bullseye

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

# Esta línea es opcional ya que docker-compose.yml especifica un comando
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]