'use client';

import React from 'react';
import ToggleButton from './ToggleButton';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  useURL: boolean;
  setUseURL: React.Dispatch<React.SetStateAction<boolean>>;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  imageFile: File | null;
  formData: any;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlurHandler: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  existing?: any;
  buttonCentered?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  useURL,
  setUseURL,
  setImageFile,
  setFormData,
  setErrors,
  imageFile,
  formData,
  errors,
  touched,
  handleChange,
  onBlurHandler,
  existing,
  buttonCentered,
}) => {
  const handleToggle = () => {
    setUseURL((prev) => !prev);
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image: useURL ? '' : existing?.image || '',
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      image: '',
    }));
  };

  return (
    <div className="image-upload">
      <div className="image-upload-toggle-button-container">
        <ToggleButton
          label="Upload Method:"
          value={useURL}
          onToggle={handleToggle}
          optionOne="Upload"
          optionTwo="URL"
        />
      </div>
      {!useURL ? (
        <div
          className={`image-upload-button-container ${
            buttonCentered ? 'items-center' : ''
          }`}
        >
          <label htmlFor="image" className="image-upload-button">
            <Upload className="image-upload-button-icon" />
            <span className="image-upload-button-text">Upload Image</span>
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
            }}
          />
          {imageFile && (
            <div className="image-upload-preview-container">
              <p className="image-upload-preview-text">
                <span className="image-upload-preview-label">
                  Selected Image:
                </span>
                <span className="image-upload-preview-filename">
                  {imageFile.name}
                </span>
              </p>
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Selected Preview"
                className="image-upload-preview-image"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="image-upload-input-container">
          <input
            type="url"
            name="image"
            placeholder="Image URL"
            defaultValue={existing?.image || formData.image}
            onChange={handleChange}
            onBlur={onBlurHandler}
            className={`image-upload-input ${
              touched.image
                ? formData.image
                  ? errors.image
                    ? 'form-input-error'
                    : 'from-input-success'
                  : 'form-input-error'
                : ''
            }`}
          />
          {errors.image && <p className="image-upload-error">{errors.image}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
