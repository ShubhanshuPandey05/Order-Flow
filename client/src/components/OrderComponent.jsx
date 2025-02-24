import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLoading } from "../context/LoadingContext";

export default function UserComponent() {

  const authUser = JSON.parse(localStorage.getItem("authUser")) || {
    contactPersonName: "",
    contactNo: "",
    companyName: "",
    userType: ""
  };

  const [contactPersonName] = useState(authUser.ContactPersonName || "");
  const [contactNo] = useState(authUser.MobileNo || "");
  const [companyName] = useState(authUser.Companyname || "");
  const [userType] = useState(authUser.userType || "");
  const [GSTIN] = useState(authUser.GSTIN || "");
  const [city] = useState(authUser.city || "");
  const [customerName, setCustomerName] = useState("");
  const [customerMobileno, setCustomerMobileno] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [requirementType, setRequirementType] = useState("");
  const [items, setItems] = useState([
    { name: "", unit: "", quantity: "", rate: "", amount: "", itemNote: "" },
  ]);
  const [licenseType, setLicenseType] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  // const [dispatchThrough, setDispatchThrough] = useState("");
  // const [dueDays, setDueDays] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [itemOptions, setItemOptions] = useState([]);
  const { showLoading, hideLoading } = useLoading();



  useEffect(() => {
    async function fetchItems() {
      try {
        showLoading();
        const response = await fetch("http://localhost:8000/api/get-order-items", {
          // const response = await fetch("/api/get-order-items", {
          // const response = await fetch("https://order-flow-api-ek8r.onrender.com/api/get-order-items", {
          // const response = await fetch("https://order-flow-api.vercel.app/api/get-order-items", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        // console.log(data);
        setItemOptions(data.data.map((item) => item["Item Name"]));
        hideLoading();

      } catch (error) {
        console.error("Error fetching item names:", error);
        toast.error('No items fetched try again later')
        let token = getCookie("jwt")
        if (!token) {
          localStorage.removeItem("authUser");
          window.location.reload();
        }
        hideLoading();
      }
    }
    fetchItems();
  }, []);


  const units = ["Nos"];

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "rate") {
      const quantity = updatedItems[index].quantity;
      const rate = updatedItems[index].rate;
      updatedItems[index].amount = quantity && rate ? (quantity * rate).toFixed(2) : "";
    }

    setItems(updatedItems);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", unit: "", quantity: "", rate: "", amount: "", itemNote: "" }]);
  };

  const handleRemoveItem = (index) => {
    if (index != 0) {
      setItems(items.filter((_, i) => i !== index));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    try {
      // const response = await fetch("https://order-flow-api.vercel.app/api/update-spreadsheet", {
      // const response = await fetch("/api/update-spreadsheet", {
      // const response = await fetch("https://order-flow-api-ek8r.onrender.com/api/update-spreadsheet", {
      const response = await fetch("http://localhost:8000/api/update-spreadsheet", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType, companyName, GSTIN, contactPersonName, contactNo, city, customerName, customerMobileno, businessType, requirementType, items, licenseType, licenseNo, orderNote }),
        credentials: 'include',
      });

      if (response.ok) {
        setItems([{ name: "", quantity: "", rate: "", amount: "", itemNote: "" }]);
        setBusinessType("");
        setRequirementType("");
        setCustomerName("");
        setCustomerMobileno("");
        setLicenseNo("");
        setLicenseType("");
        // setDispatchThrough("");
        // setDueDays("");
        setOrderNote("")
        setShowSuccessModal(true);
      } else {
        const jwt = getCookie('jwt');
        if (!jwt) {
          localStorage.removeItem("authUser");
          window.location.reload();
          toast.error("Please login again");
        }
      }
      setShowConfirmModal(false)
    } catch (error) {
      console.error("Error updating spreadsheet:", error);
      setShowConfirmModal(false)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 pb-14">
      <div className="p-6 w-full max-w-6xl min-h-screen">
        <h1 className="text-4xl font-semibold md:font-bold text-center">
          JSR Prime Solution
        </h1>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-500 mt-3 text-center md:font-bold">
          Order Flow
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Customer Info */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <input
                type="hidden"
                readOnly
                value={companyName}
                className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-100 text-gray-700"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="hidden"
                readOnly
                value={contactPersonName}
                className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-100 text-gray-700"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="hidden"
                readOnly
                value={"+91 " + contactNo}
                className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-100 text-gray-700"
              />
            </div>
          </div>
          <div className="md:grid-cols-2 grid gap-2">
            <input
              type="text"
              name="customerName"
              id="customerName"
              value={customerName}
              placeholder="Customer Name"
              onChange={((e) => { setCustomerName(e.target.value) })}
              className="border-gray-300 rounded-md p-2 border col-span-1 "
            />
            <input
              type="text"
              name="customerMobileno"
              id="customerMobileno"
              value={customerMobileno}
              placeholder="Mobile No."
              onChange={((e) => { setCustomerMobileno(e.target.value) })}
              className="border-gray-300 rounded-md p-2 border col-span-1 "
            />
            <input type="text" name="businessType" placeholder="Business Type" id="businessType" value={businessType} onChange={((e) => { setBusinessType(e.target.value) })} className="border-gray-300 rounded-md p-2 border col-span-1" />
            <select name="requirementType" id="" className="border-gray-300 rounded-md p-2 border col-span-1" value={requirementType} onChange={((e)=>{setRequirementType(e.target.value)})}  required>
              <option value="">Requirement Type *</option>
              <option value="Ready Add-on">Ready Add-on</option>
              <option value="Ready Module">Ready Module</option>
              <option value="New Customization">New Customization</option>
            </select>

          </div>


          {/* Items Section */}
          <div className="mb-6 mt-3">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Item Details</h2>
            {items.map((item, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-6 sm:items-center bg-gray-200 p-2 rounded-md mb-4">
                {/* Item Name */}
                <div className="col-span-6 sm:col-span-2">
                  <select
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    className="border-gray-300 rounded-md p-2 w-full"
                  >
                    <option value="">Select Add On / Customizations *</option>
                    {itemOptions.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value="Other">Not listed here</option>
                  </select>
                </div>

                {/* Unit, Qty, Rate */}
                <div className="grid grid-cols-3 gap-2 col-span-6 sm:col-span-3">
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                    className="border-gray-300 rounded-md p-2"
                  >
                    <option value="">Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Qty *"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="border-gray-300 rounded-md p-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                    className="border-gray-300 rounded-md p-2"
                  />
                </div>

                {/* Amount and Delete Button */}
                <div className="grid grid-cols-3 items-center gap-2 col-span-6 sm:col-span-1">
                  <input
                    type="text"
                    readOnly
                    placeholder="Amount"
                    value={item.amount}
                    className="col-span-2 border-gray-300 bg-gray-100 rounded-md p-2 border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="flex justify-center items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500 hover:text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-1 14H6L5 7m5-3h4m-4 0a1 1 0 00-1 1v1h6V5a1 1 0 00-1-1h-4zm-2 4h8m-5 4h2m-2 4h2"
                      />
                    </svg>
                  </button>
                </div>
                <div className="col-span-6">
                  <textarea name="itemNote" id="itemNote" value={item.itemNote} onChange={(e) => handleItemChange(index, "itemNote", e.target.value)} className="w-full col-span-6 h-[80px] p-2 rounded-md" placeholder="Requirement Note"></textarea>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              + Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <select name="LicenseType" id="LicenseType"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="border-gray-300 rounded-md p-2 w-full">
                <option value="">License Type</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Auditor">Auditor</option>
              </select>
            </div>
            <div className="col-span-1">
              <input
                type="number"
                placeholder="License No."
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="border-gray-300 rounded-md p-2 border w-full"
                minLength={9}
                maxLength={9}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1 sm:col-span-2">
              <textarea
                name="itemNote"
                id="itemNote"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="w-full h-[80px] p-2 rounded-md"
                placeholder="Remark"
              ></textarea>
            </div>
          </div>


          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Confirm Your Order</h2>
            <p className="text-gray-600">Are you sure you want to place this order?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 w-20"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-20"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Successfully Placed</h2>
            <p className="text-gray-600">Your order has been placed successfully!</p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
