
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trip } from './TripForm';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

interface TripExportButtonProps {
  trip: Trip;
}

const TripExportButton: React.FC<TripExportButtonProps> = ({ trip }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    try {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text(trip.name || trip.title, 20, 20);
      
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 25, 190, 25);
      
      doc.setFontSize(12);
      doc.text(`Travel Dates: ${format(startDate, "MMMM d, yyyy")} - ${format(endDate, "MMMM d, yyyy")}`, 20, 35);
      doc.text(`Starting Country: ${trip.startCountry || trip.homeCountry || "Not specified"}`, 20, 42);
      
      doc.setFontSize(14);
      doc.setTextColor(70, 70, 70);
      doc.text("Destinations", 20, 55);
      
      let yPosition = 65;
      trip.destinations.forEach((destination, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${destination.countryName}${destination.cityName ? ` - ${destination.cityName}` : ''}`, 25, yPosition);
        yPosition += 7;
        
        if (destination.durationDays) {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Duration: ${destination.durationDays} days`, 30, yPosition);
          yPosition += 7;
        }
        
        if (destination.notes) {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          
          const notesLines = doc.splitTextToSize(destination.notes, 150);
          doc.text(notesLines, 30, yPosition);
          yPosition += 7 * notesLines.length;
        }
        
        yPosition += 3;
      });
      
      if (trip.totalCost) {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        yPosition += 10;
        doc.setFontSize(14);
        doc.setTextColor(70, 70, 70);
        doc.text("Cost Estimate", 20, yPosition);
        
        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Estimated Cost: $${trip.totalCost.toLocaleString()}`, 25, yPosition);
      }
      
      const fileName = `${(trip.name || trip.title).replace(/\s+/g, '_')}_travel_plan.pdf`;
      doc.save(fileName);
      
      toast.success("Trip exported successfully", {
        description: `The PDF has been downloaded as "${fileName}".`,
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export trip", {
        description: "There was an error generating the PDF. Please try again.",
      });
    }
  };

  return (
    <Button onClick={exportToPDF} variant="outline">
      <SaveIcon className="mr-2 h-4 w-4" />
      Export as PDF
    </Button>
  );
};

export default TripExportButton;
