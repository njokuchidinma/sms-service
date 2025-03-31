# sms-service
# SMS Service API

This is a microservice API that handles inbound and outbound SMS using Redis and PostgreSQL. The API includes input validation, authentication, caching, and rate limiting.

## 📋 Features
- Basic Authentication using `username` and `auth_id`
- Inbound and Outbound SMS endpoints
- Input validation
- Redis caching for STOP requests
- Rate limiting for outbound SMS
- Dockerized environment for easy setup
- Unit and Integration Tests using `node:test`

##Server Url
Url for live server: https://sms-service-production-0d86.up.railway.app
Url for Inbound sms: https://sms-service-production-0d86.up.railway.app/inbound/sms/
Url for Outbound sms: https://sms-service-production-0d86.up.railway.app/outbound/sms/

## 🚀 **Getting Started**

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed
- [Postman](https://www.postman.com/downloads/) for API testing


## 🛠️ **Setup Instructions**

### 1. Clone the Repository

https://github.com/your-repo/sms-service.git
cd sms-service


### 2. Configure Environment Variables
Create a `.env` file in the root directory using the provided `.env.example` as a template:

cp .env.example .env

Update the values as needed:

PORT=8000
DB_HOST=postgres
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=adminpassword
DB_NAME=sms_service
REDIS_HOST=redis
REDIS_PORT=6379


### 3. Start Services Using Docker
Ensure Docker is running, then run:

docker-compose up --build

- PostgreSQL will be available on `localhost:5432`
- Redis will be available on `localhost:6379`
- API will run on `http://localhost:8000`



## 🧑‍💻 **Database Setup**

### 1. Load Data from SQL Dump
If you have an SQL dump file (e.g., `data.sql`) containing the database schema and data, load it into PostgreSQL using Docker:


docker exec -i sms-service-postgres-1 psql -U admin -d sms_service < data.sql


### 2. Verify Data Load
You can verify the tables and data by connecting to PostgreSQL:


docker exec -it sms-service-postgres-1 psql -U admin -d sms_service


Run the following SQL commands:

\dt -- List tables
SELECT * FROM account;
SELECT * FROM phone_number;



## 🧪 **Running Tests**

### 1. Run Unit Tests

docker exec -it sms-service-app-1 sh
node --test tests/controllers/smsController.test.js


### 2. Run Integration Tests

node --test tests/integration/smsRoutes.test.js


---

## 📡 **API Endpoints**

### 1. **Inbound SMS**
- **URL:** `POST /inbound/sms/`
- **Authentication:** Basic Auth (username and auth_id)
- **Request Body:**

{
  "from": "4924195509198",
  "to": "4924195509196",
  "text": "Hello"
}

- **Success Response:**

{
  "message": "inbound sms ok",
  "error": ""
}

- **Error Responses:**

{ "message": "", "error": "from is missing" }
{ "message": "", "error": "to parameter is not found" }


### 2. **Outbound SMS**
- **URL:** `POST /outbound/sms/`
- **Authentication:** Basic Auth (username and auth_id)
- **Request Body:**

{
  "from": "4924195509198",
  "to": "4924195509196",
  "text": "Hello"
}

- **Success Response:**

{
  "message": "outbound sms ok",
  "error": ""
}

- **Error Responses:**

{ "message": "", "error": "sms from <from> to <to> blocked by STOP request" }
{ "message": "", "error": "limit reached for from <from>" }



## 🛑 **Handling Errors**
- Invalid input or missing parameters return `400` status code.
- Authentication errors return `403`.
- Unexpected errors return `500`.



## 🧹 **Troubleshooting**

1. **Check Docker Logs**:

docker-compose logs -f app

2. **Restart Containers**:

docker-compose down
docker-compose up --build

3. **Access Redis**:

docker exec -it sms-service-redis-1 redis-cli

4. **Access PostgreSQL**:

docker exec -it sms-service-postgres-1 psql -U admin -d sms_service


---

## 🏁 **Conclusion**
You’re all set to run and test the SMS service API. If you have any issues, check the logs using Docker or verify your API requests using Postman.



