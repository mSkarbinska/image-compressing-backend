FROM python:3.11-alpine

WORKDIR /worker

COPY ["requirements.txt", "./"]

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "worker.py"]