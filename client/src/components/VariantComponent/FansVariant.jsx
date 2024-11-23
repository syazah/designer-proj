import { useContext, useState } from "react";
import { PanelContext } from "../../context/PanelContextProvider";
import { useDrop } from "react-dnd";
import { PanelIcons } from "../../../data/PanelSpecs";

function FansVariant({ normalPanel, fanIcon }) {
  const { panelSpecs, setPanelSpecs } = useContext(PanelContext);
  const [imageDetail, setImageDetail] = useState({
    id: "70",
    src: "/ICONS/fans/70.png",
  });
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item) => {
      showImageLogic(item.id, item.mainId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  function showImageLogic(id, mainId) {
    const imageData = PanelIcons[mainId].filter((img) => img.id === id);
    if (imageData) {
      setPanelSpecs((prevSpecs) => ({
        ...prevSpecs,
        fanIcon: imageData[0],
      }));
      setImageDetail(imageData[0]);
    } else {
      alert("Image or dropId not found:");
    }
  }
  return (
    <div className=" w-[158px] h-[158px] flex overflow-hidden">
      <div className="fan-indicators flex flex-col gap-[12px] justify-center items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            style={{ backgroundColor: panelSpecs.droppableColor }}
            className="w-[10px] h-[10px] rounded-full"
          ></div>
        ))}
      </div>

      {/* BUTTON TOUCH  */}
      <div className="fan-indicators flex flex-col justify-center items-end w-[74px]">
        {normalPanel ? (
          <div
            style={{ borderColor: panelSpecs.droppableColor }}
            className={`w-[50px] h-[50px] border-[4px] transition-all duration-200 cursor-pointer rounded-full p-1 flex justify-center items-center`}
          >
            <div
              style={{ backgroundColor: panelSpecs.droppableColor }}
              className="w-[15px] h-[15px]"
            ></div>
          </div>
        ) : (
          <div
            style={
              isOver
                ? { borderColor: "green" }
                : { borderColor: panelSpecs.droppableColor }
            }
            ref={drop}
            className={`w-[50px] h-[50px] border-[2px] transition-all duration-200 cursor-pointer rounded-full  ${
              panelSpecs.droppableType === "0" ? "rounded-full" : ""
            } p-1`}
          >
            {fanIcon != null && (
              <img
                className="w-full h-full object-contain"
                src={fanIcon?.src}
              />
            )}
          </div>
        )}
        {/* <img className="w-full" src="/ICONS/fans/fan1.png" /> */}
      </div>
      <div className="w-[74px] flex flex-col items-center gap-[40px] justify-center">
        <div
          style={{ borderColor: panelSpecs.droppableColor }}
          className="w-[50px] h-[50px] rounded-full border-2 flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={panelSpecs.droppableColor}
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </div>
        <div
          style={{ borderColor: panelSpecs.droppableColor }}
          className="w-[50px] h-[50px] rounded-full border-2 flex justify-center items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={panelSpecs.droppableColor}
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FansVariant;
