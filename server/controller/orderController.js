import { google } from "googleapis"
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();


// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key file
// const SERVICE_ACCOUNT_FILE = path.join(__dirname, "../service-account.json");

// Spreadsheet ID and range to update
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const RANGE = "Orders!A1:Z1";

// Authenticate with the Google API using Service Account
const serviceAccountCredentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const auth = new google.auth.GoogleAuth({
  // keyFile: SERVICE_ACCOUNT_FILE,
  credentials: serviceAccountCredentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});


export const updateOrder = async (req, res) => {
  try {
    // Authenticate and create a Sheets API client
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Get data from request body
    // const currentDate = new Date();
    const { userType, companyName, GSTIN, contactPersonName, contactNo, city, customerName, customerMobileno, businessType, requirementType, items, licenseType, licenseNo, orderNote } = req.body; // Example: { values: [["Order123", "John Doe", "Product A", "100"]] }
    // const deliveryDate = new Date();
    // deliveryDate.setDate(currentDate.getDate() + parseInt(dueDays || 0));
    // console.log(companyName);

    // let formattedDeliveryDate = "";
    // if (dueDays > 0) {
    //   formattedDeliveryDate = deliveryDate.toLocaleDateString();
    // }

    const options = {
      timeZone: 'Asia/Kolkata', // IST time zone
      hour12: true, // Optional, for 12-hour format
    };

    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `Orders!A:A`, // Get the SR NO column
    });

    const existingRows = getResponse.data.values || [];
    let lastSRNo = 0;

    if (existingRows.length > 1) {
      // Get the last SR NO and timestamp from the last row
      const lastRow = existingRows[existingRows.length - 1];
      lastSRNo = parseInt(lastRow[0]) || 0; // SR NO is in the third column (index 2)
    }

    let srNo = lastSRNo;

    const rows = items.map((item) => {
      srNo++;
      return [
        srNo,
        new Date().toLocaleDateString('en-IN', options), // Date
        new Date().toLocaleTimeString('en-IN', options), // Time
        userType,
        companyName,
        GSTIN,
        contactPersonName,
        contactNo,
        city,
        customerName,
        customerMobileno,
        businessType,
        requirementType,
        item.name, // Item Name
        item.itemNote || "",
        item.quantity, // Quantity
        item.unit || "Unit",
        item.rate || "", // Rate (optional)
        item.amount || "", // Amount (optional)
        // dispatchThrough, // Dispatch Through
        licenseNo,
        licenseType,
        orderNote,
        "",
        "",
        // formattedDeliveryDate,
        // dueDays,
        "Pending"
      ]
    });

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