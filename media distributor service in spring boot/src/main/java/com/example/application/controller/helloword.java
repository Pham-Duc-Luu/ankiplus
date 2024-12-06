package com.example.application.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello-world")
public class helloword {
    @GetMapping("")
    public String helloword() {
        return "Hello world, welcome to media-file service, developed by Pham Duc Luu";
    }
}
