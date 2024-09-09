import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../Loading";

function BusinessDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [completeData, setCompleteData] = useState(null);
  //   GET COMPLETE USER DETAIL
  async function getCompleteBusinessDetail() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/business-detail-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCompleteData(data.data);
      } else {
        alert("Error", data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  }
  useEffect(() => {
    getCompleteBusinessDetail();
  }, []);
  return (
    <div className="w-full bg-zinc-900 text-white">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full h-full p-4 flex flex-col gap-4">
          {/* USER DETAILS  */}
          <div className="w-full p-4 bg-zinc-950 rounded-xl flex flex-col">
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Name</h1>
              <h1 className="text-lg text-white">{completeData?.name}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Email</h1>
              <h1 className="text-lg text-white">{completeData?.email}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Business Code</h1>
              <h1 className="text-lg text-white">
                {completeData?.businessCode}
              </h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Number</h1>
              <h1 className="text-lg text-white">{completeData?.number}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Address</h1>
              <h1 className="text-lg text-white">{completeData?.address}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Tier</h1>
              <h1 className="text-lg text-white">{completeData?.tier}</h1>
            </div>
            <div className="w-full flex gap-2">
              <h1 className="text-lg text-red-600">Clients Created</h1>
              <h1 className="text-lg text-white">
                {completeData?.clientsCreated.length}
              </h1>
            </div>
          </div>

          {/* COLLECTION DETAILS  */}
          <div className="w-full bg-zinc-950 p-4 flex flex-col justify-start items-start gap-4">
            <h1 className="text-2xl text-red-600 border-b-[2px] border-red-600">
              Clients
            </h1>
            {completeData?.clientsCreated?.map((item, index) => (
              <div
                key={index}
                className="w-full p-2 bg-red-800 rounded-md flex justify-between items-center"
              >
                <div>
                  <h1 className="text-sm text-white font-medium">
                    <span className="text-black">name:</span> {item.name}
                  </h1>
                  <h1 className="text-sm text-white font-medium">
                    <span className="text-black">username:</span> @
                    {item.username}
                  </h1>
                  <h1 className="text-sm text-white font-medium">
                    <span className="text-black">email:</span> {item.email}
                  </h1>
                </div>
                <Link
                  to={`/admin/detail/user/${item._id}`}
                  className="w-10 h-10 bg-white rounded-full flex justify-center items-center cursor-pointer hover:bg-zinc-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="black"
                    className="size-8"
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
        </div>
      )}
    </div>
  );
}

export default BusinessDetail;
