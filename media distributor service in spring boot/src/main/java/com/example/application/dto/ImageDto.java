package com.example.application.dto;

import com.example.application.model.image.ImageModal;

public class ImageDto extends ImageModal {

    private String publicUrl; // Additional field for the DTO

    public ImageDto(ImageModal imageModal, String publicUrl) {
        super(); // Call the superclass constructor
        this.setId(imageModal.getId());
        this.setFileName(imageModal.getFileName());
        this.setFileSize(imageModal.getFileSize());
        this.setFormat(imageModal.getFormat());
        this.setWidth(imageModal.getWidth());
        this.setHeight(imageModal.getHeight());
        this.setCreatedAt(imageModal.getCreatedAt());
        this.publicUrl = publicUrl;
    }

    // Getters and Setters for publicUrl
    public String getPublicUrl() {
        return publicUrl;
    }

    public void setPublicUrl(String publicUrl) {
        this.publicUrl = publicUrl;
    }
}