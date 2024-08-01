import { Link } from "react-router-dom";
function ComNavbar() {
  return (
    <div className="w-full border-y-[2px] border-zinc-900 flex justify-between items-center pl-2 sticky top-0 bg-gray-300 z-50">
      <h1 className="flex justify-center items-center text-black font-semibold text-2xl">
        Standard <span className="text-red-800">Panels</span>
      </h1>
      <ul className="flex justify-center items-center h-[50px]">
        <li className="bg-red-800 h-full flex justify-center items-center p-2 border-l-[2px] border-zinc-900">
          <Link to={"/"} className="text-gray-300">
            Home
          </Link>
        </li>
        <li className="bg-red-800 h-full flex justify-center items-center p-2 border-x-[2px] border-zinc-900">
          <Link to={"/customise"} className="text-gray-300">
            Collections
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ComNavbar;
