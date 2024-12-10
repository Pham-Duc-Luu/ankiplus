package com.example.application.controller;

import com.example.application.config.DotenvConfig;
import com.example.application.dto.ApiResponse;
import com.example.application.dto.ImageDto;
import com.example.application.model.image.ImageModal;
import com.example.application.repository.image.ImageRepository;
import com.example.application.service.CloudinaryService;
import com.example.application.service.ImageService;
import com.example.application.service.S3Service;
import com.example.application.service.SaveFile;
import com.example.application.util.ImageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.*;

@RestController
@RequestMapping("/images")
public class ImageController {


    // IMPORTANT note : this is the static file path for upload images to the src
    // IMPORTANT note : this is for testing only
    private static final String PUBLIC_FOLDER = DotenvConfig.getEnv("PUBLIC_FOLDER_URL");
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);
    private static final ImageUtil imageUtil = new ImageUtil();
    // list of allow MIME type
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
    private static final Double maxFileSize = 0.5;
    private final ResourceLoader resourceLoader;
    private final SaveFile saveFile = new SaveFile();
    private final ImageService imageService;

    // * define a living time for the url that fetching image data from the s3 bucket
    // TODO : this parameter should be confined to match the system requirements
    // ? for now this will be 10 minutes
    private final Duration timeLivingOfFilUrl = Duration.ofMinutes(10);
    @Autowired
    private CloudinaryService cloudinaryService;

    public ImageController(ResourceLoader resourceLoader, ImageService imageService) {
        this.resourceLoader = resourceLoader;
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<?>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new ApiResponse<>("File empty", HttpStatus.BAD_REQUEST.value())
            );
        }

        // ! Check the MIME type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body(new ApiResponse<String>("File is not supported", HttpStatus.UNSUPPORTED_MEDIA_TYPE.value()));
        }
        try {

            // ! compress image file below than max file size
            byte[] fileAfterCompressed = imageService.compressImage(file, maxFileSize);
            System.out.println(fileAfterCompressed.length);
            // * generate a unique file name using uuid
            String fileName = UUID.randomUUID().toString();


            S3Service s3Service = new S3Service();

            // * upload image to the s3 and then get the public url to that resources
            String imageUrl = s3Service.uploadFile(fileName,
                    fileAfterCompressed
            ).getPresignedGetUrl(timeLivingOfFilUrl);

            // * save the image information after upload to s3
            ImageModal imageModal = new ImageModal();
            imageModal.setFileName(fileName).setFileSize((long) fileAfterCompressed.length).setFormat("image/jpeg");
            imageService.saveImage(imageModal);

            return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse<ImageDto>("Image update successfully", HttpStatus.OK.value(), new ImageDto(imageModal, imageUrl)));

        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to upload image", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

//    @GetMapping("/bn")
//    public ResponseEntity<byte[]> getImage(@RequestParam String fileName) {
//
//        // Load the image as a resource
//        Resource imageResource = resourceLoader.getResource("classpath:public/" + fileName);
//
//        if (!imageResource.exists()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//        try {
//            // Convert the image resource to a byte array
//            byte[] imageBytes = imageResource.getInputStream().readAllBytes();
//
//            // Set the content type based on the file extension (e.g., PNG or JPEG)
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg"); // Or "image/png" based on the file
//
//            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
//        } catch (Exception e) {
//            logger.error(e.getMessage());
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

//    @GetMapping("/base64")
//    public ResponseEntity<String> getImageBase64(@RequestParam String fileName) {
//        // Load the image as a resource
//        Resource imageResource = resourceLoader.getResource("classpath:public/" + fileName);
//
//        if (!imageResource.exists()) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//
//        try {
//            // Read the image as bytes and encode it as Base64
//            byte[] imageBytes = imageResource.getInputStream().readAllBytes();
//            return new ResponseEntity<>(Base64.getEncoder().encodeToString(imageBytes), HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//
//    }
}
