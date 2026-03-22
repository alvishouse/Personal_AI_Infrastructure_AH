FROM python:3.12-slim

WORKDIR /app

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY *.py ./
COPY profiles.json ./

# Data dir for SQLite (mount as volume in production)
RUN mkdir -p /app/data

CMD ["python", "main.py"]
