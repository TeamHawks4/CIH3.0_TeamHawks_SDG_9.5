import { useState, useCallback } from "react";
import { Search, Upload, FileText, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeepMatchSearchProps {
  onSearch?: (query: string, file?: File) => void;
  className?: string;
}

export function DeepMatchSearch({ onSearch, className }: DeepMatchSearchProps) {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSearch = () => {
    if (onSearch && (query.trim() || file)) {
      onSearch(query, file || undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("search-box", className)}>
      {/* Search Input */}
      <div className="flex items-center gap-3 mb-4">
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your innovation, technology, or paste problem statement..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
        />
        <button
          onClick={handleSearch}
          className="pill-button-primary py-2.5 px-5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Deep Match</span>
        </button>
      </div>

      {/* File Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "drop-zone relative",
          isDragging && "drop-zone-active"
        )}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-accent" />
            </div>
            <p className="text-foreground font-medium mb-1">
              Drag & drop your pitch deck or problem statement
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              PDF files up to 10MB
            </p>
            <label className="pill-button-secondary cursor-pointer inline-flex py-2">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              Browse Files
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
