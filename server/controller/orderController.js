import { google } from "googleapis"
import path from "path";
import { fileURLToPath } from "url";

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load service account key file
const SERVICE_ACCOUNT_FILE = path.join(__dirname, "../service-account.json");

// Spreadsheet ID and range to update
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const RANGE = "Sheet1!A1:D1";

// Authenticate with the Google API using Service Account
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const updateOrder = async (req, res) => {
  try {
    // Authenticate and create a Sheets API client
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Get data from request body
    const currentDate = new Date();
    const { contactNo, customerName, items,dispatchThrough, dueDays, orderNote } = req.body; // Example: { values: [["Order123", "John Doe", "Product A", "100"]] }
    const deliveryDate = new Date();
    deliveryDate.setDate(currentDate.getDate() + parseInt(dueDays || 0));
    let formattedDeliveryDate = "";
    if(dueDays > 0){
      formattedDeliveryDate = deliveryDate.toLocaleDateString();
    }

    const rows = items.map((item) => [
      new Date().toLocaleDateString(), // Date
      new Date().toLocaleTimeString(), // Time
      contactNo, // Customer ID (leave empty for now)
      customerName, // Customer Name
      item.name, // Item Name
      item.itemNote||"",
      item.unit || "Unit",
      item.quantity, // Quantity
      item.rate || "", // Rate (optional)
      item.amount || "", // Amount (optional)
      dispatchThrough, // Dispatch Through
      formattedDeliveryDate,
      dueDays,
      orderNote,
      "Pending"
    ]);

    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({ error: "Invalid or missing 'values' array" });
    }

    // Update the spreadsheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE, // Where to append data
      valueInputOption: "RAW", // "RAW" or "USER_ENTERED"
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: rows, // Data to append
      },
    });

    res.status(200).json({
      message: "Spreadsheet updated successfully",
      response,
    });
  } catch (error) {
    console.error("Error updating spreadsheet:", error);
    res.status(500).json({ error: error.message });
  }
};