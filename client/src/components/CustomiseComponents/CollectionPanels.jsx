import { Link } from "react-router-dom";
import Panel from "../PanelComponents/Panel";
import { useContext, useRef } from "react";
import { UserAuthContext } from "../../context/UserAuthProvider";
import getImageOfComponent from "../../../data/DownloadPanels/GetImageOfComponent";
function CollectionPanels({ panels, setAddPanelPopup }) {
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

      {panels.length === 0 ? (
        <h1 className="text-xl text-red-600">
          *No Panels To Show Kindly Refresh Or Add A New Panel{" "}
        </h1>
      ) : (
        <div className="w-full mt-8 flex flex-col gap-4">
          {panels?.map((panel, index) => {
            return <AvailablePanel key={index} panel={panel} />;
          })}
        </div>
      )}
    </div>
  );
}

function AvailablePanel({ panel }) {
  const { user } = useContext(UserAuthContext);
  const panelRef = useRef(null);

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
  return (
    <div className="bg-zinc-950 rounded-xl flex flex-col overflow-hidden">
      <div
        ref={panelRef}
        style={{ backgroundColor: panel.panelData?.panelWall ?? "#000" }}
        className="flex justify-center items-center w-full h-[400px]"
      >
        {panel?.panelData != null && (
          <Panel
            panelSize={panel.panelData.panelSize}
            panelGlass={panel.panelData.panelGlass}
            panelFrame={panel.panelData.panelFrame}
            panelVariant={panel.panelData.panelVariant}
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
            onClick={() => getImageOfComponent(panelRef, panel.panelName)}
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
            className="flex justify-center items-center p-2 bg-red-600 rounded-full"
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
    </div>
  );
}

export default CollectionPanels;
