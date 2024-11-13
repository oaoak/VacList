## Project Setup

Follow these steps to set up the project and install the necessary dependencies:

### 1. Clone the Repository
If you haven’t cloned the project yet, run the following command in your terminal:

```
git clone <repository_url>
cd <project_directory>
```

### 2. Install Node.js (If not already installed)
If you don't have Node.js installed, follow these steps:

For Windows/macOS:
Download and install the latest LTS version from the Node.js official website.

Once installed, verify the installation with:

```
node -v
npm -v
```

## Set Up MySQL (Locally or with Docker)
### Option 1: Install MySQL Locally
Download MySQL from the MySQL website, then follow the installation steps for your OS.

After installation, start MySQL:

```
mysql.server start
```

Log into MySQL:

```
mysql -u root -p
```
Enter the password you set during the MySQL installation.

### Option 2: Use Docker for MySQL
If you prefer to run MySQL inside a Docker container, follow these steps:

Pull MySQL Docker Image: Run the following command to pull the latest MySQL Docker image:

```
docker pull mysql:latest
```

Start MySQL in a Docker Container: Once the image is pulled, run MySQL in a Docker container with the following command:

```
docker run --name mysql-container -e MYSQL_ROOT_PASSWORD=root -d -p 3306:3306 mysql:latest
```

* --name mysql-container: This gives the container a name mysql-container.
* -e MYSQL_ROOT_PASSWORD=root: This sets the MySQL root password to root. You can change this value if desired.
* -d: This runs the container in detached mode.
* -p 3306:3306: This maps port 3306 on your local machine to port 3306 in the container (MySQL’s default port).
  
Access MySQL in the Docker Container: Once the container is running, you can access MySQL by executing the following command:

```
docker exec -it mysql-container mysql -u root -p
```
Enter the password (root in this case, or whatever you set in step 2) when prompted.

## Database Setup

Follow these steps to set up the database for the backend:

1. **Create `.env` File**
   - In the **backend** directory, create a `.env` file (if it doesn't already exist).

2. **Configure Database URL**
   - Add the following line to your `.env` file to define the database connection string:
     ```env
     DATABASE_URL="mysql://root:Oak12345@localhost:3306/vaclist"
     ```
     - Replace `Oak12345` with your actual MySQL root password.
     - If you're using a different MySQL user, adjust the `root` to that user's name.

3. **Install Dependencies**
   - Open a terminal in the **backend** directory and run:
     ```bash
     npm install
     ```
     This will install all the dependencies defined in your `package.json` file.

4. **Run Prisma Migration**
   - To apply your database schema, run:
     ```bash
     npx prisma migrate dev
     ```
     This will:
     - Apply any pending migrations to your MySQL database.
     - Create the necessary tables based on your Prisma schema.

5. **Generate Prisma Client**
   - After running the migration, generate the Prisma Client by running:
     ```bash
     npx prisma generate
     ```
     This step ensures that Prisma can access your schema and interact with your database from your code.

6. **Verify in MySQL Workbench**
   - Open **MySQL Workbench** and connect to your MySQL instance (`localhost:3306`).
   - Navigate to the `vaclist` database and check if the tables defined in your Prisma schema were created.
   - You should see the tables corresponding to your models.
