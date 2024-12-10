import { useContext, useEffect, useRef, useState } from "react";
import { UserAuthContext } from "../context/UserAuthProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/PanelComponents/Sidebar";
import SidebarTool from "../components/PanelComponents/SidebarTool";
import { PanelContext } from "../context/PanelContextProvider";
import Panel from "../components/PanelComponents/Panel";
import BigPanel from "../components/PanelComponents/BigPanel";
function PanelPage() {
  const { user } = useContext(UserAuthContext);
  const { id } = useParams();
  const [panelData, setPanelData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cantAddMore, setCantAddMore] = useState(false);
  const detailRef = useRef(null);
  const navigation = useNavigate();
  const settingRef = useRef(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [sidebarToolShows, setSidebarToolShows] = useState("");
  const [panelUpdating, setPanelUpdating] = useState(false);
  const addPanelPop = useRef(null);
  const {
    panelSpecs,
    setPanelSpecs,
    spaceLeft,
    upSpace,
    currentCollectionId,
    setUpSpace,
    setSpaceLeft,
    twelveModExtError,
    setTwelveModExtError,
  } = useContext(PanelContext);
  const [panelBasicDetail, setPanelBasicDetail] = useState({
    collectionId: currentCollectionId,
    panelName: "",
    panelType: "",
  });

  //DEBOUNCE STORE PANEL STATE
  async function UpdatePanelData() {
    try {
      const res = await fetch("/api/v1/user/update-panel-data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panelSpecs, id }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        alert("Error");
      }
    } catch (error) {
      alert("Error, Something went wrong");
    }
  }

  useEffect(() => {
    let updatePanel;
    if (panelSpecs) {
      setPanelUpdating(true);
      updatePanel = setTimeout(() => {
        UpdatePanelData();
        setPanelUpdating(false);
      }, 3000);
    }
    return () => clearTimeout(updatePanel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelSpecs]);

  // HANDLE DETAILS OPEN
  function handleDetailsOpen() {
    if (detailsOpen === false) {
      detailRef.current.style.transform = "translateX(0%)";
      detailRef.current.style.opacity = "1";
      settingRef.current.style.transform = "translateX(100%)";
      settingRef.current.style.opacity = "0";
      setDetailsOpen(true);
      setSettingsOpen(false);
    } else {
      detailRef.current.style.transform = "translateX(100%)";
      detailRef.current.style.opacity = "0";
      setDetailsOpen(false);
    }
  }
  // HANDLE SETTINGS OPEN
  function handleSettingsOpen() {
    if (settingsOpen === false) {
      detailRef.current.style.transform = "translateX(100%)";
      detailRef.current.style.opacity = "0";
      settingRef.current.style.transform = "translateX(0%)";
      settingRef.current.style.opacity = "1";
      setSettingsOpen(true);
      setDetailsOpen(false);
    } else {
      settingRef.current.style.transform = "translateX(100%)";
      settingRef.current.style.opacity = "0";
      setSettingsOpen(false);
    }
  }
  // GET PANEL DETAILS
  async function getPanelDetails() {
    try {
      const res = await fetch("/api/v1/general/get-panel-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success === true) {
        setPanelData(data.panel);
      } else {
        alert("Error", data.message);
      }
    } catch (error) {
      alert("Some Internal Error");
    }
  }
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
        setTimeout(() => {
          navigation(`/panel/${data.panelId}`, { replace: true });
          setPanelSpecs({
            panelSize: 2,
            panelVariant: [],
            bigPanelVariant: [[], []],
            panelIcons: {},
            panelGlass: "#000",
            panelFrame: "#ddd",
            panelWall: "",
            droppableType: 1,
            droppableColor: "#17c5e2",
            savedSpaceLeft: 12,
            savedUpSpace: 6,
            fanIcon: {
              id: "FN01",
              src: "/ICONS/fans/fan1.png",
            },
            dimmerIcon: { id: "AB04", src: "/ICONS/alphabets/alphabet-d.png" },
          });
          setUpSpace(6);
          setSpaceLeft(2);
          setSidebarToolShows("");
          setSidebarOpen(false);
          addPanelPop.current.style.transform = "scale(0)";
          addPanelPop.current.style.opacity = 0;
        }, 500);
      } else {
        alert("Error", data.message);
      }
      setPanelLoading(false);
    } catch (error) {
      setPanelLoading(false);
      alert("ERROR");
    }
  }

  useEffect(() => {
    getPanelDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="bg-zinc-800 w-full h-screen flex flex-col justify-between items-start overflow-hidden">
      {/* NAVBAR        */}
      <div className="w-full h-[10%] bg-zinc-950 border-b-2 border-red-600 flex justify-between items-center p-2">
        <h1 className="text-2xl text-white font-bold lowercase">
          {user.name.split(" ")[0]?.toLowerCase()}
          <span className="text-red-600 lowercase">
            {user.name.split(" ")[1]?.toLowerCase()}
          </span>
        </h1>
        <Link to={"/"}>
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
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>
      </div>

      {/* MAIN PAGE  */}
      {panelData === null ? (
        <div className="flex justify-center items-center w-full h-full">
          <img className="w-[10%]" src="/loader.gif" />
        </div>
      ) : (
        <div className="relative flex flex-col justify-between items-start w-full h-[90%]">
          {/* PANEL DETAILS  */}
          <div className="absolute z-40 overflow-hidden top-0 right-0 group flex flex-col justify-end items-end">
            <div
              onClick={handleDetailsOpen}
              className="w-10 h-10 bg-red-600 flex justify-center items-center z-10 cursor-pointer hover:bg-red-800 group"
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
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </div>
            <div
              ref={detailRef}
              className="w-[300px] p-4 bg-red-700 translate-x-[100%] transition-all duration-300 ease-in-out opacity-0 flex-col justify-start items-start"
            >
              <div className="border-2 border-white p-2 flex flex-col">
                <h2 className="text-white">
                  Panel Size :- {panelSpecs.panelSize} Module
                </h2>
                <h2 className="text-white">
                  Panel Glass :- {panelSpecs.panelGlass}
                </h2>
                <h2 className="text-white">
                  Panel Frame :- {panelSpecs.panelFrame}
                </h2>
                <h2 className="text-white">
                  Panel Wall :-{" "}
                  {panelSpecs.panelWall === "" ? "N/A" : panelSpecs.panelWall}
                </h2>
                <h2 className="text-white">
                  Droppable Type :-{" "}
                  {panelSpecs.droppableType === 0 ? "Circle" : "Square"}
                </h2>
                <h2 className="text-white">
                  Space Left :-
                  {spaceLeft}
                </h2>
              </div>
            </div>
          </div>

          {/* PANEL SETTINGS  */}
          <div
            className="absolute overflow-hidden top-11 right-0 group flex flex-col justify-end items-end z-40
          "
          >
            <div
              onClick={handleSettingsOpen}
              className="w-10 h-10 bg-red-600 flex justify-center items-center z-10 cursor-pointer hover:bg-red-800 group text-center"
            >
              <h1 className="text-white text-[10px]">Switch Border</h1>
            </div>
            <div
              ref={settingRef}
              className="w-[400px] p-4 bg-red-700 translate-x-[100%] transition-all duration-300 ease-in-out opacity-0 flex-col justify-start items-start gap-4"
            >
              <div className="w-full flex gap-2">
                <h2 className="text-white text-lg">Set Switch Border</h2>
                <select
                  className="w-[150px] cursor-pointer bg-red-900 text-white px-2"
                  value={panelSpecs.droppableType}
                  onChange={(e) => {
                    setPanelSpecs({
                      ...panelSpecs,
                      droppableType: e.target.value,
                    });
                  }}
                >
                  <option className="cursor-pointer" value={1}>
                    Square
                  </option>
                  <option className="cursor-pointer" value={0}>
                    Circle
                  </option>
                  <option className="cursor-pointer" value={2}>
                    Dot
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* AUTO SAVE  */}
          <div
            className="absolute overflow-hidden top-[5.5rem] right-0 group flex flex-col justify-end items-end z-40
          "
          >
            <div className="w-10 h-10 bg-red-600 flex justify-center items-center z-10 cursor-pointer hover:bg-red-800 group">
              {panelUpdating ? (
                <img src="/saveload.gif" className="w-[2rem] h-[2rem]" />
              ) : (
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
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* ========================================================================= */}

          {/* SIDEBAR-TOOL  */}
          <div className="flex w-full h-[85%]">
            {sidebarOpen && (
              <SidebarTool
                setCantAddMore={setCantAddMore}
                sidebarToolShows={sidebarToolShows}
              />
            )}

            {/* PANELS  */}
            <div
              style={
                sidebarOpen
                  ? { width: "85%", backgroundColor: panelSpecs.panelWall }
                  : { width: "100%", backgroundColor: panelSpecs.panelWall }
              }
              className={`flex relative justify-center items-center h-full transition-all duration-500`}
            >
              {sidebarToolShows === "" && (
                <div className="absolute bottom-0 left-0 bg-red-600 p-3">
                  <h1 className="font-semibold">Start Here</h1>
                </div>
              )}
              {/* CREATE NEW PANEL  */}
              {
                <div
                  onClick={() => {
                    addPanelPop.current.style.transform = "scale(1)";
                    addPanelPop.current.style.opacity = 1;
                  }}
                  className="absolute bottom-0 right-0 bg-red-600 p-1 cursor-pointer hover:bg-red-800 hover:text-zinc-950 transition-all duration-500 rounded-tl-md"
                >
                  <h1 className="font-semibold">Create New Panel</h1>
                </div>
              }
              {/* View All PANEL  */}
              {
                <div
                  onClick={() => {
                    window.history.back();
                  }}
                  className="absolute bottom-8 right-0 bg-red-600 p-1 cursor-pointer hover:bg-red-800 hover:text-zinc-950 transition-all duration-500 rounded-t-md"
                >
                  <h1 className="font-semibold">View All Panels</h1>
                </div>
              }
              {/* CREATE NEW PANEL  */}
              <div
                ref={addPanelPop}
                className="fixed transition-all duration-500 opacity-0 scale-0 w-full h-full bg-[rgb(10,10,10,0.5)] flex justify-center items-center top-0 left-0 z-50
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
                      onClick={() => {
                        addPanelPop.current.style.transform = "scale(0)";
                        addPanelPop.current.style.opacity = 0;
                      }}
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
                      <h2 className="text-base text-red-600 mb-2">
                        Panel Name
                      </h2>
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
                        <p className="text-sm text-zinc-400">
                          Select The Panel Type
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <h3
                          onClick={() => {
                            setPanelBasicDetail({
                              ...panelBasicDetail,
                              panelType: "normal",
                            });
                          }}
                          className={`p-2 border-x-[2px] ${
                            panelBasicDetail.panelType === "normal"
                              ? "bg-red-600 text-white"
                              : ""
                          } border-red-600 text-white rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600`}
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
                          }  border-x-2 border-red-600 text-white rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600`}
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

              {panelSpecs.panelSize === 12 ? (
                <BigPanel
                  upSpace={upSpace}
                  setSpaceLeft={setSpaceLeft}
                  spaceLeft={spaceLeft}
                  panelGlass={panelSpecs.panelGlass}
                  panelFrame={panelSpecs.panelFrame}
                  panelVariant={panelSpecs.bigPanelVariant}
                  fanIcon={panelSpecs.fanIcon}
                  dimmerIcon={panelSpecs.dimmerIcon}
                />
              ) : (
                <Panel
                  spaceLeft={spaceLeft}
                  setSpaceLeft={setSpaceLeft}
                  panelSize={panelSpecs.panelSize}
                  panelGlass={panelSpecs.panelGlass}
                  panelFrame={panelSpecs.panelFrame}
                  panelVariant={panelSpecs.panelVariant}
                  fanIcon={panelSpecs.fanIcon}
                  dimmerIcon={panelSpecs.dimmerIcon}
                />
              )}
            </div>
          </div>

          <Sidebar
            setSidebarToolShows={setSidebarToolShows}
            setSidebarOpen={setSidebarOpen}
            panelType={panelData?.panelType}
          />
        </div>
      )}

      {/* CAN'T ADD POPUP  */}
      {cantAddMore && (
        <div className="absolute top-0 left-0 w-full h-full bg-[rgb(1,1,1,0.5)] z-50 flex justify-center items-center">
          <div className="w-[500px] p-4 bg-black rounded-xl border-2 border-red-600">
            <h1 className="text-red-600">Error !</h1>
            <p className="text-white ">
              Cannot add more components since no more space is left. You can
              delete Some of the components from the panel to add more
              components
            </p>
            <div className="flex justify-end items-center">
              <button
                onClick={() => {
                  setCantAddMore(false);
                }}
                className="bg-red-600 p-2 px-4 rounded-full hover:bg-red-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CAN'T MOVE TWELVE  */}
      {twelveModExtError && (
        <div className="absolute top-0 left-0 w-full h-full bg-[rgb(1,1,1,0.5)] z-50 flex justify-center items-center">
          <div className="w-[500px] p-4 bg-black rounded-xl border-2 border-red-600">
            <h1 className="text-red-600">Error !</h1>
            <p className="text-white ">
              You need to select atleast two accessories when you are choosing
              12 Module Panel.
            </p>
            <div className="flex justify-end items-center">
              <button
                onClick={() => {
                  setTwelveModExtError(false);
                }}
                className="bg-red-600 p-2 px-4 rounded-full hover:bg-red-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelPage;
