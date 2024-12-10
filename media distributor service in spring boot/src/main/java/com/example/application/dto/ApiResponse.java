package com.example.application.dto;

public class ApiResponse<T> {
    private String message;
    private int statusCode;
    private T metadata;

    public ApiResponse(String message, int statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public ApiResponse(String message, int statusCode, T metadata) {
        this.message = message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public T getmetadata() {
        return metadata;
    }

    public void setmetadata(T metadata) {
        this.metadata = metadata;
    }
}