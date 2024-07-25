import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../../context/UserAuthProvider";
import CollectionPanels from "./CollectionPanels";

function CollectionPage() {
  const navigation = useNavigate();
  const { user } = useContext(UserAuthContext);
  const [collection, setCollection] = useState(null);
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [addPanelPopup, setAddPanelPopup] = useState(false);
  const [currentToolSelected, setCurrentToolSelected] = useState(0);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelBasicDetail, setPanelBasicDetail] = useState({
    collectionId: id,
    panelName: "",
    panelType: "",
  });
  //GET COLLECTION
  async function GetCollection() {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/general/get-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success === true) {
        setCollection(data.collection);
        setPanels(data.collection.panels);
      } else {
        alert(data.message);
      }
      setLoading(false);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }
  useEffect(() => {
    GetCollection();
  }, []);

  // HANDLE CREATE PANEL
  async function HandleCreatePanel() {
    try {
      setPanelLoading(true);
      const res = await fetch("/api/v1/general/basic-panel-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(panelBasicDetail),
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);
        setTimeout(() => {
          return navigation(`/panel/${data.panelId}`);
        }, 500);
      } else {
        alert("Error", data.message);
      }
      setPanelLoading(false);
    } catch (error) {
      setPanelLoading(false);
      alert("ERROR", JSON.stringify(error));
    }
  }

  return (
    <div className="w-full min-h-screen relative bg-zinc-900 flex flex-col ">
      {/* NAVBAR  */}

      <Navbar
        firstHead={user.name.split(" ")[0].toLowerCase()}
        secondHead={user.name.split(" ")[1]?.toLowerCase()}
      />

      {/* MAIN COLLECTION  */}

      <div className="w-full h-full flex justify-center items-center">
        {loading ? (
          <img className="w-[10%]" src="/loader.gif" />
        ) : (
          <div className="w-full h-full p-4 mt-8 flex flex-col">
            {/* TEXT  */}
            <div className="flex flex-col justify-center items-center gap-2 p-4">
              <h1 className="text-5xl text-white font-medium w-1/2 flex justify-center items-center border-b-2 border-red-600">
                {collection?.name.toUpperCase()}
              </h1>
              <p className="text-lg text-gray-200 font-medium text-center w-1/2 break-words">
                {collection?.description}
              </p>
            </div>

            {/* TOOLBAR  */}
            <div className="w-full flex mt-5 border-b-2 border-red-600 justify-between">
              <div className="flex ">
                <h2
                  onClick={() => setCurrentToolSelected(0)}
                  className={`text-lg text-white  ${
                    currentToolSelected === 0
                      ? "bg-red-600"
                      : "hover:bg-red-500"
                  } p-2 cursor-pointer flex justify-center items-center gap-1`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                    />
                  </svg>
                  Panels
                </h2>
                <h2
                  onClick={() => setCurrentToolSelected(1)}
                  className={`text-lg text-white  p-2 cursor-pointer ${
                    currentToolSelected === 1
                      ? "bg-red-600"
                      : "hover:bg-red-500"
                  } transition-all duration-200 flex justify-center items-center gap-1`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download
                </h2>
                <h2
                  onClick={() => setCurrentToolSelected(2)}
                  className={`text-lg text-white  p-2 cursor-pointer ${
                    currentToolSelected === 2
                      ? "bg-red-600"
                      : "hover:bg-red-500"
                  } transition-all duration-200 flex justify-center items-center gap-1`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  Settings
                </h2>
              </div>

              {/* SEARCH  */}

              <div className="w-1/4">
                <div className="bg-zinc-800 border-x-2 border-red-600 border-t-2 flex justify-center overflow-hidden p-2 items-center">
                  <input
                    placeholder="Search For Panels"
                    className="w-[90%] bg-zinc-800 focus:outline-none outline:border-none text-white"
                  />
                  <div className="w-[10%]">
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
              </div>
            </div>

            {/* TOOLBAR VAL  */}
            {currentToolSelected === 0 ? (
              <CollectionPanels
                setAddPanelPopup={setAddPanelPopup}
                panels={panels}
              ></CollectionPanels>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>

      {/* PANEL POPUP  */}
      {addPanelPopup && (
        <div
          className="fixed w-full h-full bg-[rgb(10,10,10,0.5)] flex justify-center items-center top-0 left-0 z-50
        "
        >
          <div className="w-[600px] flex flex-col p-4 rounded-xl border-y-2 border-red-600 bg-zinc-950 gap-2">
            <div className="w-full flex justify-between items-center ">
              <h2 className="text-white text-2xl font-semibold border-b-2 border-red-600">
                Add Panel
              </h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="red"
                onClick={() => setAddPanelPopup(false)}
                className="size-8 hover:stroke-red-800 cursor-pointer transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            {/* PANEL FORM  */}
            <div className="flex flex-col justify-start items-start mt-4 gap-4">
              <div>
                <h2 className="text-base text-red-600 mb-2">Panel Name</h2>
                <input
                  onChange={(e) => {
                    setPanelBasicDetail({
                      ...panelBasicDetail,
                      panelName: e.target.value,
                    });
                  }}
                  className="p-2 bg-zinc-900 w-full rounded-lg text-white focus:outline-none focus:border-none"
                  placeholder="Name Your Panel"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-base text-red-600">Panel Type</h2>
                  <p className="text-sm text-zinc-400">Select The Panel Type</p>
                </div>
                <div className="flex gap-2">
                  <h3
                    onClick={() => {
                      setPanelBasicDetail({
                        ...panelBasicDetail,
                        panelType: "normal",
                      });
                    }}
                    className={`p-2 ${
                      panelBasicDetail.panelType === "normal"
                        ? "bg-red-600 text-white"
                        : ""
                    } border-x-[2px] border-red-600 text-white rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600`}
                  >
                    Panel Without Extension
                  </h3>
                  <h3
                    onClick={() => {
                      setPanelBasicDetail({
                        ...panelBasicDetail,
                        panelType: "extension",
                      });
                    }}
                    className={`p-2 ${
                      panelBasicDetail.panelType === "extension"
                        ? "bg-red-600 text-white"
                        : ""
                    } border-x-2 border-red-600 text-white rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600`}
                  >
                    Panel With Extensions
                  </h3>
                </div>
              </div>
            </div>

            {/* PANEL SUBMIT BUTTON  */}
            <div className="w-full p-2 flex justify-end items-center">
              <button
                onClick={HandleCreatePanel}
                className="p-2 px-4 rounded-full bg-red-600"
              >
                {panelLoading ? "Loading..." : "ADD +"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionPage;
