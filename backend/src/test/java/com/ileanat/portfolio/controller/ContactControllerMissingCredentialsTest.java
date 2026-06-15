package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.service.ContactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContactController.class)
@Import({
        ContactService.class,
        GlobalExceptionHandler.class,
        ContactControllerTest.MailTestConfig.class
})
@TestPropertySource(properties = {
        "spring.mail.host=smtp.gmail.com",
        "spring.mail.port=465",
        "spring.mail.username=",
        "spring.mail.password=",
        "contact.recipient=ileanatemer@gmail.com"
})
class ContactControllerMissingCredentialsTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contactReturnsServiceUnavailableWhenMailIsNotConfigured() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Jane Doe",
                                  "email": "jane@example.com",
                                  "message": "Hello from the portfolio contact form."
                                }
                                """))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.error")
                        .value("Email delivery is not configured. Set SPRING_MAIL_USERNAME and SPRING_MAIL_PASSWORD."));
    }
}
