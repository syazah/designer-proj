import Droppables from "./Droppables";

function DroppableCollection({
  id,
  iconData = [],
  normalPanel,
  droppableType,
}) {
  const firstIcons = iconData.filter((item) =>
    item[0].startsWith(`${id}-first`)
  );
  const secondIcons = iconData.filter((item) =>
    item[0].startsWith(`${id}-second`)
  );
  return (
    <div className="w-[64px] h-full flex flex-col justify-center gap-[45px]">
      <Droppables
        dropId={`${id}-first`}
        iconData={firstIcons}
        normalPanel={normalPanel}
        droppableType={droppableType}
      />
      <Droppables
        dropId={`${id}-second`}
        iconData={secondIcons}
        normalPanel={normalPanel}
        droppableType={droppableType}
      />
    </div>
  );
}

export default DroppableCollection;
