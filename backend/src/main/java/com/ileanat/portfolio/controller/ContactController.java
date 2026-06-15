package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.model.ContactRequest;
import com.ileanat.portfolio.model.ContactResponse;
import com.ileanat.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.OK)
    public ContactResponse submitContact(@Valid @RequestBody ContactRequest request) {
        log.info("POST /api/contact received");
        contactService.sendMessage(request);
        return new ContactResponse("Message sent successfully.");
    }
}
