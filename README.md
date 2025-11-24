# Bloomwell: Wellness and Nutrients tracker

## Collaborators
  1. Ketan Patil 25M0788
  2. Md Noman 25M0795
  3. Ajaz Ahmed Shah 25M0842

## Github repository
Repository Link : [https://github.com/kpatil092/bloom-well](https://github.com/kpatil092/bloom-well)

## Project Overview
A simple web-based Health and Wellness Tracker that helps users track and monitor their daily wellbeing activities. The project focuses on building healthy habits by tracking things like meals, water intake, sleep, and mood. 

## Techstack
### Backend (Python)                  
1. **Flask** : Framework for building REST APIs in Python
2. **SQLAlchemy** : ORN manages relational database             
3. **JWT Authentication** : login and session management
4. **PyMongo** : ODM for MongoDB          
5. **Web Scraping (Requests, BeautifulSoup4)** : Scraping and parsing data from remote wetsite
6. **Data Analysis (Pandas)** : Analysing user data using Pandas 

### Frontend (React)
1. **React & React Router Dom** : UI framework and routing system  
2. **Redux Toolkit** : For state management
3. **Axios** : Handle HTTP requests asynchronously

### Databases
1. **PostgreSQL**: Storing structured data for User data and wellness data
2. **MongoDB**: Storing unstructured data after scraping


## Code Organization
The code is organized and managed finely within to main directories: Backend and Frontend, in which code is further organized in the area of work and logic (components).

### Backend Structure
- `/app` : It contains all the backend code and everything outside will be other files and directories (environment, .env, .gitignore)
  * `/app/controllers/` : Directory that encloses the business logic.
    1. `/app/controllers/auth_controllers.py` : Defines login, signup, get_user, update_user controllers.
    2. `/app/controllers/wellness_controllers.py` : Defines get_todays_data, upsert_data, get_range_data controllers.
  * `/app/core/` : Directory that contains the configuration information.
    1. `/app/core/config.py` : Handles enviornment variables. 
    2. `/app/core/db.py` : Initializes the database and ORM, ODM declaration.
    3. `/app/core/security.py`: Define CORS, JWTManager and Api libraries.
  * `/app/model/` : Database schema defination and ORM models.
    1. `/app/model/users_model.py` : Define User model for SQLAlchemy.
    2. `/app/model/wellness_model.py` : Define Wellness model for SQLAlchemy.
  * `/app/routes/` : Routes that defines API endpoints and map them to controllers.
    1. `/app/routes/auth_routes.py` : Define user and auth routes.
    2. `/app/routes/wellness_routes.py` : Define wellness routes.
    3. `/app/routes/meals.py` : Define meals routes and logic.
    4. `/app/routes/nutritions.py` : Define nutritions routes and logic.
  * `/app/services/`: Directory enclosed other services used(scraping and analysis)
    1. `/app/service/wellness_analysis.py` : Handles external web scraping logic.
    2. `/app/service/scraper_service.py` : Computes insights using Pandas
  * `/app/utils/` : Helper functions that are used in other files
    1. `/app/utils/user_utils.py` : Define hashing and dehashing helpers.
    2. `/app/utils/wellness_utils.py` : Define backfill logic.
  * `/app/main.py` : Backend entrypoint for application initialization
  * `requirements.txt` : Python dependencies
  * `.env` : Environment variables


### Frontend Structure
- `/src` : This contain the entire frontend application, like pages, components, routing etc.
  * `/src/components/` : Directory contains all the components used in the application.
    1. `/src/components/SearchBox.jsx`:- This contain a search bar. When a user search for food. It make a API call to backend to scrap the nutrients for food.
    2. `/src/components/FoodCard.jsx`:- It is used to display the nutrients of food searched by the user. It let the user choose to select the quantity and weight for the food.
    3. `/src/components/TodayMeals.jsx`:- It is used to display all the meal intakes by the user for today and the nutrients.
    4. `/src/Footer.jsx`:- It is user to display the footer for the website.
    5. `/src/components/MetricCard.jsx`:- Contains the card component used to collect wellness metrics like sleep, steps, etc.
    6. `/src/components/Navbar.jsx`:- It display a navbar at the top of website used to navigate between the pages like dashboard, nutrition, wellness, profile.
  * `/src/pages/` : This directory contains all the pages for entire application.
    1. `/src/pages/Dashboard.jsx`: Insight and analytic page, used to display the visulization of users activity for the past 7/15/30 days.
    2. `/src/pages/Home.jsx`: Main landing page, displays the components depending on whether the user logged in or not.
    3. `/src/pages/Login.jsx`: It takes the user's username and password and takes the user to home page on successful login.
    4. `/src/pages/Nutritions.jsx`: It is the main page of nutrition tracking. Manage everything like searching of food, display the nutrients, adding and deleting etc.
    5. `/src/pages/Profile.jsx`: Used to manage the logged in user's personal information.
    6. `/src/pages/SignUp.jsx`: It is used to create the new account for user by collecting the user details like username, email and password.
    7. `/src/pages/Wellness.jsx`: Contains the daily wellness metrics component cards for sleep, steps, activities, height, weights, etc. to manage the user's daily activities.
  * `/src/routes/` : This directory contains the file that define the users to move through the application.
    1. `/src/routes/AppRoutes.jsx`: It defines all the frontend routes of the application.
  * `/src/services/`: Directory enclosed all the files responsible for the API calls to communicate with backends.
    1. `/src/services/api.js`: This file creates pre-configured Axios instance used for all API calls across the frontend.
    2. `/src/services/authService.js`: This file contain all the api calls related to authentication.
    3. `/src/services/nutrition.js`: Contains all the api calls for searching the nutrients, adding meal, deleting meal, and fetching the meals.
    4. `/src/services/wellnessService.js`: This file contain all the api calls related to wellness metrics.
  * `App.jsx` : The root React component responsible for defining the layout and wrapping the entire application UI.
  * `Main.jsx` : The entry point of the frontend.s


## Code Execution
1. Ensure you are on root directory.

2. In backend
  - Move to backend 
    ```
    cd backend 
    ```
  - Create and activate python virtual environment
    ```
    python3 -m venv venv
    source venv/bin/activate
    ```
  - Install dependecies
    ```
    pip install -r requirements.txt
    ```
  - Set up environment variables (format given in .env.example)

  - Run backend server
    ```
    python3 -m app.main
    ```

3. In frontend
  - Navigate to frontend
    ```
    cd ../frontend
    ```
  - Install dependecies
    ```
    npm install
    ```
  - Run the frontend
    ```
    npm run dev
    ```


