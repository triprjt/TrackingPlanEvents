# TrackingPlanEvents

This application is built for the problem statement given here: https://rudderstacks.notion.site/Full-Stack-SDE-2-THA-25f2da47127944fd971296b126fad5de

Here is the process to run it locally:

Using Docker:
* git clone repo
* Inside the parent directory i.e. TrackingPlanEvents/, docker-compose.yml file is there
* run docker-compose build
* docker-compose up
* Now go to the page http://127.0.0.1/

Using local virtal environment:
* Be in the parent directory i.e. TrackingPlanEvensts/
* Create virtal environment: python3 -m venv alps
* Activate virtual environment: source alps/bin/activate

* Start Backend:
** cd backend
** run pip install --upgrade pip
** run pip install -r requirements.txt
** run python manage.py runserver
** server is running at http://localhost:8000/

  
* Start frontend:
** cd frontend
** npm install
** npm start
** run python manage.py runserver
** server is running at http://localhost:3000/
