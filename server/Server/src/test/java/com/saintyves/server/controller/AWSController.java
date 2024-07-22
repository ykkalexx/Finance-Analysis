package com.saintyves.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AWSController {

    @GetMapping("/monthly-sum")
    public String triggerMonthlySumLambda() {}

    @GetMapping("/analyze")
    public String triggerAnalyzeLambda() {}

    @GetMapping("/process")
    public String triggerProcessLambda() {}

    @GetMapping("/validate")
    public String triggerValidateLambda() {}
    
}
