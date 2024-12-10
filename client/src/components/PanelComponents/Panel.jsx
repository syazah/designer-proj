import React, { useContext } from "react";
import DroppableCollection from "./DroppableCollection";
import CurtainVariant from "../VariantComponent/CurtainVariant";
import FansVariant from "../VariantComponent/FansVariant";
import PlugVariant from "../VariantComponent/PlugVariant";
import DimmerVariant from "../VariantComponent/DimmerVariant";
import { PanelContext } from "../../context/PanelContextProvider";
function Panel({
  spaceLeft,
  setSpaceLeft,
  normalPanel = false,
  panelSize,
  panelGlass,
  panelFrame,
  panelVariant,
  fanIcon,
  dimmerIcon,
  normalPanelRegSize = false,
  panelIcons = [],
  droppableType,
  extensionOne = undefined,
  extensionTwo = undefined,
}) {
  // PANEL WIDTH AND HEIGHT
  let panelWidth, panelHeight;
  if (panelSize === 2) {
    panelWidth = "300px";
    panelHeight = "300px";
  } else if (panelSize === 4) {
    panelWidth = "500px";
    panelHeight = "300px";
  } else if (panelSize === 6) {
    panelWidth = "700px";
    panelHeight = "300px";
  } else if (panelSize === 8) {
    panelWidth = "900px";
    panelHeight = "300px";
  }
  // PANEL
  const { panelSpecs, setPanelSpecs } = useContext(PanelContext);
  return (
    <div
      style={{
        width: panelWidth,
        height: panelHeight,
        backgroundColor: panelGlass,
        borderColor: panelFrame,
      }}
      className={`bg-black border-[8px] ${
        normalPanel ? (normalPanelRegSize ? "" : "scale-50") : ""
      } transition-all duration-200 rounded-lg shadow-2xl flex justify-center gap-[30px] relative`}
    >
      {panelVariant.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center gap-2 p-2">
          {Array.from({ length: panelSize / 2 }, (_, i) => {
            return (
              <div
                key={i}
                className="w-[200px] h-[200px] border-2 border-red-800"
              ></div>
            );
          })}
        </div>
      ) : (
        <>
          {normalPanel &&
            panelVariant.filter((el) => el.plugs > 1).length > 0 && (
              <React.Fragment>
                <div className="flex items-center gap-[20px]">
                  {Array.from({ length: 1 }, (_, i) => {
                    return <PlugVariant key={`plug-${i}`} />;
                  })}
                </div>
              </React.Fragment>
            )}

          {panelVariant.filter((el) => el === "ext").length >= 1 && (
            <React.Fragment>
              <div className="flex items-center gap-[20px]">
                {Array.from({ length: 1 }, (_, i) => {
                  return (
                    <div key={`plug-${i}`} className="relative">
                      <PlugVariant
                        iconType={
                          extensionOne !== undefined
                            ? extensionOne
                            : panelSpecs.extensionTypeOne
                        }
                      />
                      {panelSpecs.extensionTypeOne &&
                        extensionOne === undefined && (
                          <div
                            onClick={() => {
                              const index = panelVariant.indexOf("ext");
                              if (index !== -1) {
                                panelVariant.splice(index, 1);
                                setSpaceLeft((prev) => prev + 2);

                                setPanelSpecs({
                                  ...panelSpecs,
                                  savedSpaceLeft: panelSpecs.savedSpaceLeft + 2,
                                  extensionTypeOne: panelSpecs.extensionTypeTwo,
                                  extensionTypeTwo: "",
                                });
                              }
                            }}
                            className="w-6 h-6 rounded-full bg-red-700 absolute z-20 -top-2 right-0 flex justify-center items-center cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-5 stroke-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          )}

          {panelVariant.map((variant, indexs) => {
            return (
              <React.Fragment key={indexs}>
                {variant.switches > 0 ? (
                  panelIcons.length > 0 ? (
                    <div className="flex gap-[20px]">
                      {Array.from({ length: variant.switches / 2 }, (_, i) => {
                        const iconDataToSend = panelIcons.filter((item) =>
                          item[0].startsWith(`${indexs}-${i}`)
                        );
                        return (
                          <DroppableCollection
                            droppableType={droppableType}
                            key={`${indexs}-${i}`}
                            id={`${indexs}-${i}`}
                            iconData={iconDataToSend}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex gap-[20px]">
                      {normalPanel ||
                        Array.from({ length: variant.switches / 2 }, (_, i) => {
                          return (
                            <DroppableCollection
                              droppableType={droppableType}
                              key={`${indexs}-${i}`}
                              id={`${indexs}-${i}`}
                            />
                          );
                        })}
                      {normalPanel &&
                        Array.from({ length: variant.switches / 2 }, (_, i) => {
                          return (
                            <DroppableCollection
                              droppableType={droppableType}
                              key={`${indexs}-${i}`}
                              id={`${indexs}-${i}`}
                              normalPanel={normalPanel}
                            />
                          );
                        })}
                    </div>
                  )
                ) : (
                  <></>
                )}
                {variant.curtains > 0 && (
                  <div className="flex gap-[20px]">
                    {Array.from({ length: variant.curtains }, (_, i) => {
                      return <CurtainVariant key={`curtain-${i}`} />;
                    })}
                  </div>
                )}

                {variant.fans > 0 && (
                  <div className="flex items-center gap-[20px]">
                    {Array.from({ length: variant.fans }, (_, i) => {
                      return (
                        <FansVariant fanIcon={fanIcon} key={`fans-${i}`} />
                      );
                    })}
                  </div>
                )}
                {variant.dimmers > 0 && (
                  <div className="flex items-center gap-[20px]">
                    {Array.from({ length: variant.dimmers }, (_, i) => {
                      return (
                        <DimmerVariant
                          dimmerIcon={dimmerIcon}
                          key={`0-dimmers-${i}`}
                        />
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {!normalPanel && spaceLeft > 0 && (
            <div className="flex items-center gap-[20px]">
              {Array.from({ length: spaceLeft / 2 }, (_, i) => {
                return (
                  <div
                    key={`box-${i}`}
                    className="w-[200px] h-[200px] border-2 border-red-800"
                  ></div>
                );
              })}
            </div>
          )}

          {/* EXTENSIONS  */}
          {panelVariant.filter((el) => el === "ext").length >= 2 && (
            <React.Fragment>
              <div className="flex items-center gap-[20px]">
                {Array.from({ length: 1 }, (_, i) => {
                  return (
                    <div key={`plug-${i}`} className="relative">
                      <PlugVariant
                        iconType={
                          extensionTwo !== undefined
                            ? extensionTwo
                            : panelSpecs.extensionTypeTwo
                        }
                      />
                      {panelSpecs.extensionTypeOne &&
                        extensionTwo === undefined && (
                          <div
                            onClick={() => {
                              const index = panelVariant.indexOf("ext");
                              if (index !== -1) {
                                panelVariant.splice(index, 1);
                                setSpaceLeft((prev) => prev + 2);

                                setPanelSpecs({
                                  ...panelSpecs,
                                  savedSpaceLeft: panelSpecs.savedSpaceLeft + 2,
                                  extensionTypeTwo: "",
                                });
                              }
                            }}
                            className="w-6 h-6 rounded-full bg-red-700 absolute z-50 -top-2 right-0 flex justify-center items-center cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-5 stroke-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          )}
          {normalPanel &&
            panelVariant.filter((el) => el.plugs > 0).length >= 1 && (
              <React.Fragment>
                <div className="flex items-center gap-[20px]">
                  {Array.from({ length: 1 }, (_, i) => {
                    return <PlugVariant key={`plug-${i}`} />;
                  })}
                </div>
              </React.Fragment>
            )}
        </>
      )}
    </div>
  );
}

export default Panel;
