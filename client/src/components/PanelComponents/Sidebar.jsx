import { useContext, useState } from "react";
import sidebarData from "../../../data/SideBar";
import { PanelContext } from "../../context/PanelContextProvider";

function Sidebar({ panelType, setSidebarOpen, setSidebarToolShows }) {
  const { panelSpecs, setPanelSpecs, setSpaceLeft, setUpSpace } =
    useContext(PanelContext);
  const [selectedId, setSelectedId] = useState(-1);
  return (
    <div className="w-[100%] h-[15%] bg-zinc-950 flex">
      {/* SIDEBAR PANEL SPECS  */}{" "}
      <div className="flex">
        {sidebarData.map((specs, index) => {
          if (index === 1 && panelType === "normal") {
            return null;
          }
          return (
            <div
              className={`p-2 border-b-[1px] border-zinc-900 hover:bg-red-600 transition-all duration-300 cursor-pointer flex flex-col justify-start items-center gap-2 ${
                selectedId === specs.id ? "bg-red-600" : ""
              } ${
                selectedId <= 0
                  ? specs.id <= (panelType === "normal" ? 2 : 1)
                    ? ""
                    : "opacity-30"
                  : ""
              }`}
              onClick={() => {
                if (selectedId <= 0 && specs.id > 2) {
                  return;
                }
                if (specs.id === 0) {
                  setPanelSpecs({
                    ...panelSpecs,
                    panelVariant: [],
                    bigPanelVariant: [[], []],
                    panelIcons: {},
                    savedUpSpace: 6,
                    savedSpaceLeft: 12,
                    extensionTypeOne: "",
                    extensionTypeTwo: "",
                  });
                  setSpaceLeft(panelSpecs.panelSize);
                  setUpSpace(6);
                }
                if (specs.id === selectedId) {
                  setSidebarOpen(false);
                  return setSelectedId(-1);
                }
                setSelectedId(specs.id);
                setSidebarOpen(true);
                setSidebarToolShows(specs.specShow);
              }}
              key={specs.id}
            >
              {specs.icon}
              <h1 className="text-lg text-white">{specs.title}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
