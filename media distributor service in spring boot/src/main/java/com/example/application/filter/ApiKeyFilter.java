package com.example.application.filter;

import com.example.application.config.DotenvConfig;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ApiKeyFilter implements Filter {

    private final String validApiKey = DotenvConfig.getEnv("API_KEY");

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String apiKey = httpRequest.getHeader("X-API-KEY");


        // Validate the API key
        if (apiKey == null || !apiKey.equals(validApiKey)) {
            // IMPORTANT : pass if this is development server
            if (DotenvConfig.getEnv("ENV").equals("development") ||
                    DotenvConfig.getEnv("ENV").equals("dev")
            ) {

            } else {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.getWriter().write("Unauthorized: Missing or invalid API key");
                return;
            }

        }

        // Proceed to the next filter or the request handler
        chain.doFilter(request, response);
    }
}
