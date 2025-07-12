import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FileDown, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisResult, TabType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ReportGeneratorProps {
  data: AnalysisResult;
  activeTab: TabType;
}

export default function ReportGenerator({ data, activeTab }: ReportGeneratorProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const generateReport = async () => {
    if (generating) return;
    
    setGenerating(true);
    setSuccess(false);
    
    try {
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Add logo and header
      pdf.setFontSize(24);
      pdf.setTextColor(0, 60, 105);
      pdf.text("Risk Sense AI", pageWidth / 2, 20, { align: 'center' });
      
      // Add subtitle
      pdf.setFontSize(16);
      pdf.setTextColor(70, 70, 70);
      pdf.text("Investment Analysis Report", pageWidth / 2, 30, { align: 'center' });
      
      // Add date
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on ${dateStr}`, pageWidth / 2, 38, { align: 'center' });
      
      // Add divider
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, 42, pageWidth - 15, 42);
      
      let yPos = 50;
      
      // Country and query information
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Country: ${data.countryName}`, 15, yPos);
      yPos += 8;
      pdf.text(`Query: ${data.query}`, 15, yPos);
      yPos += 15;
      
      // Create an array of content sections
      const sections = [];
      
      // Overview Section
      sections.push({
        title: 'Overview',
        content: () => {
          pdf.setFontSize(16);
          pdf.setTextColor(0, 60, 105);
          pdf.text('Overview', 15, yPos);
          yPos += 8;
          
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          const { overview } = data;
          

          pdf.text(`GDP: ${overview.gdp}`, 15, yPos);
          yPos += 6;
          pdf.text(`GDP Per Capita: ${overview.gdpPerCapita}`, 15, yPos);
          yPos += 6;
          pdf.text(`Government: ${overview.government}`, 15, yPos);
          yPos += 10;
          
          // Summary
          pdf.setFontSize(12);
          pdf.setTextColor(50, 50, 50);
          
          for (const paragraph of overview.summary) {
            // Split long paragraphs
            const splitText = pdf.splitTextToSize(paragraph, pageWidth - 30);
            for (const line of splitText) {
              if (yPos > 270) {
                pdf.addPage();
                yPos = 20;
              }
              pdf.text(line, 15, yPos);
              yPos += 6;
            }
            yPos += 4; // Add space between paragraphs
          }
        }
      });
      
      // Economic Data Section
      sections.push({
        title: 'Economic Data',
        content: () => {
          if (yPos > 230) {
            pdf.addPage();
            yPos = 20;
          }
          
          pdf.setFontSize(16);
          pdf.setTextColor(0, 60, 105);
          pdf.text('Economic Indicators', 15, yPos);
          yPos += 10;
          
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          
          const { economicData } = data;
          if (economicData.indicators && economicData.indicators.length > 0) {
            // Create table for economic indicators
            const indicators = economicData.indicators;
            const headers = ['Indicator', 'Value', 'Year', 'Change'];
            const rows = indicators.map(ind => [
              ind.indicator,
              ind.value,
              ind.year,
              `${ind.change.value} ${ind.change.direction === 'up' ? '↑' : ind.change.direction === 'down' ? '↓' : '→'}`
            ]);
            
            // Table config
            const col1Width = 60;
            const col2Width = 40;
            const col3Width = 25;
            const col4Width = 40;
            const rowHeight = 8;
            
            // Draw header
            pdf.setFillColor(240, 240, 240);
            pdf.rect(15, yPos - 5, col1Width + col2Width + col3Width + col4Width, rowHeight, 'F');
            pdf.setTextColor(50, 50, 50);
            pdf.setFontSize(10);
            pdf.text(headers[0], 17, yPos);
            pdf.text(headers[1], 17 + col1Width, yPos);
            pdf.text(headers[2], 17 + col1Width + col2Width, yPos);
            pdf.text(headers[3], 17 + col1Width + col2Width + col3Width, yPos);
            yPos += rowHeight;
            
            // Draw rows
            pdf.setTextColor(0, 0, 0);
            for (const row of rows) {
              if (yPos > 270) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.text(row[0], 17, yPos);
              pdf.text(row[1], 17 + col1Width, yPos);
              pdf.text(row[2], 17 + col1Width + col2Width, yPos);
              pdf.text(row[3], 17 + col1Width + col2Width + col3Width, yPos);
              yPos += rowHeight;
            }
            
            yPos += 10;
            
            // Add analysis text
            if (economicData.analysis && economicData.analysis.length > 0) {
              pdf.setFontSize(12);
              pdf.setTextColor(50, 50, 50);
              pdf.text('Economic Analysis:', 15, yPos);
              yPos += 8;
              
              for (const paragraph of economicData.analysis) {
                const splitText = pdf.splitTextToSize(paragraph, pageWidth - 30);
                for (const line of splitText) {
                  if (yPos > 270) {
                    pdf.addPage();
                    yPos = 20;
                  }
                  pdf.text(line, 15, yPos);
                  yPos += 6;
                }
                yPos += 2;
              }
            }
          }
        }
      });
      
      // P3 Strategy Section
      sections.push({
        title: 'P3 Strategy',
        content: async () => {
          if (yPos > 230) {
            pdf.addPage();
            yPos = 20;
          }
          
          try {
            // Get P3 tab content
            const p3ElementId = document.getElementById('p3-content');
            if (!p3ElementId) {
              throw new Error('P3 content not found');
            }
            
            // First add title
            pdf.setFontSize(16);
            pdf.setTextColor(0, 60, 105);
            pdf.text('P3 Investment Strategy (Predict, Prevent, Protect)', 15, yPos);
            yPos += 10;
            
            // Capture a screenshot of the P3 tab and add it to the PDF
            const p3TabElement = document.querySelector('[data-tab="p3"]');
            if (p3TabElement) {
              const canvas = await html2canvas(p3TabElement as HTMLElement);
              const imgData = canvas.toDataURL('image/png');
              
              // Calculate width to maintain aspect ratio
              const imgWidth = pageWidth - 30;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;
              
              // Check if we need a new page
              if (yPos + imgHeight > 270) {
                pdf.addPage();
                yPos = 20;
              }
              
              pdf.addImage(imgData, 'PNG', 15, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 10;
            } else {
              // Fallback if the element can't be found
              pdf.setFontSize(12);
              pdf.setTextColor(50, 50, 50);
              pdf.text('P3 Strategy data is not available in the report.', 15, yPos);
              yPos += 10;
            }
          } catch (error) {
            console.error('Error adding P3 strategy to PDF:', error);
            pdf.setFontSize(12);
            pdf.setTextColor(200, 0, 0);
            pdf.text('Error including P3 Strategy data in the report.', 15, yPos);
            yPos += 10;
          }
        }
      });
      
      // AI Insights Section
      sections.push({
        title: 'AI Insights',
        content: () => {
          if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
          }
          
          pdf.setFontSize(16);
          pdf.setTextColor(0, 60, 105);
          pdf.text('AI-Generated Insights', 15, yPos);
          yPos += 8;
          
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text('Powered by Mistral Small 3.1 24B', 15, yPos);
          yPos += 10;
          
          // Extract text from AI insights
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          
          // Get insights without HTML tags
          const insightsText = data.aiInsights.content
            .replace(/\{"analysis":/, "")
            .replace(/,"followUpQuestions":.+$/, "")
            .replace(/^\s*"/, "")
            .replace(/"\s*$/, "")
            .replace(/<[^>]*>/g, '')
            .split('\n')
            .filter(line => line.trim() !== '');
          
          // Add to PDF
          for (const paragraph of insightsText) {
            const splitText = pdf.splitTextToSize(paragraph, pageWidth - 30);
            for (const line of splitText) {
              if (yPos > 270) {
                pdf.addPage();
                yPos = 20;
              }
              pdf.text(line, 15, yPos);
              yPos += 6;
            }
            yPos += 2;
          }
        }
      });
      
      // Footer on each page
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Risk Sense AI - Investment Analysis - Page ${i} of ${totalPages}`, pageWidth / 2, 290, { align: 'center' });
      }
      
      // Add sections based on current active tab (prioritize that content first)
      const activeSection = sections.find(s => s.title.toLowerCase().includes(activeTab.toLowerCase()));
      if (activeSection) {
        await activeSection.content();
      }
      
      // Add all other sections
      for (const section of sections) {
        if (section !== activeSection) {
          await section.content();
        }
      }
      
      // Save the PDF
      pdf.save(`risksense_${data.countryName.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
      
      // Show success notification
      setSuccess(true);
      toast({
        title: "Report generated successfully",
        description: "Your PDF report has been downloaded",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error generating report",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <Button 
      variant="outline"
      className="gap-2 border-blue-600/30 hover:bg-blue-600/10 text-blue-700"
      onClick={generateReport}
      disabled={generating}
    >
      {generating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : success ? (
        <>
          <Check className="h-4 w-4" />
          Report Generated
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Generate Report
        </>
      )}
    </Button>
  );
}