import { useContext, useState } from "react";
import {
  PanelExtensions,
  PanelFrame,
  PanelGlass,
  PanelIcons,
  PanelSize,
  PanelVariant,
  PanelWalls,
} from "../../../data/PanelSpecs";
import { PanelContext } from "../../context/PanelContextProvider";
import Draggable from "./Draggable";

function SidebarTool({ sidebarToolShows, setCantAddMore }) {
  const {
    panelSpecs,
    setPanelSpecs,
    spaceLeft,
    setSpaceLeft,
    upSpace,
    setUpSpace,
  } = useContext(PanelContext);

  const [selectedIcons, setSelectedIcons] = useState(-1);

  return (
    <div className="bg-zinc-950 h-full w-[15%] border-l-[1px] border-zinc-900 overflow-y-scroll">
      {/* SIZE  */}
      {sidebarToolShows === "size" &&
        PanelSize.map((size, index) => {
          return (
            <div
              onClick={() => setPanelSpecs({ ...panelSpecs, panelSize: size })}
              key={index}
              className="w-full p-4 border-b-[1px] border-zinc-900 hover:bg-red-600 cursor-pointer transition-all duration-200"
            >
              <h1 className="text-white text-lg font-medium ">{size} Module</h1>
            </div>
          );
        })}
      {/* VARIANT  */}
      {sidebarToolShows === "variant" &&
        PanelVariant.map((variant, index) => {
          if (index > panelSpecs.panelSize / 2 - 1) return null;
          if (panelSpecs.panelSize === 12 && index > 2) return null;
          return (
            <div key={index}>
              <div className="flex justify-center items-center bg-red-600 p-2">
                <h1 className="text-white ">{2 * (index + 1)} Module</h1>
              </div>
              {variant.map((variants, i) => {
                return (
                  <div
                    key={i}
                    className="border-b-2 border-zinc-800 hover:bg-red-600 p-2 cursor-pointer"
                    onClick={() => {
                      if (spaceLeft === 0 || spaceLeft - variants.cost < 0) {
                        return setCantAddMore(true);
                      }
                      //   if (panelSpecs.panelSize >= 12) {
                      //     let newPanelVariant;
                      //     if (upSpace - variants.cost >= 0) {
                      //       newPanelVariant = [
                      //         [
                      //           ...panelSpecs.bigPanelVariant[0],
                      //           { ...variants.variant },
                      //         ],
                      //         [...panelSpecs.bigPanelVariant[1]],
                      //       ];
                      //       setPanelSpecs({
                      //         ...panelSpecs,
                      //         bigPanelVariant: newPanelVariant,
                      //         savedUpSpace: upSpace - variants.cost,
                      //       });
                      //       setUpSpace(upSpace - variants.cost);
                      //     } else {
                      //       newPanelVariant = [
                      //         [...panelSpecs.bigPanelVariant[0]],
                      //         [
                      //           ...panelSpecs.bigPanelVariant[1],
                      //           { ...variants.variant },
                      //         ],
                      //       ];
                      //     }
                      //     const newPanelSpecs = {
                      //       ...panelSpecs,
                      //       bigPanelVariant: newPanelVariant,
                      //       savedSpaceLeft: spaceLeft - variants.cost,
                      //     };
                      //     setPanelSpecs(newPanelSpecs);
                      //     return setSpaceLeft(spaceLeft - variants.cost);
                      //   }
                      //   else {
                      //     const newPanelVariant = [
                      //       ...panelSpecs.panelVariant,
                      //       { ...variants.variant },
                      //     ];
                      //     const newPanelSpecs = {
                      //       ...panelSpecs,
                      //       panelVariant: newPanelVariant,
                      //       savedSpaceLeft: spaceLeft - variants.cost,
                      //     };
                      //     setPanelSpecs(newPanelSpecs);
                      //     return setSpaceLeft(spaceLeft - variants.cost);
                      //   }

                      let newPanelVariant;

                      if (panelSpecs.panelSize >= 12) {
                        // Determine the new panel variant based on available space
                        if (upSpace - variants.cost >= 0) {
                          newPanelVariant = [
                            [
                              ...panelSpecs.bigPanelVariant[0],
                              { ...variants.variant },
                            ],
                            [...panelSpecs.bigPanelVariant[1]],
                          ];
                          // Update panelSpecs and upSpace if there is enough space
                          setPanelSpecs((prevSpecs) => ({
                            ...prevSpecs,
                            bigPanelVariant: newPanelVariant,
                            savedUpSpace: upSpace - variants.cost,
                            savedSpaceLeft: spaceLeft - variants.cost,
                          }));
                          setUpSpace(upSpace - variants.cost);
                        } else {
                          newPanelVariant = [
                            [...panelSpecs.bigPanelVariant[0]],
                            [
                              ...panelSpecs.bigPanelVariant[1],
                              { ...variants.variant },
                            ],
                          ];
                        }

                        // Update panelSpecs and spaceLeft if not enough upSpace
                        setPanelSpecs((prevSpecs) => ({
                          ...prevSpecs,
                          bigPanelVariant: newPanelVariant,
                          savedSpaceLeft: spaceLeft - variants.cost,
                        }));
                      } else {
                        // For smaller panels, simply update panelVariant
                        newPanelVariant = [
                          ...panelSpecs.panelVariant,
                          { ...variants.variant },
                        ];
                        setPanelSpecs((prevSpecs) => ({
                          ...prevSpecs,
                          panelVariant: newPanelVariant,
                          savedSpaceLeft: spaceLeft - variants.cost,
                        }));
                      }

                      // Update spaceLeft regardless of the panel size
                      setSpaceLeft(spaceLeft - variants.cost);
                    }}
                  >
                    {variants.variant.switches > 0 && (
                      <h2 className="text-white">
                        {variants.variant.switches} Switches{" "}
                      </h2>
                    )}
                    {variants.variant.bells > 0 && (
                      <h2 className="text-white">
                        {variants.variant.bells} Bells{" "}
                      </h2>
                    )}
                    {variants.variant.dimmers > 0 && (
                      <h2 className="text-white">
                        {variants.variant.dimmers} Dimmers{" "}
                      </h2>
                    )}
                    {variants.variant.fans > 0 && (
                      <h2 className="text-white">
                        {variants.variant.fans} Fans{" "}
                      </h2>
                    )}
                    {variants.variant.curtains > 0 && (
                      <h2 className="text-white">
                        {variants.variant.curtains} Curtains{" "}
                      </h2>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

      {/* EXTENSION  */}
      {sidebarToolShows === "extension" &&
        PanelExtensions.map((variant, index) => {
          return (
            <div key={index}>
              {variant.map((variants, i) => {
                return (
                  <div
                    key={i}
                    className="border-b-2 border-zinc-800 hover:bg-red-600 p-2 cursor-pointer"
                    onClick={() => {
                      let extCount = panelSpecs.panelVariant.reduce(
                        (count, curr) => {
                          return curr === "ext" ? count + 1 : count;
                        },
                        0
                      );
                      if (panelSpecs.panelSize === 12) {
                        extCount = panelSpecs.bigPanelVariant[1].reduce(
                          (count, curr) => {
                            return curr === "ext" ? count + 1 : count;
                          },
                          0
                        );
                      }
                      if (
                        (panelSpecs.panelSize === 6 && extCount >= 2) ||
                        (panelSpecs.panelSize === 12 && extCount >= 2) ||
                        (panelSpecs.panelSize !== 6 &&
                          panelSpecs.panelSize !== 12 &&
                          extCount >= 1)
                      ) {
                        return alert("More Extensions Cannot Be Added");
                      }
                      if (spaceLeft === 0 || spaceLeft - variants.cost < 0) {
                        return setCantAddMore(true);
                      } else if (panelSpecs.panelSize === 12) {
                        const newPanelVariant = [
                          [...panelSpecs.bigPanelVariant[0]],
                          [...panelSpecs.bigPanelVariant[1], "ext"],
                        ];
                        setPanelSpecs((prevSpecs) => ({
                          ...prevSpecs,
                          bigPanelVariant: newPanelVariant,
                          savedSpaceLeft: spaceLeft - variants.cost,
                        }));
                        return setSpaceLeft(spaceLeft - variants.cost);
                      } else {
                        const newPanelVariant = [
                          ...panelSpecs.panelVariant,
                          { ...variants.variant },
                          "ext",
                        ];
                        const newPanelSpecs = {
                          ...panelSpecs,
                          panelVariant: newPanelVariant,
                          savedSpaceLeft: spaceLeft - variants.cost,
                        };
                        setPanelSpecs(newPanelSpecs);
                        return setSpaceLeft(spaceLeft - variants.cost);
                      }
                    }}
                  >
                    {variants.variant.plugs > 0 && (
                      <h2 className="text-white">
                        {variants.variant.plugs} Plugs{" "}
                      </h2>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

      {/* GLASS  */}
      {sidebarToolShows === "glass" &&
        PanelGlass.map((glass, index) => {
          return (
            <div
              onClick={() => {
                setPanelSpecs({ ...panelSpecs, panelGlass: glass });
              }}
              key={index}
              className="flex flex-col border-b-[1px] border-zinc-800 bg-red-600 cursor-pointer transition-all duration-200 p-2 justify-center items-center hover:bg-red-500"
            >
              <div
                className="w-[64px] h-[64px] rounded-full"
                style={{ backgroundColor: glass }}
              ></div>
            </div>
          );
        })}

      {/* FRAME  */}
      {sidebarToolShows === "frame" &&
        PanelFrame.map((frame, index) => {
          return (
            <div
              onClick={() => {
                setPanelSpecs({ ...panelSpecs, panelFrame: frame });
              }}
              key={index}
              className="flex flex-col border-b-[1px] border-zinc-800 bg-red-600 cursor-pointer transition-all duration-200 p-2 justify-center items-center hover:bg-red-500"
            >
              <div
                className="w-[64px] h-[64px] rounded-full"
                style={{ backgroundColor: frame }}
              ></div>
            </div>
          );
        })}

      {/* WALLS  */}
      {sidebarToolShows === "wall" && (
        <div className="w-full flex flex-wrap gap-2 p-2">
          {PanelWalls.map((wall, index) => {
            return (
              <div
                onClick={() => {
                  setPanelSpecs({ ...panelSpecs, panelWall: wall });
                }}
                key={index}
                className="flex justify-center items-center cursor-pointer"
              >
                <div
                  className="w-[30px] h-[30px] rounded-full"
                  style={{ backgroundColor: wall }}
                ></div>
              </div>
            );
          })}
        </div>
      )}

      {/* ICONS  */}
      {sidebarToolShows === "icons" && (
        <div className="w-full flex gap-2 justify-center items-start flex-wrap mt-2 px-2">
          {[
            { id: 0, title: "Alphabets" },
            { id: 1, title: "Lights" },
            { id: 2, title: "Lamps" },
            { id: 3, title: "Fans" },
            { id: 4, title: "Switches" },
            { id: 5, title: "Scenes" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (selectedIcons === item.id) {
                  setSelectedIcons(-1);
                } else {
                  setSelectedIcons(item.id);
                }
              }}
              className="flex w-full justify-between items-center"
            >
              <h1 className="text-base text-white">{item.title}</h1>
              <div className="w-6 h-6 rounded-full bg-red-800 flex justify-center items-center font-semibold text-2xl cursor-pointer hover:bg-red-600 transition-all duration-300">
                {selectedIcons === item.id ? (
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
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                ) : (
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
                      d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
          {selectedIcons >= 0 &&
            PanelIcons[selectedIcons].map((icon) => {
              return (
                <Draggable
                  key={icon.id}
                  mainId={selectedIcons}
                  id={icon.id}
                  src={icon.src}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

export default SidebarTool;
