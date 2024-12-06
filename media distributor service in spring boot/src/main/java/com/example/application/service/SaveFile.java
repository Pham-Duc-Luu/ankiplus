package com.example.application.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class SaveFile {
    private static final Logger logger = LoggerFactory.getLogger(SaveFile.class);

    public void saveFileToFolder(String path, MultipartFile file) throws Exception {

        try {

            // Create the directory if it doesn't exist
            Path folderPath = Paths.get(path.trim());
            if (!Files.exists(folderPath)) {
                Files.createDirectories(folderPath);
            }

            // Save the file to the public folder
            Path filePath = folderPath.resolve(file.getOriginalFilename());
            file.transferTo(filePath.toFile());

        } catch (IOException e) {
            logger.error(e.getMessage());
            throw e;
        }
    }

}
