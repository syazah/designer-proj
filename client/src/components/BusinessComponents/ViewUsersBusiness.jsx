import React, { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../../context/UserAuthProvider";
import { Link } from "react-router-dom";

function ViewUsersBusiness() {
  const [completeData, setCompleteData] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserAuthContext);
  async function GetUserCompleteData() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/business/get-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessID: user._id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCompleteData(data.data);
      } else {
        alert(data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error, Something went wrong while fetching the users");
    }
  }

  useEffect(() => {
    GetUserCompleteData();
  }, []);
  return (
    <div className="w-full h-full overflow-y-scroll">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <img src="/loader.gif" className="w-[100px] h-[100px]" />
        </div>
      ) : (
        <div>
          {completeData.map((item, index) => (
            <div
              className="bg-red-600 h-[130px] border-b-4 border-red-900 flex justify-between items-center"
              key={index}
            >
              <div className="p-2">
                <h1 className="font-medium text-md text-white">
                  <span className="text-black">ID</span> {item._id}
                </h1>
                <h1 className="font-medium text-md text-white">
                  <span className="text-black">Name</span> {item.name}
                </h1>
                <h1 className="font-medium text-md text-white">
                  {" "}
                  <span className="text-black">Email</span> {item.email}
                </h1>
                <h1 className="font-medium text-md text-white">
                  <span className="text-black">Username</span> {item.username}
                </h1>
              </div>
              <Link
                to={`/business/detail/user/${item._id}`}
                className="w-[10%] h-full bg-red-500 cursor-pointer hover:bg-red-600 transition-all duration-300 flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-16"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewUsersBusiness;
