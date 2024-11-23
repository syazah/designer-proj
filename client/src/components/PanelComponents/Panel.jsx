import React, { useContext } from "react";
import DroppableCollection from "./DroppableCollection";
import CurtainVariant from "../VariantComponent/CurtainVariant";
import FansVariant from "../VariantComponent/FansVariant";
import PlugVariant from "../VariantComponent/PlugVariant";
import DimmerVariant from "../VariantComponent/DimmerVariant";
import { PanelContext } from "../../context/PanelContextProvider";
function Panel({
  spaceLeft,
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
  const { panelSpecs } = useContext(PanelContext);
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
                    <PlugVariant
                      iconType={panelSpecs.extensionTypeOne}
                      key={`plug-${i}`}
                    />
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
                    <PlugVariant
                      iconType={panelSpecs.extensionTypeTwo}
                      key={`plug-${i}`}
                    />
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
