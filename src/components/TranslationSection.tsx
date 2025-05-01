
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlobeIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface TranslationSectionProps {
  countryName: string;
  translation: string | null;
  onTranslate: (text: string, targetLang: string) => void;
  isLoading: boolean;
  error: string | null;
}

const languages = [
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" }
];

const TranslationSection = ({
  countryName,
  translation,
  onTranslate,
  isLoading,
  error
}: TranslationSectionProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const { toast } = useToast();
  
  // Reset translation state when country changes
  useEffect(() => {
    // Reset UI when country changes
    setSelectedLanguage("es");
  }, [countryName]);

  const handleTranslate = () => {
    if (!countryName) return;
    
    onTranslate(countryName, selectedLanguage);
    
    // Show a toast notification when translation starts
    toast({
      title: "Translating...",
      description: `Translating "${countryName}" to ${languages.find(l => l.value === selectedLanguage)?.label}`,
    });
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Translate Country Name</h4>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslate}
            disabled={isLoading || !countryName}
            className="flex-shrink-0"
          >
            <GlobeIcon className="h-4 w-4 mr-1" />
            Translate
          </Button>
        </div>
        
        {isLoading ? (
          <Skeleton className="h-6 w-full" />
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : translation ? (
          <div className="text-sm p-2 bg-muted rounded-md">
            <strong>{languages.find(l => l.value === selectedLanguage)?.label}:</strong> {translation}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TranslationSection;
