import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../lib/supabase';

interface CVFileUploadProps {
    currentFile: string | File | null;
    onUploadComplete: (file: File | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function CVFileUpload({ currentFile, onUploadComplete }: CVFileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const validateFile = (file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Only PDF files are accepted';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 5MB';
        }
        return null;
    };

    const uploadFile = async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            toast({
                title: 'Invalid file',
                description: validationError,
                variant: 'destructive',
            });
            return;
        }

        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');
            onUploadComplete(file);
            toast({
                title: 'File uploaded',
                description: 'Your CV has been uploaded successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Upload failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const removeFile = async () => {
        if (!currentFile) return;

        try {
            onUploadComplete(null);
            toast({
                title: 'File removed',
                description: 'Your CV has been removed.',
            });
        } catch (error: any) {
            toast({
                title: 'Remove failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const getDisplayName = (file: string) => {
        return file.split('--')[0];
    };

    if (currentFile) {
        return (
            <div className="flex items-center gap-3 p-3 bg-background/50 border border-border rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground flex-1 truncate">
                    {getDisplayName(typeof currentFile === 'string' ? currentFile : currentFile.name)}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background/50 hover:border-primary/50'
                }
      `}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
            />

            {isUploading ? (
                <>
                    <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
            ) : (
                <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        PDF only, max 5MB
                    </p>
                </>
            )}
        </div>
    );
}
