const express = require('express')
const path = require('path')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'expenseTracker.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000/")
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}



const createTables = async () => {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT
      );
  
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        category TEXT,
        amount REAL,
        date TEXT,
        description TEXT
      );
    `)
  }
  
  initializeDBAndServer().then(createTables)

  app.post('/transactions', async (request, response) => {
    const { type, category, amount, date, description } = request.body
    const addTransactionQuery = `
      INSERT INTO transactions (type, category, amount, date, description)
      VALUES ("${type}", "${category}", ${amount}, "${date}", "${description}");
    `
    await db.run(addTransactionQuery)
    response.status(200).send("Transaction added successfully!")
  })
  
  app.get('/transactions/:id', async (request, response) => {
    const { id } = request.params
    const getTransactionQuery = `SELECT * FROM transactions WHERE id = ${id};`
    const transaction = await db.get(getTransactionQuery)
    
    if (transaction) {
      response.send(transaction)
    } else {
      response.status(404).send("Transaction not found")
    }
  })

  app.put('/transactions/:id', async (request, response) => {
    const { id } = request.params
    const { type, category, amount, date, description } = request.body
    const updateTransactionQuery = `
      UPDATE transactions
      SET type = "${type}", category = "${category}", amount = ${amount}, 
          date = "${date}", description = "${description}"
      WHERE id = ${id};
    `
    await db.run(updateTransactionQuery)
    response.send("Transaction updated successfully!")
  })

  app.delete('/transactions/:id', async (request, response) => {
    const { id } = request.params
    const deleteTransactionQuery = `DELETE FROM transactions WHERE id = ${id};`
    await db.run(deleteTransactionQuery)
    response.send("Transaction deleted successfully!")
  })

  app.get('/summary', async (request, response) => {
    const summaryQuery = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpenses,
        SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
      FROM transactions;
    `
    const summary = await db.get(summaryQuery)
    response.send(summary)
  })
  