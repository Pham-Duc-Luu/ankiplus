package com.example.application.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {
    // Load .env file, defaulting to `.env` if not explicitly specified
    private static final Dotenv dotenv = Dotenv.configure()
            .filename(".env") // Change filename if necessary
            .load();

    /**
     * Retrieve environment variable by key.
     *
     * @param key the name of the environment variable
     * @return the value of the environment variable, or null if not found
     */
    public static String getEnv(String key) {
        return dotenv.get(key);
    }
}
