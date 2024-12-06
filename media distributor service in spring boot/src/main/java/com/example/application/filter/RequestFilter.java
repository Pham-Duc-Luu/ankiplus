package com.example.application.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RequestFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(RequestFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws java.io.IOException, jakarta.servlet.ServletException {
        // Log request details

        logger.info("Request: Method={}, URI={}, Headers={}",
                request.getMethod(),
                request.getRequestURI(),
                getHeaders(request));

        // Proceed with the filter chain
        filterChain.doFilter(request, response);

        // log ok for good response
        if (response.getStatus() >= 200 && response.getStatus() <= 399) {
            logger.info("Response: Status={}", response.getStatus());

        }
        // log ok for good response
        if (response.getStatus() >= 400 && response.getStatus() <= 599) {
            logger.error("Response: Status={}", response.getStatus());

        }

    }

    private String getHeaders(HttpServletRequest request) {
        StringBuilder headers = new StringBuilder();
        request.getHeaderNames().asIterator().forEachRemaining(headerName ->
                headers.append(headerName).append("=").append(request.getHeader(headerName)).append(", "));
        return headers.toString();
    }
}
