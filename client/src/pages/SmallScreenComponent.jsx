import Navbar from "../components/Navbar";

function SmallScreenComponent() {
  return (
    <div className="w-full h-[100vh] bg-black">
      <Navbar />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <img
          className="w-[200px] h-[200px]"
          src={
            "https://media3.giphy.com/media/YyKPbc5OOTSQE/giphy.webp?cid=790b7611yzrg1b7b0ksvoh5qjn6x4ix6zvm2grg55rqo5zis&ep=v1_gifs_search&rid=giphy.webp&ct=g"
          }
        />
        <h1 className="text-3xl font-medium text-zinc-50">
          <span className="text-red-600">Error-</span> Small Screen
        </h1>
        <h3 className="text-sm font-normal text-zinc-50 text-center p-2">
          Your screen is too small to view this page, kindly try reloading, if
          you see this screen again shift to a laptop, pc or a larger screen
        </h3>
      </div>
    </div>
  );
}

export default SmallScreenComponent;
