# TrackingPlanEvents

This application is built for the problem statement given here: https://rudderstacks.notion.site/Full-Stack-SDE-2-THA-25f2da47127944fd971296b126fad5de

Here is the process to run it locally:

Using Docker(having some errors):

1. git clone repo
2. Inside the parent directory i.e. TrackingPlanEvents/, docker-compose.yml file is there
3. run docker-compose build
4. docker-compose up
5. Now go to the page http://127.0.0.1/

Using local virtal environment:

1. Be in the parent directory i.e. TrackingPlanEvensts/
2. Create virtal environment: python3 -m venv alps
3. Activate virtual environment: source alps/bin/activate
4. Start Backend
   - cd backend
   - run pip install -r requirements.txt
   - run python manage.py runserver
   - server is running at http://localhost:8000/
5. Start frontend
   - cd frontend
   - npm install
   - npm start
   - server is running at http://localhost:3000/

Now the app is running at http://localhost:3000/
