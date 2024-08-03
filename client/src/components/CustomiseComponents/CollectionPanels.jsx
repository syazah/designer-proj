import { Link } from "react-router-dom";
import Panel from "../PanelComponents/Panel";
import { useContext, useEffect, useRef, useState } from "react";
import { UserAuthContext } from "../../context/UserAuthProvider";
import getImageOfComponent from "../../../data/DownloadPanels/GetImageOfComponent";
import getPdfOfComponent from "../../../data/DownloadPanels/GetPdfOfComponent";
import { PanelContext } from "../../context/PanelContextProvider";
import BigPanel from "../PanelComponents/BigPanel";
function CollectionPanels({ panels, setAddPanelPopup, normalPanels }) {
  const collectionRef = useRef(null);
  const { setPanelCollectionContext } = useContext(PanelContext);
  useEffect(() => {
    setPanelCollectionContext(collectionRef);
  }, [collectionRef, setPanelCollectionContext]);
  return (
    <div className="w-full min-h-[200px] flex flex-col justify-start overflow-hidden">
      {/* ADD PANEL BUTTON  */}
      <div className=" w-full flex justify-end items-center cursor-pointer">
        <div
          onClick={() => setAddPanelPopup(true)}
          className="flex group justify-center items-center p-2 bg-red-600 transition-all duration-300"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          <h2 className="max-w-0 max-h-0 opacity-0 group-hover:max-w-xs group-hover:max-h-10 group-hover:opacity-100 transition-all duration-300 overflow-hidden text-white">
            Add Panel
          </h2>
        </div>
      </div>

      {/* PANEL  */}

      {panels.length === 0 && normalPanels.length === 0 ? (
        <h1 className="text-xl text-red-600">
          *No Panels To Show Kindly Refresh Or Add A New Panel{" "}
        </h1>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-white">CUSTOM PANELS</h1>
          {panels.length > 0 && (
            <div
              ref={collectionRef}
              className="w-full mt-8 flex flex-col gap-4"
            >
              {panels?.map((panel, index) => {
                return <AvailablePanel key={index} panel={panel} />;
              })}
            </div>
          )}
          <h1 className="text-2xl font-semibold text-white mt-8">
            NORMAL PANELS
          </h1>
          {normalPanels.length > 0 && (
            <div
              ref={collectionRef}
              className="w-full mt-8 flex flex-col gap-4"
            >
              {normalPanels?.map((panel, index) => {
                return <NormalPanel key={`${index}-normal`} panel={panel} />;
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AvailablePanel({ panel }) {
  const { user } = useContext(UserAuthContext);
  const panelRef = useRef(null);
  const downloadOptionRef = useRef(null);
  const [downloadOptionShowing, setDownloadOptionShowing] = useState(false);
  function getDownloadOption() {
    if (!downloadOptionShowing) {
      downloadOptionRef.current.style.transform = "translateY(0px)";
      downloadOptionRef.current.style.opacity = 1;
      setDownloadOptionShowing(true);
    } else {
      downloadOptionRef.current.style.transform = "translateY(1000px)";
      downloadOptionRef.current.style.opacity = 0;
      setDownloadOptionShowing(false);
    }
  }
  // DELETE PANEL
  async function DeletePanel() {
    try {
      const res = await fetch(`/api/v1/general/delete-panel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: panel._id, parentId: user._id }),
      });
      const data = await res.json();
      if (res.ok && data.success === true) {
        alert("Deleted Panel");
        window.location.reload();
      }
    } catch (error) {
      alert("Error");
    }
  }
  console.log(panel.panelData);
  return (
    <div className="bg-zinc-950 rounded-xl flex flex-col overflow-hidden relative">
      <div
        ref={panelRef}
        style={{ backgroundColor: panel.panelData?.panelWall ?? "#000" }}
        className={`available-panel flex justify-center items-center w-full ${
          panel.panelData.panelSize < 12 ? "h-[400px]" : "h-[500px]"
        }`}
      >
        {panel?.panelData != null && panel?.panelData.panelSize < 12 ? (
          <Panel
            spaceLeft={panel.panelData.savedSpaceLeft}
            panelSize={panel.panelData.panelSize}
            panelGlass={panel.panelData.panelGlass}
            panelFrame={panel.panelData.panelFrame}
            panelVariant={panel.panelData.panelVariant}
            panelIcons={Object.entries(panel.panelData?.panelIcons || {})}
          />
        ) : (
          <BigPanel
            upSpace={panel.panelData.savedUpSpace}
            spaceLeft={panel.panelData.savedSpaceLeft}
            panelGlass={panel.panelData.panelGlass}
            panelFrame={panel.panelData.panelFrame}
            panelVariant={panel.panelData.bigPanelVariant}
            panelIcons={Object.entries(panel.panelData?.panelIcons || {})}
          />
        )}
      </div>

      {/* PANEL DATA  */}
      <div className="flex justify-between p-4 items-center">
        <h1 className="text-xl font-medium text-white">{panel.panelName}</h1>
        <div className="flex gap-2 ">
          {/* DOWNLOAD PANEL  */}
          <div
            className="flex justify-center items-center bg-white rounded-full p-2 cursor-pointer hover:bg-gray-400"
            onClick={getDownloadOption}
          >
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
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </div>

          {/* DELETE PANEL  */}
          <div
            onClick={DeletePanel}
            className="flex justify-center items-center bg-white rounded-full p-2 cursor-pointer hover:bg-gray-400"
          >
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>

          {/* GO TO PANEL  */}
          <Link
            to={`/panel/${panel._id}`}
            className="flex justify-center items-center p-2 bg-red-600 rounded-full hover:bg-red-800"
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* PANEL DOWNLOAD INFO  */}
      <div
        ref={downloadOptionRef}
        className="absolute w-48 p-2 bg-white bottom-5 z-20 right-48 rounded-xl translate-y-[1000px] transition-all duration-500 ease-in-out"
      >
        {/* PDF  */}
        <div
          onClick={() => {
            getPdfOfComponent(panelRef, panel.panelName);
          }}
          className="flex justify-start items-center gap-1 cursor-pointer group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>

          <h2 className="text-black font-semibold group-hover:text-gray-700">
            Download PDF
          </h2>
        </div>

        {/* PNG  */}
        <div
          onClick={() => getImageOfComponent(panelRef, panel.panelName)}
          className="flex justify-start items-center gap-1 cursor-pointer group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <h2 className="text-black font-semibold group-hover:text-gray-700">
            Download PNG
          </h2>
        </div>
      </div>
    </div>
  );
}

function NormalPanel({ panel }) {
  return (
    <div
      style={{ backgroundColor: panel.panelWall }}
      className="w-full h-[400px] flex flex-col justify-center items-center bg-zinc-900 rounded-2xl p-2 gap-2"
    >
      <h1 className="text-white text-xl">
        Normal Panel :- {panel.panelID.name}
      </h1>
      <Panel
        normalPanel={true}
        normalPanelRegSize={true}
        panelSize={panel.panelID.size}
        panelFrame={panel.panelFrame}
        panelGlass={panel.panelGlass}
        panelVariant={panel.panelID.variant}
        panelIcons={{}}
      />
    </div>
  );
}

export default CollectionPanels;
