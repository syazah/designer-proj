import React from "react";
import DroppableCollection from "./DroppableCollection";
import CurtainVariant from "../VariantComponent/CurtainVariant";
import FansVariant from "../VariantComponent/FansVariant";
function Panel({
  panelSize,
  panelGlass,
  panelFrame,
  panelVariant,
  panelIcons = [],
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

  return (
    <div
      style={{
        width: panelWidth,
        height: panelHeight,
        backgroundColor: panelGlass,
        borderColor: panelFrame,
      }}
      className={`bg-black border-[8px] transition-all duration-200 rounded-lg shadow-2xl flex justify-center gap-[30px] relative`}
    >
      <div className="panel-clip-path-absolute absolute bg-white w-full h-full z-10"></div>

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
                {variant.switches > 0 && panelIcons.length > 0 ? (
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
                )}
                {variant.curtains > 0 && (
                  <div className="flex gap-[20px]">
                    {Array.from({ length: variant.curtains }, (_, i) => {
                      return <CurtainVariant key={i} />;
                    })}
                  </div>
                )}
                {variant.fans > 0 && (
                  <div className="flex items-center gap-[20px]">
                    {Array.from({ length: variant.fans }, (_, i) => {
                      return <FansVariant key={i} />;
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </>
      )}
    </div>
  );
}

export default Panel;
