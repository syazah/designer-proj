import { useDrag } from "react-dnd";

function Draggable({ id, src }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id: id },
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
