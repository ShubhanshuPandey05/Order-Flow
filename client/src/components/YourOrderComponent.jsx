import React, { useEffect, useState } from "react";

const YourOrder = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser")) || {
    customerName: "",
    contactNo: "",
  };

  const [contactNumber] = useState(authUser.MobileNo || "");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/get-filtered-order/${contactNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [contactNumber]);

  const handleRemoveItem = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Your Orders
      </h2>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {orders.length === 0 && !loading && !error && (
        <p className="text-center text-gray-600">No orders found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-md transition-transform transform"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-black">{order[4]}</h3>
              <div
                className={
                  order[12] === "Pending"
                    ? "text-yellow-400"
                    : order[12] === "Declined"
                    ? "text-red-600"
                    : "text-green-600"
                }
              >
                {order[12]}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 text-gray-700">
              <div className="font-semibold">Date:</div>
              <div>{order[0]}</div>

              <div className="font-semibold">Time:</div>
              <div>{order[1]}</div>

              <div className="font-semibold">Quantity:</div>
              <div>{order[6]}</div>

              <div className="font-semibold">Rate:</div>
              <div>{order[7]}</div>

              <div className="font-semibold">Amount:</div>
              <div>{order[8]}</div>

              <div className="font-semibold">Dispatch:</div>
              <div>{order[9]}</div>

              <div className="font-semibold">Delivery Date:</div>
              <div>{order[10]}</div>

              <div className="flex justify-between items-center col-span-2 mt-4">
                <div className="font-semibold">Due Days:</div>
                <div>{order[11]}</div>
                {order[12]==="Pending"? <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    transform="scale(1.1)"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-1 14H6L5 7m5-3h4m-4 0a1 1 0 00-1 1v1h6V5a1 1 0 00-1-1h-4zm-2 4h8m-5 4h2m-2 4h2"
                    />
                  </svg>
                </button>:""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourOrder;
