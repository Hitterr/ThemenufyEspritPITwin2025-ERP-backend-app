FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y build-essential python3-dev gfortran libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir --only-binary=scipy,scikit-learn -r requirements.txt
COPY . .
EXPOSE 5002
CMD ["flask", "run", "--host=0.0.0.0"]