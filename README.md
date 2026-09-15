# Privy Policies PoC Setup

## Requirements
* Node.js  
* PostgreSQL
* Chromium-based browser

---

## 1. Database Configuration
1. Open PostgreSQL/pgAdmin and create a new database named `privy_poc`.
2. Run the priv_schema.sql script found in api

## 2. API Server
1. Open terminal and navigate to the `api/` directory.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the `api/` folder and add your database password:
    ```text
    DB_PASSWORD=your_postgres_password
    ```
4. Start the server:
    ```bash
    npm start
    ```

## 3. Extension Installation
1. Go to `chrome://extensions` in your browser.
2. Enable Developer mode
3. Click Load unpacked and select the `extension/` folder from this repository.

## Usage
With the API running (`npm start`), navigate to any webpage, open the Privy Policies extension, and click **Scan & Highlight Policy**.