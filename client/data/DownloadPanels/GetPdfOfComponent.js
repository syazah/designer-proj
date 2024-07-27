import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const getPdfOfComponent = (ref, panelName) => {
  if (ref.current && document.body.contains(ref.current)) {
    html2canvas(ref.current)
      .then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        const doc = new jsPDF();
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let position = 20;
        doc.addImage(imageData, "PNG", 10, position, imgWidth, imgHeight);
        doc.text(`Smart Home Panel Collection ${panelName}`, 10, 10);
        doc.save(`${panelName}.pdf`);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default getPdfOfComponent;
