import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  uploadedFileName?: string;
  onClear?: () => void;
}

export function FileUpload({ onFileUpload, isUploading, uploadedFileName, onClear }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
    setDragActive(false);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  if (uploadedFileName) {
    return (
      <Card className="p-4 flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
        <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
            {uploadedFileName}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">File uploaded successfully</p>
        </div>
        {onClear && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onClear}
            className="text-green-600 dark:text-green-400"
            data-testid="button-clear-file"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragActive || dragActive
          ? "border-primary bg-primary/5 dark:bg-primary/10"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        }
        ${isUploading ? "pointer-events-none opacity-60" : ""}
      `}
      data-testid="dropzone-file-upload"
    >
      <input {...getInputProps()} data-testid="input-file-upload" />
      
      <div className="flex flex-col items-center gap-4">
        <div className={`
          h-16 w-16 rounded-full flex items-center justify-center
          transition-colors duration-200
          ${isDragActive || dragActive
            ? "bg-primary/10 dark:bg-primary/20"
            : "bg-muted"
          }
        `}>
          {isUploading ? (
            <div className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <Upload className={`h-8 w-8 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isUploading ? "Uploading..." : isDragActive ? "Drop your file here" : "Drag & drop your Excel file"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse your files
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Supports .xlsx, .xls, and .csv files</span>
        </div>
      </div>
    </div>
  );
}

export function CompactFileUpload({ onFileUpload, isUploading }: Omit<FileUploadProps, 'uploadedFileName' | 'onClear'>) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button 
        variant="default" 
        disabled={isUploading}
        className="gap-2"
        data-testid="button-upload-file"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload New File"}
      </Button>
    </div>
  );
}
