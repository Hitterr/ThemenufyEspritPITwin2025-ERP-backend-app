FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y build-essential python3-dev gfortran libopenblas-dev libgomp1 ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN python -m pip install --upgrade pip \
    && pip install --default-timeout=300 --retries 10 --no-cache-dir -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --trusted-host pypi.tuna.tsinghua.edu.cn --use-deprecated=legacy-resolver
COPY . .
EXPOSE 5002
CMD ["flask", "run", "--host=0.0.0.0"]