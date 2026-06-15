package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.service.MailTestService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MailTestController.class)
@Import({MailTestService.class, MailTestControllerFailureTest.FailureConfig.class})
@TestPropertySource(properties = {
        "spring.mail.host=smtp.gmail.com",
        "spring.mail.port=587",
        "spring.mail.username=test@example.com",
        "spring.mail.password=test-password"
})
class MailTestControllerFailureTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void mailTestReturnsErrorMessageWhenConnectionFails() throws Exception {
        mockMvc.perform(get("/api/mail-test"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.error").value("Connection timed out"));
    }

    @TestConfiguration
    static class FailureConfig {

        @Bean
        @Primary
        JavaMailSender javaMailSender() {
            return new JavaMailSenderImpl() {
                @Override
                public void testConnection() throws MessagingException {
                    throw new MessagingException("Connection timed out");
                }
            };
        }
    }
}
