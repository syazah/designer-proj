import Navbar from "../components/Navbar";

function ErrorNotFound() {
  return (
    <div className="w-full h-screen bg-black flex flex-col">
      <Navbar firstHead={"not"} secondHead={"found"} />
      <div className="w-full h-full flex justify-center items-center">
        <img
          src={
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHZvbTkyYXo0NDE4cTVnMHQ3MGl3a3dmaWRwdncwdHc3bTV2M2ZjZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YyKPbc5OOTSQE/giphy.webp"
          }
        />
      </div>
    </div>
  );
}

export default ErrorNotFound;
