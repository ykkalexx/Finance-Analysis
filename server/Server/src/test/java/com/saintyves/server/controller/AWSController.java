package com.saintyves.server.controller;

import com.amazonaws.services.lambda.AWSLambda;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.model.InvokeRequest;
import com.amazonaws.services.lambda.model.InvokeResult;
import com.saintyves.server.repo.MonthlySumRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
public class AWSController {

    @Autowired
    MonthlySumRepo monthlySumRepo;
    private final AWSLambda awsLambda = AWSLambdaClientBuilder.defaultClient();

    @PostMapping("/monthly-sum")
    public String triggerMonthlySumLambda() {
        InvokeRequest request = new InvokeRequest().withFunctionName("monthly-sum").withPayload("{}");
        InvokeResult result = awsLambda.invoke(request);
        String response = new String(result.getPayload().array(), StandardCharsets.UTF_8);

        // modify this to save the response to database
        return response;
    }

    @PostMapping("/analyze")
    public String triggerAnalyzeLambda() {
        return null;
    }

    @PostMapping("/process")
    public String triggerProcessLambda() {
        return null;
    }

    @PostMapping("/validate")
    public String triggerValidateLambda() {
        return null;
    }

}
