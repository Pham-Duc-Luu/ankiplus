package com.example.application.util;

import org.imgscalr.Scalr;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

public class ImageUtil {
    public BufferedImage convertToBufferedImage(MultipartFile file) throws IOException {
        return ImageIO.read(file.getInputStream());
    }

    public BufferedImage resizeBufferedImage(BufferedImage originalImage, int targetWidth) throws Exception {
        return Scalr.resize(originalImage, targetWidth);
    }
}
