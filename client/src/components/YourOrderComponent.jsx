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
        // const response = await fetch(`/api/get-filtered-order/${contactNumber}`,
        const response = await fetch(`https://order-flow-api-ek8r.onrender.com/api/get-filtered-order/${contactNumber}`,
        // const response = await fetch(`https://order-flow-api.vercel.app/api/get-filtered-order/${contactNumber}`,
        // const response = await fetch(`http://localhost:8000/api/get-filtered-order/${contactNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.log(error, "hii");

          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.data);

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
        My Orders
      </h2>
      <div className="h-16 w-16 flex-col bg-green-100 shadow-lg fixed z-50 top-4 right-4 rounded-3xl flex justify-center items-center">
        <div className=" text-[0.7rem] font-extrabold">Orders</div>
        <div className="font-bold">{orders.length}</div>
      </div>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {orders.length === 0 && !loading && !error && (
        <p className="text-center text-gray-600">No orders found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-md duration-300 transform hover:-translate-y-2"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-800">{order[5]}</h3>
              <div
                className={`text-sm font-semibold px-3 py-1 rounded-full shadow-md ${order[15] === "Pending"
                    ? "bg-yellow-100 text-yellow-500"
                    : order[15] === "Declined"
                      ? "bg-red-100 text-red-500"
                      :"bg-green-100 text-green-500"
                  }`}
              >
                {order[15]}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-y-4 text-gray-700">
              <div className="italic col-span-3 -mt-2">{order[6]}</div>

              <div className="font-semibold">Order Date</div>
              <div className="col-span-2">{" : "+order[0]}</div>

              <div className="font-semibold">Quantity</div>
              <div className="col-span-2 font-semibold">{" : "+order[8]}</div>

              <div className="font-semibold">Rate</div>
              <div className="col-span-2">{" : "+order[9]}</div>

              <div className="font-semibold">Amount</div>
              <div className="col-span-2 font-bold text-blue-600">{" : "+order[10]}</div>

              <div className="font-semibold">Dispatch by</div>
              <div className="col-span-2">{" : "+order[11]}</div>

              <div className="font-semibold">Delivery Dt</div>
              <div className="col-span-2">{" : "+order[12]}</div>

              <div className="font-semibold">Remark</div>
              <div className="col-span-2 italic text-gray-500">{" : "+order[14]}</div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default YourOrder;
