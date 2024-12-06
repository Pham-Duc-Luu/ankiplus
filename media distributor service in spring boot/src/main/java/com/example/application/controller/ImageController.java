package com.example.application.controller;

import com.example.application.config.DotenvConfig;
import com.example.application.service.CloudinaryService;
import com.example.application.service.SaveFile;
import com.example.application.util.ImageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/images")
public class ImageController {


    // IMPORTANT note : this is the static file path for upload images to the src
    // IMPORTANT note : this is for testing only
    private static final String PUBLIC_FOLDER = DotenvConfig.getEnv("PUBLIC_FOLDER_URL");
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);
    private static final ImageUtil imageUtil = new ImageUtil();
    private final ResourceLoader resourceLoader;
    private final SaveFile saveFile = new SaveFile();


    @Autowired
    private CloudinaryService cloudinaryService;

    public ImageController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
        }


        try {

            Map<String, Object> uploadResult = cloudinaryService.uploadImage(file);
            return ResponseEntity.status(HttpStatus.OK).body(uploadResult.toString()
            );

        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/bn")
    public ResponseEntity<byte[]> getImage(@RequestParam String fileName) {

        // Load the image as a resource
        Resource imageResource = resourceLoader.getResource("classpath:public/" + fileName);

        if (!imageResource.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        try {

            // Convert the image resource to a byte array
            byte[] imageBytes = imageResource.getInputStream().readAllBytes();

            // Set the content type based on the file extension (e.g., PNG or JPEG)
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg"); // Or "image/png" based on the file

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/base64")
    public ResponseEntity<String> getImageBase64(@RequestParam String fileName) {
        // Load the image as a resource
        Resource imageResource = resourceLoader.getResource("classpath:public/" + fileName);

        if (!imageResource.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        try {


            // Read the image as bytes and encode it as Base64
            byte[] imageBytes = imageResource.getInputStream().readAllBytes();
            return new ResponseEntity<>(Base64.getEncoder().encodeToString(imageBytes), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
