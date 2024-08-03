import { useDrag } from "react-dnd";

function Draggable({ id, src, mainId }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id: id, mainId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <img
      className="w-[40px] cursor-pointer"
      ref={drag}
      src={src}
      style={isDragging ? { width: "40px" } : {}}
    />
  );
}

export default Draggable;
