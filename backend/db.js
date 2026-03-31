import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

async function testConnection() {
  try {
    await pool.execute('SELECT 1')
    console.log('Database connected')
  } catch (err) {
    console.error('Database connection failed:', err.message)
    process.exit(1)
  }
}

testConnection()

export default pool
