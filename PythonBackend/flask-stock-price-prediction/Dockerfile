FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y build-essential python3-dev gfortran libopenblas-dev libgomp1 ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN  pip install --upgrade pip && pip install -r requirements.txt
COPY . .
EXPOSE 5002
CMD ["python", "app.py"]