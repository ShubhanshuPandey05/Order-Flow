import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const SERVICE_ACCOUNT_FILE = path.join(__dirname, "../service-account.json");


const serviceAccountCredentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const auth = new google.auth.GoogleAuth({
  // keyFile: SERVICE_ACCOUNT_FILE,
  credentials: serviceAccountCredentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = "Orders";
const SHEET_NAME2 = "AddOnList";

export const getFilteredRows = async (req, res) => {
  const { contact } = req.params;

  // console.log(contact);
  

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });


    const rows = result.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }

    const headers = rows[0];
    // console.log(headers);
    
    const contactIndex = headers.indexOf("Regd. Mobile No.");

    if (contactIndex === -1) {
      return res.status(500).json({ message: "Contact no. column not found." });
    }

    const filteredRows = rows.slice(1).filter((row) => row[contactIndex] === contact);

    if (filteredRows.length === 0) {
      return res.status(404).json({ message: "No data found for the provided contact number." });
    }
    // console.log(filteredRows)

    res.json({ data: filteredRows });
  } catch (error) {
    console.error("Error reading Google Sheets:", error);
    res.status(500).json({ error: "Failed to read the Google Sheet." });
  }
};


export const getOrderItems = async (req, res) => {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME2,
    });

    const rows = result.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }

    // Get headers from the first row
    const headers = rows[0];

    // Convert rows to objects for better readability
    const orders = rows.slice(1).map((row) => {
      return headers.reduce((acc, header, index) => {
        acc[header] = row[index] || "";
        return acc;
      }, {});
    });

    res.json({ data: orders });
  } catch (error) {
    console.error("Error reading Google Sheets:", error);
    res.status(500).json({ error: "Failed to read the Google Sheet." });
  }
};

