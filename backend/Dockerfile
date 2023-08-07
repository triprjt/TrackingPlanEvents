FROM python:3.9

RUN pip install --upgrade pip
WORKDIR /backend

# RUN pip3 install --upgrade pip setuptools wheel
# RUN pip3 install backports.zoneinfo
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

COPY ./entrypoint.sh .

CMD ["python3", "manage.py", "makemigrations"]
CMD ["python3", "manage.py", "migrate"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

# ENTRYPOINT ["sh", "/app/entrypoint.sh"]