function Box({ heading, children, subheading, bgcolor }) {
  return (
    <div
      className={`w-2/5 ${bgcolor} rounded-xl shadow-2xl p-6 overflow-hidden`}
    >
      <h2 className="text-gray-100 border-b-[2px] border-text-gray-100 text-lg font-semibold">
        {heading}
      </h2>
      <p className="text-sm text-gray-200">{subheading}</p>
      {children}
    </div>
  );
}

export default Box;
