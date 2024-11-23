import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const getCompletePdfOfComponent = (parentref) => {
  if (parentref.current && document.body.contains(parentref.current)) {
    const childPanels = parentref.current.querySelectorAll(".available-panel");
    const doc = new jsPDF({ unit: "px", format: "a4", compress: true });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginTop = 10;
    const imgWidth = pageWidth - 10;
    let currentY = marginTop + 20;
    const generatePdf = async () => {
      doc.text("Panel Collection PDF", 10, marginTop);

      for (let i = 0; i < childPanels.length; i++) {
        const element = childPanels[i];

        try {
          const canvas = await html2canvas(element);
          const imageData = canvas.toDataURL("image/png");
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          if (currentY + imgHeight > pageHeight - 10) {
            doc.addPage();
            currentY = marginTop;
          }
          doc.addImage(imageData, "JPEG", 10, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;
        } catch (error) {
          console.log("Error generating canvas:", error);
        }
      }
      doc.save("PanelCompleteCollection.pdf");
    };
    generatePdf();
  }
};

export default getCompletePdfOfComponent;
