function Box({
  heading,
  children,
  subheading,
  bgcolor,
  textcolor = "text-gray-100",
}) {
  return (
    <div
      className={`w-2/5 ${bgcolor} rounded-xl shadow-2xl p-6 overflow-hidden`}
    >
      <h2
        className={`${textcolor} border-b-[2px] border-text-gray-100 text-lg font-semibold`}
      >
        {heading}
      </h2>
      <p className={`text-sm ${textcolor}`}>{subheading}</p>
      {children}
    </div>
  );
}

export default Box;
