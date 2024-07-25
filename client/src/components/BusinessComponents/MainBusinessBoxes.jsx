import Box from "../AdminComponents/Box";
import { Link } from "react-router-dom";

function MainBusinessBoxes() {
  return (
    <div className="box-wrapper flex w-full justify-start p-4 ">
      {/* CREATE USER  */}
      <Box
        heading={"Create Users"}
        subheading={
          "You have the control of this business panel and you can create clients for your business"
        }
      >
        <div className="flex w-full p-4 justify-center items-center gap-4">
          <div className="relative flex w-[150px] h-[150px] flex-col justify-center items-center p-6 rounded-full bg-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="size-18 stroke-zinc-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            <Link
              to={"/business/signup/client"}
              className="absolute w-[50px] h-[50px] rounded-full bg-red-500 flex justify-center items-center -bottom-2 right-0 border-2 border-black cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </Link>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default MainBusinessBoxes;
