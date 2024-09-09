import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const OrderPdf = (parentref) => {
  if (parentref.current && document.body.contains(parentref.current)) {
    const childPanels = parentref.current.querySelectorAll(".available-panel");
    const doc = new jsPDF();
    const imgWidth = 190;
    const marginTop = 10;
    const generatePdf = async () => {
      doc.text("Panel Complete Collection", 10, marginTop);

      for (let i = 0; i < childPanels.length; i++) {
        const element = childPanels[i];

        try {
          const canvas = await html2canvas(element);
          const imageData = canvas.toDataURL("image/png");
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let position = marginTop + (i > 0 ? 50 : 0);

          // Check if the image fits in the current page, otherwise add a new page
          if (i > 0) {
            doc.addPage();
            position = marginTop;
          }

          doc.addImage(imageData, "PNG", 10, position, imgWidth, imgHeight);
        } catch (error) {
          console.log("Error generating canvas:", error);
        }
      }
      const pdfBlob = doc.output("blob");
      return pdfBlob;
    };
    return generatePdf();
  }
};

export default OrderPdf;
