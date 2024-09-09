function PlugVariant({ iconType }) {
  return (
    <div className="w-[158px] h-[158px] flex">
      {iconType === "pin5Amp10Socket" ? (
        <img
          className="w-[150px] h-[150px] "
          src="/ICONS/extensions/plug.png"
        />
      ) : (
        <img
          className="w-[150px] h-[150px] "
          src="/ICONS/extensions/typebc.png"
        />
      )}
    </div>
  );
}

export default PlugVariant;
