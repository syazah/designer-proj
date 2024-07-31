import { useContext, useEffect, useRef, useState } from "react";
import { UserAuthContext } from "../context/UserAuthProvider";
import { Link, useParams } from "react-router-dom";
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
  const settingRef = useRef(null);
  const [sidebarToolShows, setSidebarToolShows] = useState("");
  const [panelUpdating, setPanelUpdating] = useState(false);
  const { panelSpecs, setPanelSpecs, spaceLeft } = useContext(PanelContext);

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
      console.log(error);
      alert("Error");
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
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div
              ref={settingRef}
              className="w-[400px] p-4 bg-red-700 translate-x-[100%] transition-all duration-300 ease-in-out opacity-0 flex-col justify-start items-start gap-4"
            >
              <div className="w-full flex gap-2">
                <h2 className="text-white text-lg">Set Droppable Type</h2>
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
              className={`flex justify-center items-center h-full`}
            >
              {panelSpecs.panelSize === 12 ? (
                <BigPanel
                  panelGlass={panelSpecs.panelGlass}
                  panelFrame={panelSpecs.panelFrame}
                  panelVariant={panelSpecs.bigPanelVariant}
                />
              ) : (
                <Panel
                  panelSize={panelSpecs.panelSize}
                  panelGlass={panelSpecs.panelGlass}
                  panelFrame={panelSpecs.panelFrame}
                  panelVariant={panelSpecs.panelVariant}
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
    </div>
  );
}

export default PanelPage;
