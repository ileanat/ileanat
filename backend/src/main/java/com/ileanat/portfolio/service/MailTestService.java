package com.ileanat.portfolio.service;

import com.ileanat.portfolio.exception.ContactDeliveryException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

@Service
public class MailTestService {

    private final JavaMailSender mailSender;
    private final String mailUsername;
    private final String mailPassword;

    public MailTestService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username:}") String mailUsername,
            @Value("${spring.mail.password:}") String mailPassword) {
        this.mailSender = mailSender;
        this.mailUsername = mailUsername;
        this.mailPassword = mailPassword;
    }

    public void testSmtpConnection() throws MessagingException {
        if (mailUsername.isBlank() || mailPassword.isBlank()) {
            throw new ContactDeliveryException(
                    "Email delivery is not configured. Set SPRING_MAIL_USERNAME and SPRING_MAIL_PASSWORD.");
        }

        if (!(mailSender instanceof JavaMailSenderImpl mailSenderImpl)) {
            throw new ContactDeliveryException("Mail sender is not configured for SMTP testing.");
        }

        mailSenderImpl.testConnection();
    }
}
