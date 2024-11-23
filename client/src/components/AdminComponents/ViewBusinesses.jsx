import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Link } from "react-router-dom";

function ViewBusinesses() {
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [searchedUser, setSearchedUser] = useState(null);
  const [numDoc, setNumDoc] = useState(1);
  const [query, setQuery] = useState("");

  // SEARCH USER
  async function SearchUser() {
    try {
      const res = await fetch(`/api/v1/admin/search/business/?query=${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok && data.success === true) {
        setSearchedUser(data.user);
      } else {
        alert("Error");
      }
    } catch (error) {
      alert(error);
    }
  }
  //   GET ALL USERS
  async function getAllUsers() {
    try {
      const res = await fetch(
        `/api/v1/admin/get-businesses/?limit=10&page=${page}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.success === true) {
        setNumDoc(data.numDoc);
        setAllUsers(data.user);
      }
    } catch (error) {
      alert("Error Occurred");
    }
  }

  useEffect(() => {
    getAllUsers();
  }, [page]);

  useEffect(() => {
    const searchDebounce = setTimeout(() => {
      if (query.length >= 3) {
        SearchUser();
      } else {
        setSearchedUser(null);
      }
    }, 1000);
    return () => clearTimeout(searchDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  //   USERS
  return (
    <div className="w-full">
      {/* SEARCH BAR */}
      <div className="w-full p-2 px-4 flex justify-between items-center bg-zinc-900">
        <h1 className="text-xl font-semibold text-white border-b-2 border-red-600">
          View Businesses
        </h1>
        <div className="w-1/4 bg-zinc-800 p-2 flex justify-start items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ID Name Username..."
            className="w-full bg-zinc-800 focus:outline-none focus:border-none text-white"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="red"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </div>

      {searchedUser?.length > 0 ? (
        <>
          <div className="w-full mt-2 px-4 p-2 flex flex-col gap-4 bg-zinc-800">
            {searchedUser.map((users, i) => (
              <div
                key={i}
                className="w-full bg-zinc-950 p-2 rounded-xl flex justify-between items-center"
              >
                <div className=" flex flex-col">
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Name</h1>
                    <h1 className="text-white">{users.name}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Business Code</h1>
                    <h1 className="text-white">{users.businessCode}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Email</h1>
                    <h1 className="text-white">{users.email}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Tier</h1>
                    <h1 className="text-white">{users.tier}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Created By</h1>
                    <h1 className="text-white">{users.createdByModel}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Verified</h1>
                    <h1 className="text-white">
                      {users.verified ? "true" : "false"}
                    </h1>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/detail/business/${users._id}`}
                    className=" flex justify-center items-center bg-red-600 p-2 hover:bg-red-800 rounded-full cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
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
              </div>
            ))}
          </div>
        </>
      ) : allUsers.length === 0 ? (
        <Loading />
      ) : (
        <>
          <div className="w-full flex justify-end bg-zinc-900 gap-2 px-4 pb-2">
            {Array.from({ length: numDoc }, (_, i) => (
              <div
                className={`${
                  page === i ? "bg-red-800" : "bg-zinc-800 hover:bg-red-400"
                } w-8 h-8 flex justify-center items-center rounded-full text-white cursor-pointer border-2 border-black`}
                onClick={() => setPage(i)}
                key={i}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="w-full mt-2 px-4 p-2 flex flex-col gap-4 bg-zinc-800">
            {allUsers.map((users, i) => (
              <div
                key={i}
                className="w-full bg-zinc-950 p-2 rounded-xl flex justify-between items-center"
              >
                <div className=" flex flex-col">
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Name</h1>
                    <h1 className="text-white">{users.name}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Business Code</h1>
                    <h1 className="text-white">{users.businessCode}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Email</h1>
                    <h1 className="text-white">{users.email}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Tier</h1>
                    <h1 className="text-white">{users.tier}</h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Clients Created</h1>
                    <h1 className="text-white">
                      {users.clientsCreated.length}
                    </h1>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <h1 className="text-red-600">Verified</h1>
                    <h1 className="text-white">
                      {users.verified ? "true" : "false"}
                    </h1>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/detail/business/${users._id}`}
                    className=" flex justify-center items-center bg-red-600 p-2 hover:bg-red-800 rounded-full cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ViewBusinesses;
