package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.exception.ContactDeliveryException;
import com.ileanat.portfolio.model.ErrorResponse;
import com.ileanat.portfolio.model.MailTestResponse;
import com.ileanat.portfolio.service.MailTestService;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MailTestController {

    private final MailTestService mailTestService;

    public MailTestController(MailTestService mailTestService) {
        this.mailTestService = mailTestService;
    }

    @GetMapping("/mail-test")
    public ResponseEntity<?> testMailConnection() {
        try {
            mailTestService.testSmtpConnection();
            return ResponseEntity.ok(
                    new MailTestResponse("connected", "SMTP connection successful"));
        } catch (ContactDeliveryException | MessagingException ex) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ErrorResponse(ex.getMessage()));
        }
    }
}
