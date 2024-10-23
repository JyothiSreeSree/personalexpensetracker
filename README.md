Overview
  The Personal Expense Tracker is a web application designed to help users track their personal expenses efficiently. The app allows users to add, edit, delete, and categorize expenses, helping them monitor their financial activities over time.

Set up and installation:
  1.Clone the repository:
    git remote add origin https://github.com/JyothiSreeSree/personalexpensetracker.git
  2.Install dependencies:
    npm install
  3.Run the application locally:
    node app.js
  4.Access the app by navigating to http://localhost:3000 in your browser.

API endpoints:

  - `POST /transactions`: Adds a new transaction (income or expense).
  - `GET /transactions`: Retrieves all transactions.
  - `GET /transactions/:id`: Retrieves a transaction by ID.
  - `PUT /transactions/:id`: Updates a transaction by ID.
  - `DELETE /transactions/:id`: Deletes a transaction by ID.
  - `GET /summary`: Retrieves a summary of transactions, such as total income, total expenses, and balance. Optionally, this can be filtered by date range or category.

