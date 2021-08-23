# ALERT: FOR THOSE WHO GOT HERE FROM GOOGLE, THIS IS JUST A SAMPLE APPLICATION, WE DID NOT FORGOT CREDENTIALS ON README

# Client Application

The application consists in 3 parts:

1. docker-compose.yaml used to run database
2. A server application
3. A client application

# Running locally

Starting:
1. Navigate to folder resources/scripts
2. On linux/MacOS machines, give proper permissions to script (chmod +x start.sh stop.sh)
3. Run ./start.sh

Stoping:
1. On the same folder, just run ./stop.sh

# Services

1. A database admin is exposed on port 8080
2. Backend is exposed on port 8081
3. Frontend is exposed on port 8082

# Credentials

Database:
  - database: authority
  - user: pguser
  - password: pgpassword

# Using the Application
  1. The first thing you should do to use the application is register.
  2. The application uses a webservice to fetch the zipcode info. I'm brazilian so i decide to stick with it and i used zipcode in 00000000 format.
  3. If you enter a valid zipcode, the application will retrive things such Street Address, City, State, etc...
