import Droppables from "./Droppables";

function DroppableCollection({ id, iconData = [] }) {
  const firstIcons = iconData.filter((item) =>
    item[0].startsWith(`${id}-first`)
  );
  const secondIcons = iconData.filter((item) =>
    item[0].startsWith(`${id}-second`)
  );
  return (
    <div className="w-[64px] h-full flex flex-col justify-center gap-[45px]">
      <Droppables dropId={`${id}-first`} iconData={firstIcons} />
      <Droppables dropId={`${id}-second`} iconData={secondIcons} />
    </div>
  );
}

export default DroppableCollection;
