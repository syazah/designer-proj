import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { UserAuthContext } from "../context/UserAuthProvider";
import { Link, useNavigate } from "react-router-dom";
const icons = {
  icon1: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill=""
      className="size-12 stroke-black fill-white"
    >
      <path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" />
    </svg>
  ),
  icon2: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-12 stroke-black fill-white"
    >
      <path
        fillRule="evenodd"
        d="M1.5 9.832v1.793c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V9.832a3 3 0 0 0-.722-1.952l-3.285-3.832A3 3 0 0 0 16.215 3h-8.43a3 3 0 0 0-2.278 1.048L2.222 7.88A3 3 0 0 0 1.5 9.832ZM7.785 4.5a1.5 1.5 0 0 0-1.139.524L3.881 8.25h3.165a3 3 0 0 1 2.496 1.336l.164.246a1.5 1.5 0 0 0 1.248.668h2.092a1.5 1.5 0 0 0 1.248-.668l.164-.246a3 3 0 0 1 2.496-1.336h3.165l-2.765-3.226a1.5 1.5 0 0 0-1.139-.524h-8.43Z"
        clipRule="evenodd"
      />
      <path d="M2.813 15c-.725 0-1.313.588-1.313 1.313V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-1.688c0-.724-.588-1.312-1.313-1.312h-4.233a3 3 0 0 0-2.496 1.336l-.164.246a1.5 1.5 0 0 1-1.248.668h-2.092a1.5 1.5 0 0 1-1.248-.668l-.164-.246A3 3 0 0 0 7.046 15H2.812Z" />
    </svg>
  ),
  icon3: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-12 stroke-black fill-white"
    >
      <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
    </svg>
  ),
};

function CustomPanelPage() {
  const { user, userType } = useContext(UserAuthContext);
  const [completeUser, setCompleteUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addCollection, setAddCollection] = useState(false);

  // GET USER
  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/general/get-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType }),
        });
        const data = await res.json();
        if (res.ok && data.success === true) {
          setCompleteUser(data.user);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    getUser();
  }, [userType]);
  return (
    <div className="relative w-full min-h-[100vh] bg-zinc-800 flex flex-col">
      {/* NAVBAR  */}
      <Navbar
        firstHead={user.name.split(" ")[0].toLowerCase()}
        secondHead={user.name.split(" ")[1]?.toLowerCase()}
      />

      {/* OVERVIEW  */}
      <div className="w-full p-4">
        <div className="w-full bg-zinc-900 rounded-lg md:rounded-2xl p-6 flex flex-col gap-4">
          <h1 className="text-xl md:text-3xl text-white border-b-[2px] border-red-600">
            Overview
          </h1>
          <div className="flex flex-col md:flex-row w-full justify-start items-center gap-4">
            {[
              {
                name: "Panels Created",
                icon: icons.icon1,
                panelsCreated: completeUser?.panelsCreated?.length ?? 0,
              },
              {
                name: "Collections Created",
                icon: icons.icon2,
                collectionsCreated:
                  completeUser?.collectionsCreated?.length ?? 0,
              },
              {
                name: "Orders Raised",
                icon: icons.icon3,
                ordersRaised: completeUser?.ordersRaised?.length ?? 0,
              },
            ].map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-full md:w-1/3 p-4 bg-red-600 rounded-lg shadow-xl flex justify-start items-start gap-2"
                >
                  <div className="flex justify-start items-start bg-red-800 rounded-full">
                    {item.icon}
                  </div>
                  <div className="flex-col justify-start items-start">
                    <h2 className="text-xl">{item.name}</h2>
                    {loading ? (
                      "loading"
                    ) : (
                      <>
                        {index === 0 ? (
                          <h2 className="text-2xl font-semibold">
                            {item.panelsCreated}
                          </h2>
                        ) : index === 1 ? (
                          <h2 className="text-2xl font-semibold">
                            {item.collectionsCreated}
                          </h2>
                        ) : (
                          <h2 className="text-2xl font-semibold">
                            {item.ordersRaised}
                          </h2>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* COLLECTIONS  */}
      <CollectionSection
        completeUser={completeUser}
        loading={loading}
        setAddCollection={setAddCollection}
      />

      {/* ADD COLLECTION POPUP  */}
      {addCollection && (
        <AddCollectionPopup
          completeUser={completeUser}
          setAddCollection={setAddCollection}
        />
      )}
    </div>
  );
}

function CollectionSection({ setAddCollection, completeUser, loading }) {
  const { user } = useContext(UserAuthContext);
  // DELETE COLLECTION
  async function handleDeleteCollection(id) {
    try {
      const res = await fetch("/api/v1/user/delete-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, parentId: user._id }),
      });
      const data = await res.json();
      if (data.success === true) {
        alert("Deleted", "Your Collection Is Deleted");
        window.location.reload();
      }
    } catch (error) {
      alert("Error");
    }
  }
  return (
    <div className="w-full p-4 flex flex-col">
      {/* COLLECTION HEADER  */}
      <div className="flex justify-between">
        <h1 className="text-white text-lg md:text-2xl border-b-[2px] border-red-600">
          Your Sites
        </h1>
        <button
          className="flex justify-center items-center bg-red-600 px-2 md:px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-all duration-200
      "
          onClick={() => setAddCollection(true)}
        >
          Add Site +
        </button>
      </div>

      {/* COLLECTION SHOWCASE  */}
      {completeUser?.collectionsCreated.length === 0 ? (
        <div className="w-full h-full flex justify-start items-center mt-[10px]">
          <h1 className="text-lg font-medium text-red-600">
            *Nothing To Show Here, Refresh The Page Or Add New Site
          </h1>
        </div>
      ) : loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <img className="w-[10%]" src="/loader.gif" />
        </div>
      ) : (
        <div className="w-full flex flex-col md:flex-row flex-wrap gap-6 mt-4 justify-start items-start">
          {completeUser?.collectionsCreated.map((collection, index) => {
            return (
              <div
                key={index}
                className="w-full md:w-[32%] h-[280px] bg-zinc-900 border-red-600 border-2 shadow-xl rounded-2xl py-4 px-2 flex flex-col gap-4 "
              >
                <h2 className="text-xl text-white border-b-[2px] border-red-600">
                  {collection.name}
                </h2>
                <p className="h-full text-sm text-gray-200 break-words">
                  {collection.description}
                </p>
                <div className="flex w-full justify-end items-end h-full gap-4">
                  <div
                    onClick={() => handleDeleteCollection(collection._id)}
                    className="w-10 h-10 bg-red-600 hover:bg-red-800 cursor-pointer flex justify-center items-center rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="size-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </div>
                  <Link
                    to={`/collection/${collection._id}`}
                    className="w-10 h-10 rounded-full flex justify-center items-center bg-red-600 hover:bg-red-800 transition-all duration-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="white"
                      className="size-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddCollectionPopup({ completeUser, setAddCollection }) {
  const navigate = useNavigate();
  const [charExceeded, setCharExceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    _id: completeUser._id,
    description: "",
    isBusiness: completeUser.isBusiness || false,
  });

  // HANDLE FORM DATA
  async function handleForm(e) {
    setCollectionForm({ ...collectionForm, [e.target.id]: e.target.value });
  }

  // HANDLE COLLECTION ADDING
  async function handleAddCollection() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/user/create-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectionForm),
      });
      const data = await res.json();
      if (res.ok && data.success === true) {
        console.log("OK");
        setLoading(false);
        setAddCollection(false);
        setTimeout(() => {
          return navigate(`/collection/${data.collectionId}`);
        }, 250);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(JSON.stringify(error));
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[rgb(2,2,2,0.3)] flex justify-center items-center">
      <div className="w-2/3 p-4 bg-zinc-950 rounded-2xl">
        <div
          className="w-full flex justify-between items-center cursor-pointer"
          onClick={() => setAddCollection(false)}
        >
          <h1 className="text-2xl border-b-[2px] border-red-600 text-white">
            Add A New Site
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10 stroke-red-600 hover:stroke-red-900 transition-all duration-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        {/* form  */}
        <div className="w-full flex flex-col py-2 gap-2">
          <h2 className="text-lg text-red-600 font-semibold">Site Name</h2>
          <input
            id="name"
            onChange={handleForm}
            placeholder="Title For Site"
            className="w-full bg-zinc-900 rounded-lg p-2 text-white focus:outline-none focus:border-none"
          />
          <h2 className="text-lg text-red-600 font-semibold">Description</h2>
          <textarea
            id="description"
            onChange={(e) => {
              const currentLength = e.target.value.length;
              if (currentLength > 200) setCharExceeded(true);
              else setCharExceeded(false);
              handleForm(e);
            }}
            placeholder="Describe Your Site In Under 200 Chars"
            className={`w-full h-[80px] bg-zinc-900 rounded-lg p-2 ${
              charExceeded ? "text-red-500" : "text-white"
            } focus:outline-none focus:border-none resize-none`}
          />
          <div className="w-full p-2 flex justify-end items-center font-medium text-md">
            <button
              className="bg-red-600 py-2 px-4 rounded-full hover:bg-red-700 transition-all duration-200"
              onClick={handleAddCollection}
            >
              {loading ? "loading..." : "ADD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomPanelPage;
