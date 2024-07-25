import html2canvas from "html2canvas";

const getImageOfComponent = (ref, panelName) => {
  if (ref.current && document.body.contains(ref.current)) {
    html2canvas(ref.current)
      .then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const imageLink = document.createElement("a");
        imageLink.href = imageData;
        imageLink.download = `${panelName}.png`;
        imageLink.click();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default getImageOfComponent;
