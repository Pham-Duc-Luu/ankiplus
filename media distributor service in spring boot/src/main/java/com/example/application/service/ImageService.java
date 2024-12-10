package com.example.application.service;

import com.example.application.model.image.ImageModal;
import com.example.application.repository.image.ImageRepository;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ImageService {

    @Autowired
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public ImageModal saveImage(ImageModal imageModal) {
        return imageRepository.save(imageModal);
    }


    public byte[] compressImage(MultipartFile file, double maxFileSizeMB) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        double quality = 1.0; // Start with maximum quality
        // Loop to compress until file size is below maxFileSizeMB
        while (true) {
            outputStream.reset();
            Thumbnails.of(file.getInputStream())
                    .scale(0.1) // Maintain original dimensions
                    .outputQuality(quality) // Adjust quality
                    .toOutputStream(outputStream);
            if (outputStream.toByteArray().length <= maxFileSizeMB * (1000 * 1024)) break;

            if (quality < 0.1) break;

            quality -= 0.005;

        }

        return outputStream.toByteArray();
    }
}
