import React, { useContext } from "react";
import DroppableCollection from "./DroppableCollection";
import CurtainVariant from "../VariantComponent/CurtainVariant";
import FansVariant from "../VariantComponent/FansVariant";
import PlugVariant from "../VariantComponent/PlugVariant";
import { PanelContext } from "../../context/PanelContextProvider";
function Panel({
  normalPanel = false,
  panelSize,
  panelGlass,
  panelFrame,
  panelVariant,
  panelIcons = [],
}) {
  const { spaceLeft } = useContext(PanelContext);
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

  return (
    <div
      style={{
        width: panelWidth,
        height: panelHeight,
        backgroundColor: panelGlass,
        borderColor: panelFrame,
      }}
      className={`bg-black border-[8px] ${
        normalPanel ? "scale-50" : ""
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
                            key={`${indexs}-${i}`}
                            id={`${indexs}-${i}`}
                            iconData={iconDataToSend}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex gap-[20px]">
                      {Array.from({ length: variant.switches / 2 }, (_, i) => {
                        return (
                          <DroppableCollection
                            key={`${indexs}-${i}`}
                            id={`${indexs}-${i}`}
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
                      return <FansVariant key={`fans-${i}`} />;
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
          {panelVariant.map((variant, i) => (
            <React.Fragment key={i}>
              {variant.plugs > 0 && (
                <div className="flex items-center gap-[20px]">
                  {Array.from({ length: variant.plugs }, (_, i) => {
                    return <PlugVariant key={`plug-${i}`} />;
                  })}
                </div>
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
}

export default Panel;
