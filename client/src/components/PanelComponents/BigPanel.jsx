import DroppableCollection from "./DroppableCollection";
import CurtainVariant from "../VariantComponent/CurtainVariant";
import FansVariant from "../VariantComponent/FansVariant";
import PlugVariant from "../VariantComponent/PlugVariant";
import React, { useContext } from "react";
import DimmerVariant from "../VariantComponent/DimmerVariant";
import { PanelContext } from "../../context/PanelContextProvider";
function BigPanel({
  downloadingPanelPdf,
  upSpace,
  spaceLeft,
  setSpaceLeft,
  showExtraSpace = true,
  panelGlass,
  extensionOne = undefined,
  extensionTwo = undefined,
  panelFrame,
  panelVariant,
  fanIcon,
  dimmerIcon,
  panelIcons = [],
  droppableType,
}) {
  const { panelSpecs, setPanelSpecs } = useContext(PanelContext);
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
                    className={`w-[150px] ${
                      downloadingPanelPdf
                        ? "border-none"
                        : "border-2 border-red-800"
                    } h-[150px]`}
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
                    className={`w-[150px] ${
                      downloadingPanelPdf
                        ? "border-none"
                        : "border-2 border-red-800"
                    } h-[150px]`}
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
                      className={`w-[150px] ${
                        downloadingPanelPdf
                          ? "border-none"
                          : "border-2 border-red-800"
                      } h-[150px]`}
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
                                const index = panelVariant[1].indexOf("ext");
                                if (index !== -1) {
                                  panelVariant[1].splice(index, 1);
                                  setSpaceLeft((prev) => prev + 2);

                                  setPanelSpecs({
                                    ...panelSpecs,
                                    savedSpaceLeft:
                                      panelSpecs.savedSpaceLeft + 2,
                                    extensionTypeOne:
                                      panelSpecs.extensionTypeTwo,
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
                      className={`w-[150px] ${
                        downloadingPanelPdf
                          ? "border-none"
                          : "border-2 border-red-800"
                      } h-[150px]`}
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
                                const index = panelVariant[1].indexOf("ext");
                                if (index !== -1) {
                                  panelVariant[1].splice(index, 1);
                                  setSpaceLeft((prev) => prev + 2);
                                  setPanelSpecs({
                                    ...panelSpecs,
                                    savedSpaceLeft:
                                      panelSpecs.savedSpaceLeft + 2,
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
          </div>
        </div>
      )}
    </div>
  );
}

export default BigPanel;
