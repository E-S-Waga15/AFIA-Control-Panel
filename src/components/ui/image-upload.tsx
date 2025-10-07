import React, { useRef, useState } from 'react';
import { Button } from './button';
import { Upload, X, Image } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage?: string;
  className?: string;
  buttonText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  className = "",
  buttonText
}) => {
  const { t, isRTL } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(t('common.invalidFileType') || 'Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(t('common.fileTooLarge') || 'File size must be less than 5MB');
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative">
          <div className="image-upload-preview-container">
            <img
              src={previewUrl}
              alt="Preview"
              className="image-upload-preview-image"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveImage}
            className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'}`}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="image-upload-no-image cursor-pointer hover:bg-gray-50 transition-colors" onClick={openFileDialog}>
          <Image className="image-upload-no-image-icon" />
          <p className="image-upload-no-image-text">{t('common.noImageSelected') || 'No image selected'}</p>
          <p className="text-xs text-gray-400 mt-1">{buttonText || t('users.uploadImage') || 'Click to upload'}</p>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={openFileDialog}
        className="w-full flex items-center gap-2"
      >
        <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        {buttonText || t('users.uploadImage') || 'Upload Image'}
      </Button>
    </div>
  );
};
