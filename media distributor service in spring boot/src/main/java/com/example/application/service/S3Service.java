package com.example.application.service;

import com.example.application.config.DotenvConfig;
import com.example.application.controller.ImageController;
import jdk.jfr.ContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.utils.IoUtils;
import org.springframework.scheduling.annotation.Async;
import software.amazon.awssdk.http.HttpExecuteRequest;
import software.amazon.awssdk.http.HttpExecuteResponse;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.http.SdkHttpRequest;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.utils.IoUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.UUID;

import com.example.application.config.DotenvConfig;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.utils.IoUtils;
import org.springframework.scheduling.annotation.Async;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.Date;

@Service
public class S3Service {
    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);
    private final S3Client s3Client;
    private final String bucketname = DotenvConfig.getS3BucketName();
    private final Region region = Region.of(DotenvConfig.getS3BucketRegion());
    private final String key = DotenvConfig.getS3BucketKey();
    private final String secret = DotenvConfig.getS3BucketSecret();


    private String keyName;

    // ! build a constant by default
    public S3Service() {
        this.s3Client = S3Client.builder().region(region).credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(key, secret)))
                .build();
    }

    public S3Service(String accessKey, String secretKey, String region) {
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    // Helper method to perform the actual S3 upload
    private void uploadToS3(String bucketName, String keyName, byte[] fileData) throws Exception {
        try (InputStream inputStream = new ByteArrayInputStream(fileData)) {
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(keyName)
                            .contentType("image/jpeg")  // Specify the content type as JPEG
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromInputStream(inputStream, fileData.length));

            System.out.println("File uploaded to S3 successfully.");
        } catch (S3Exception e) {
            logger.error(e.awsErrorDetails().toString());
            throw e;
        } catch (Exception e) {
            logger.error(
                    e.toString()
            );
            throw e;
        }
    }

    // Asynchronously uploads a file to S3 with the specified key
    @Async
    public S3Service uploadFile(String keyName, byte[] fileData) throws Exception {
        this.keyName = keyName;
        uploadToS3(DotenvConfig.getS3BucketName(), keyName, fileData);
        return this;
    }

    // Overloaded method to allow uploading to a specified bucket
    @Async
    public S3Service uploadFile(String bucketName, String keyName, byte[] fileData) throws Exception {
        this.keyName = keyName;
        uploadToS3(bucketName, keyName, fileData);
        return this;

    }

    @Async
    public String getPresignedGetUrl(Duration duration) {
        return createPresignedGetUrl(bucketname, keyName, duration);
    }

    /* Create a pre-signed URL to download an object in a subsequent GET request. */
    public String createPresignedGetUrl(String bucketName, String keyName, Duration duration) {
        try (S3Presigner presigner = S3Presigner.builder()
                .region(region)
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(key, secret)))
                .build()
        ) {


            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(keyName)
                    .build();

            GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(duration)  // The URL will expire in 10 minutes.
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedGetObjectRequest = presigner.presignGetObject(getObjectPresignRequest);

            return presignedGetObjectRequest.url().toString();
        }
    }

}
