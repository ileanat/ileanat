package com.ileanat.portfolio.service;

import com.ileanat.portfolio.exception.ContactDeliveryException;
import com.ileanat.portfolio.model.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

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
        if (mailUsername.isBlank() || mailPassword.isBlank()) {
            throw new ContactDeliveryException(
                    "Email delivery is not configured. Set SPRING_MAIL_USERNAME and SPRING_MAIL_PASSWORD.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailUsername);
            message.setTo(recipient);
            message.setReplyTo(request.email());
            message.setSubject("Portfolio contact from " + request.name());
            message.setText(
                    "Name: " + request.name() + "\n"
                            + "Email: " + request.email() + "\n\n"
                            + request.message());

            mailSender.send(message);
        } catch (Exception ex) {
            throw new ContactDeliveryException("Failed to send message. Please try again later.", ex);
        }
    }
}
