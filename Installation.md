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
