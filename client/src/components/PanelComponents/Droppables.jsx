import { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { PanelContext } from "../../context/PanelContextProvider";
import { PanelIcons } from "../../../data/PanelSpecs";
function Droppables({ dropId, iconData, normalPanel }) {
  const { panelSpecs, setPanelSpecs } = useContext(PanelContext);
  const [imageDetail, setImageDetail] = useState(null);
  // DROPPABLE LOGIC
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item) => {
      showImageLogic(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  // SHOW IMAGE LOGIC
  function showImageLogic(id) {
    const imageData = PanelIcons.filter((img) => img.id === id);
    if (imageData && dropId) {
      setPanelSpecs((prevSpecs) => ({
        ...prevSpecs,
        panelIcons: {
          ...prevSpecs.panelIcons,
          [dropId]: imageData[0].src,
        },
      }));
      setImageDetail(imageData[0]);
    } else {
      alert("Image or dropId not found:");
    }
  }
  return (
    <>
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
          className={`w-[50px] h-[50px] border-[2px] transition-all duration-200 cursor-pointer  ${
            panelSpecs.droppableType === "0" ? "rounded-full" : ""
          } p-1`}
        >
          {iconData.length > 0 ? (
            <img
              className="w-full h-full object-contain"
              src={iconData[0][1]}
            />
          ) : (
            imageDetail != null && (
              <img
                className="w-full h-full object-contain"
                src={imageDetail.src}
              />
            )
          )}
        </div>
      )}
    </>
  );
}

export default Droppables;
