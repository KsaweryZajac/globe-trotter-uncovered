
import React from 'react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Trip } from './TripForm';
import { SaveIcon } from 'lucide-react';

interface TripExportProps {
  trip: Trip;
}

const TripExport: React.FC<TripExportProps> = ({ trip }) => {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Set up PDF
    const startDate = parseISO(trip.startDate);
    const endDate = parseISO(trip.endDate);
    const tripDuration = differenceInDays(endDate, startDate) + 1;
    
    // Add title
    doc.setFontSize(20);
    doc.text(trip.title, 20, 20);
    
    // Add dates
    doc.setFontSize(12);
    doc.text(`${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')} (${tripDuration} days)`, 20, 30);
    
    // Add destinations
    doc.setFontSize(16);
    doc.text('Destinations', 20, 45);
    
    let yPos = 55;
    trip.destinations.forEach((dest, index) => {
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${dest.city}, ${dest.country.name.common}`, 25, yPos);
      yPos += 10;
      
      if (dest.selectedPOIs && dest.selectedPOIs.length > 0) {
        doc.setFontSize(12);
        dest.selectedPOIs.forEach(poi => {
          doc.text(`• ${poi.name}`, 30, yPos);
          yPos += 7;
          
          if (poi.description) {
            const description = poi.description.substring(0, 80) + (poi.description.length > 80 ? '...' : '');
            doc.setFontSize(10);
            doc.text(description, 35, yPos);
            yPos += 7;
            doc.setFontSize(12);
          }
          
          // Make sure we don't overflow page
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      }
      
      // Add some space between destinations
      yPos += 5;
      
      // Make sure we don't overflow page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Save the PDF
    doc.save(`${trip.title.replace(/\s+/g, '_')}_itinerary.pdf`);
  };

  return (
    <Button onClick={handleExportPDF} variant="outline">
      <SaveIcon className="h-4 w-4 mr-2" />
      Export as PDF
    </Button>
  );
};

export default TripExport;
