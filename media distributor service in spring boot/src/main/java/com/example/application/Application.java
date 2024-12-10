package com.example.application;

import com.example.application.config.DotenvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class Application {


    public static void main(String[] args) {


        // Set the port dynamically
        String appPort = DotenvConfig.getEnv("APP_PORT");

        if (appPort != null) {
            System.setProperty("server.port", appPort);
        }
        SpringApplication.run(Application.class, args);
    }
}
