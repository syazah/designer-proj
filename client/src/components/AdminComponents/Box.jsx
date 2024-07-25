function Box({ heading, children, subheading }) {
  return (
    <div className="w-2/5 bg-red-600 rounded-xl shadow-2xl p-6">
      <h2 className="text-gray-100 border-b-[2px] border-text-gray-100 text-lg font-semibold">
        {heading}
      </h2>
      <p className="text-sm text-gray-200">{subheading}</p>
      {children}
    </div>
  );
}

export default Box;
