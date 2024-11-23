import DroppableCollection from "./DroppableCollection";
import CurtainVariant from "../VariantComponent/CurtainVariant";
import FansVariant from "../VariantComponent/FansVariant";
import PlugVariant from "../VariantComponent/PlugVariant";
import React, { useContext } from "react";
import DimmerVariant from "../VariantComponent/DimmerVariant";
import { PanelContext } from "../../context/PanelContextProvider";
function BigPanel({
  upSpace,
  spaceLeft,
  showExtraSpace = true,
  panelGlass,
  panelFrame,
  panelVariant,
  fanIcon,
  dimmerIcon,
  panelIcons = [],
  droppableType,
}) {
  const { panelSpecs } = useContext(PanelContext);
  // PANEL
  return (
    <div
      style={{
        width: "600px",
        height: "400px",
        backgroundColor: panelGlass,
        borderColor: panelFrame,
      }}
      className={`bg-black border-[8px] transition-all duration-200 rounded-lg shadow-2xl flex justify-center gap-[30px] relative`}
    >
      {panelVariant[0].length === 0 && panelVariant[1].length === 0 ? (
        <div className="w-full flex flex-col h-full justify-center items-center gap-[10px]">
          {panelVariant[0].length === 0 && (
            <div className="w-full flex justify-center items-center gap-[30px] p-2">
              {Array.from({ length: 3 }, (_, i) => {
                return (
                  <div
                    key={i}
                    className="w-[150px] h-[150px] border-2 border-red-800"
                  ></div>
                );
              })}
            </div>
          )}
          {panelVariant[1].length === 0 && (
            <div className="w-full flex justify-center items-center gap-[30px] p-2">
              {Array.from({ length: 3 }, (_, i) => {
                return (
                  <div
                    key={i}
                    className="w-[150px] h-[150px] border-2 border-red-800"
                  ></div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-start gap-[30px] px-8">
          <div className=" flex justify-start items-center gap-[30px]">
            {panelVariant[0].map((variant, indexs) => {
              return (
                <React.Fragment key={indexs}>
                  {variant.switches > 0 ? (
                    panelIcons.length > 0 ? (
                      <div className="flex gap-[20px]">
                        {Array.from(
                          { length: variant.switches / 2 },
                          (_, i) => {
                            const iconDataToSend = panelIcons.filter((item) =>
                              item[0].startsWith(`0-${indexs}-${i}`)
                            );
                            return (
                              <DroppableCollection
                                droppableType={droppableType}
                                key={`0-${indexs}-${i}`}
                                id={`0-${indexs}-${i}`}
                                iconData={iconDataToSend}
                              />
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-[20px]">
                        {Array.from(
                          { length: variant.switches / 2 },
                          (_, i) => {
                            return (
                              <DroppableCollection
                                droppableType={droppableType}
                                key={`0-${indexs}-${i}`}
                                id={`0-${indexs}-${i}`}
                              />
                            );
                          }
                        )}
                      </div>
                    )
                  ) : (
                    <></>
                  )}
                  {variant.curtains > 0 && (
                    <div className="flex gap-[20px]">
                      {Array.from({ length: variant.curtains }, (_, i) => {
                        return <CurtainVariant key={`0-curtain-${i}`} />;
                      })}
                    </div>
                  )}
                  {variant.fans > 0 && (
                    <div className="flex items-center gap-[20px]">
                      {Array.from({ length: variant.fans }, (_, i) => {
                        return (
                          <FansVariant fanIcon={fanIcon} key={`0-fans-${i}`} />
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

            {showExtraSpace && upSpace > 0 && (
              <div className="flex items-center gap-[20px]">
                {Array.from({ length: upSpace / 2 }, (_, i) => {
                  return (
                    <div
                      key={`0-box-${i}`}
                      className="w-[150px] h-[150px] border-2 border-red-800"
                    ></div>
                  );
                })}
              </div>
            )}

            {/* EXTENSIONS  */}
            {panelVariant[0].map((variant, i) => (
              <React.Fragment key={i}>
                {variant.pin5Amp10Socket > 0 && (
                  <div className="flex items-center gap-[20px]">
                    {Array.from({ length: variant.plugs }, (_, i) => {
                      return <PlugVariant key={`0-plug-${i}`} />;
                    })}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* DOWN  */}
          <div className=" flex justify-start items-center gap-[30px]">
            {/* EXTENSIONS  */}
            {panelVariant[1].filter((el) => el === "ext").length >= 1 && (
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
            {panelVariant[1].map((variant, indexs) => {
              return (
                <React.Fragment key={indexs}>
                  {variant.switches > 0 ? (
                    panelIcons.length > 0 ? (
                      <div className="flex gap-[20px]">
                        {Array.from(
                          { length: variant.switches / 2 },
                          (_, i) => {
                            const iconDataToSend = panelIcons.filter((item) =>
                              item[0].startsWith(`1-${indexs}-${i}`)
                            );
                            return (
                              <DroppableCollection
                                droppableType={droppableType}
                                key={`1-${indexs}-${i}`}
                                id={`1-${indexs}-${i}`}
                                iconData={iconDataToSend}
                              />
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-[20px]">
                        {Array.from(
                          { length: variant.switches / 2 },
                          (_, i) => {
                            return (
                              <DroppableCollection
                                droppableType={droppableType}
                                key={`1-${indexs}-${i}`}
                                id={`1-${indexs}-${i}`}
                              />
                            );
                          }
                        )}
                      </div>
                    )
                  ) : (
                    <></>
                  )}
                  {variant.curtains > 0 && (
                    <div className="flex gap-[20px]">
                      {Array.from({ length: variant.curtains }, (_, i) => {
                        return <CurtainVariant key={`1-curtain-${i}`} />;
                      })}
                    </div>
                  )}
                  {variant.fans > 0 && (
                    <div className="flex items-center gap-[20px]">
                      {Array.from({ length: variant.fans }, (_, i) => {
                        return (
                          <FansVariant fanIcon={fanIcon} key={`1-fans-${i}`} />
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

            {spaceLeft - upSpace > 0 && (
              <div className="flex items-center gap-[20px]">
                {Array.from({ length: (spaceLeft - upSpace) / 2 }, (_, i) => {
                  return (
                    <div
                      key={`1-box-${i}`}
                      className="w-[150px] h-[150px] border-2 border-red-800"
                    ></div>
                  );
                })}
              </div>
            )}
            {/* EXTENSIONS  */}
            {panelVariant[1].filter((el) => el === "ext").length >= 2 && (
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
          </div>
        </div>
      )}
    </div>
  );
}

export default BigPanel;
