import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const getCompletePdfOfComponent = async (parentref) => {
  try {
    if (parentref.current && document.body.contains(parentref.current)) {
      const childPanels =
        parentref.current.querySelectorAll(".available-panel");
      const doc = new jsPDF({ unit: "px", format: "a4", compress: true });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginTop = 20;
      const imgWidth = pageWidth - 40; // Reduced width to accommodate border
      let currentY = marginTop + 10; // Added space for top border

      // Function to add border to current page
      const addBorder = () => {
        doc.setDrawColor(220, 20, 60); // Red border color
        doc.setLineWidth(2);
        // Draw rectangle border
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      };

      const generatePdf = async () => {
        // Add border to first page
        addBorder();

        // Add Title at the top
        doc.setFontSize(24);
        doc.setTextColor(220, 20, 60);
        doc.text("Panel Collection PDF", pageWidth / 2, currentY, {
          align: "center",
        });
        currentY += 30;

        // Process each panel
        for (let i = 0; i < childPanels.length; i++) {
          const element = childPanels[i];

          try {
            const canvas = await html2canvas(element);
            const imageData = canvas.toDataURL("image/png");
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Check if we need a new page
            if (currentY + imgHeight + 50 > pageHeight - 20) {
              // Adjusted for border
              doc.addPage();
              addBorder(); // Add border to new page
              currentY = marginTop + 10; // Reset Y position with border offset
            }

            // Add panel image
            doc.addImage(imageData, "JPEG", 20, currentY, imgWidth, imgHeight);
            currentY += imgHeight + 20;

            // Add horizontal line
            doc.setDrawColor(220, 20, 60);
            doc.setLineWidth(0.5);
            doc.line(20, currentY, pageWidth - 20, currentY);
            currentY += 15;

            // Add timestamp
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const timestamp = new Date().toLocaleString();
            doc.text(
              `Panel ${i + 1} - Generated at: ${timestamp}`,
              20,
              currentY
            );
            currentY += 30;
          } catch (error) {
            console.log("Error generating canvas:", error);
          }
        }

        doc.save("PanelCompleteCollection.pdf");
      };

      generatePdf();
    }
  } catch (error) {
    console.log(error);
  }
};

export default getCompletePdfOfComponent;
