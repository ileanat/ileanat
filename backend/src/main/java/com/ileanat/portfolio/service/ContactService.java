package com.ileanat.portfolio.service;

import com.ileanat.portfolio.exception.ContactDeliveryException;
import com.ileanat.portfolio.model.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final JavaMailSender mailSender;
    private final String recipient;
    private final String mailUsername;
    private final String mailPassword;

    public ContactService(
            JavaMailSender mailSender,
            @Value("${contact.recipient}") String recipient,
            @Value("${spring.mail.username:}") String mailUsername,
            @Value("${spring.mail.password:}") String mailPassword) {
        this.mailSender = mailSender;
        this.recipient = recipient;
        this.mailUsername = mailUsername;
        this.mailPassword = mailPassword;
    }

    public void sendMessage(ContactRequest request) {
        log.info("mail username present: {}", !mailUsername.isBlank());
        log.info("mail password present: {}", !mailPassword.isBlank());

        if (mailUsername.isBlank() || mailPassword.isBlank()) {
            throw new ContactDeliveryException(
                    "Email delivery is not configured. Set SPRING_MAIL_USERNAME and SPRING_MAIL_PASSWORD.");
        }

        if (recipient.isBlank()) {
            throw new ContactDeliveryException(
                    "Email delivery is not configured. Set CONTACT_RECIPIENT.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailUsername);
            message.setTo(recipient);
            message.setReplyTo(request.email());
            message.setSubject("Portfolio contact from " + request.name());
            message.setText(buildEmailBody(request));

            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Email send failed: {}", ex.getMessage());
            throw new ContactDeliveryException(
                    "Failed to send message. Check your Gmail SMTP credentials and try again.",
                    ex);
        }
    }

    private String buildEmailBody(ContactRequest request) {
        return """
                New portfolio contact form submission

                Name: %s
                Email: %s

                Message:
                %s
                """.formatted(request.name(), request.email(), request.message());
    }
}
