package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.service.ContactService;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.io.InputStream;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactController.class)
@Import({ContactService.class, GlobalExceptionHandler.class, ContactControllerTest.MailTestConfig.class})
@TestPropertySource(properties = {
        "spring.mail.username=test@example.com",
        "spring.mail.password=test-password",
        "contact.recipient=ileanatemer@gmail.com"
})
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contactAcceptsValidRequest() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Jane Doe",
                                  "email": "jane@example.com",
                                  "message": "Hello from the portfolio contact form."
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Message sent successfully."));
    }

    @Test
    void contactRejectsInvalidEmail() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Jane Doe",
                                  "email": "not-an-email",
                                  "message": "Hello"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Email must be valid"));
    }

    @TestConfiguration
    static class MailTestConfig {

        @Bean
        @Primary
        JavaMailSender javaMailSender() {
            return new JavaMailSender() {
                @Override
                public void send(SimpleMailMessage simpleMessage) {}

                @Override
                public void send(SimpleMailMessage... simpleMessages) {}

                @Override
                public void send(MimeMessage mimeMessage) {}

                @Override
                public void send(MimeMessage... mimeMessages) {}

                @Override
                public MimeMessage createMimeMessage() {
                    return null;
                }

                @Override
                public MimeMessage createMimeMessage(InputStream contentStream) {
                    return null;
                }
            };
        }
    }
}
