'use client';

import React from 'react';
import ToggleButton from './ToggleButton';

interface ImageUploadProps {
  useURL: boolean;
  setUseURL: React.Dispatch<React.SetStateAction<boolean>>;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
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
  existingEvent?: any;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  useURL,
  setUseURL,
  setImageFile,
  setFormData,
  imageFile,
  formData,
  errors,
  touched,
  handleChange,
  onBlurHandler,
  existingEvent,
}) => {
  const handleToggle = () => {
    setUseURL((prev) => !prev);
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image: useURL ? '' : existingEvent?.image || '',
    }));
  };

  return (
    <div className="image-upload">
      <label htmlFor="image" className="image-upload-label">
        <span className="image-upload-circle-container">
          <span>Upload Image</span>
          <span
            className={`image-upload-circle ${
              imageFile ? 'bg-green-500' : 'bg-gray-400'
            }`}
          ></span>
        </span>
      </label>
      <div>
        <ToggleButton
          label="Image Upload:"
          value={useURL}
          onToggle={handleToggle}
          optionOne="Upload"
          optionTwo="URL"
        />
      </div>
      {!useURL ? (
        <div className="image-upload-button-container">
          <label htmlFor="image" className="image-upload-button flex">
            <span className="upload-button-text">Upload Image</span>
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
            defaultValue={existingEvent?.image || formData.image}
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
          {errors.image && <p className="text-red-500">{errors.image}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
