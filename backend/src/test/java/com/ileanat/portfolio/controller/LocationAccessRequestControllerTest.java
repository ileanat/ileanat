package com.ileanat.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ileanat.portfolio.service.EmailSender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.nullable;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LocationAccessRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailSender emailSender;

    private final AtomicInteger sentEmailCount = new AtomicInteger();
    private final AtomicReference<String> lastEmailText = new AtomicReference<>();

    @BeforeEach
    void configureResendMock() {
        sentEmailCount.set(0);
        lastEmailText.set(null);

        when(emailSender.isConfigured()).thenReturn(true);
        doAnswer(invocation -> {
            sentEmailCount.incrementAndGet();
            lastEmailText.set(invocation.getArgument(2));
            return null;
        }).when(emailSender).sendEmail(anyString(), anyString(), anyString(), nullable(String.class));
        doAnswer(invocation -> {
            sentEmailCount.incrementAndGet();
            lastEmailText.set(invocation.getArgument(2));
            return null;
        }).when(emailSender).sendEmail(anyString(), anyString(), anyString());
    }

    @Test
    void submitCreatesPendingRequestWithoutCoordinates() throws Exception {
        mockMvc.perform(post("/api/location-access/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Jane Doe",
                                  "email": "jane@example.com",
                                  "message": "I'd like to request access."
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.message").value("Your location access request was submitted and is pending review."));

        assertEquals(1, sentEmailCount.get());
    }

    @Test
    void submitRejectsInvalidEmail() throws Exception {
        mockMvc.perform(post("/api/location-access/requests")
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

    @Test
    void adminEndpointsRequireApiKey() throws Exception {
        mockMvc.perform(get("/api/location-access/admin/requests"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized."));
    }

    @Test
    void approvedRequestCanBeValidatedWithToken() throws Exception {
        String requestId = createRequest("Jane Doe", "jane@example.com", "Please approve me.");

        mockMvc.perform(post("/api/location-access/admin/requests/" + requestId + "/approve")
                        .header("X-Admin-Api-Key", "test-admin-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "durationMinutes": 60
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));

        String token = extractTokenFromLastEmail();
        mockMvc.perform(get("/api/location-access/validate").param("token", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approved").value(true))
                .andExpect(jsonPath("$.status").value("APPROVED"))
                .andExpect(jsonPath("$.expiresAt").isNotEmpty());
    }

    @Test
    void deniedRequestValidationFails() throws Exception {
        String requestId = createRequest("John Smith", "john@example.com", null);

        mockMvc.perform(post("/api/location-access/admin/requests/" + requestId + "/deny")
                        .header("X-Admin-Api-Key", "test-admin-key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DENIED"));

        mockMvc.perform(get("/api/location-access/validate").param("token", "invalid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approved").value(false));
    }

    @Test
    void approveUntilRevokedHasNoExpiration() throws Exception {
        String requestId = createRequest("Jane Doe", "jane@example.com", null);

        mockMvc.perform(post("/api/location-access/admin/requests/" + requestId + "/approve")
                        .header("X-Admin-Api-Key", "test-admin-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "durationMinutes": 0
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"))
                .andExpect(jsonPath("$.expiresAt").doesNotExist());

        String token = extractTokenFromLastEmail();
        mockMvc.perform(get("/api/location-access/validate").param("token", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approved").value(true))
                .andExpect(jsonPath("$.expiresAt").doesNotExist());
    }

    @Test
    void approveRejectsUnsupportedDuration() throws Exception {
        String requestId = createRequest("Jane Doe", "jane@example.com", null);

        mockMvc.perform(post("/api/location-access/admin/requests/" + requestId + "/approve")
                        .header("X-Admin-Api-Key", "test-admin-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "durationMinutes": 30
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Approval duration must be 15 minutes, 1 hour, 24 hours, or until revoked."));
    }

    @Test
    void adminCanRevokeApprovedRequest() throws Exception {
        String requestId = createRequest("Jane Doe", "jane@example.com", null);

        mockMvc.perform(post("/api/location-access/admin/requests/" + requestId + "/approve")
                        .header("X-Admin-Api-Key", "test-admin-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "durationMinutes": 15
                                }
                                """))
                .andExpect(status().isOk());

        String token = extractTokenFromLastEmail();

        mockMvc.perform(post("/api/location-access/admin/requests/" + requestId + "/revoke")
                        .header("X-Admin-Api-Key", "test-admin-key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REVOKED"));

        mockMvc.perform(get("/api/location-access/validate").param("token", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.approved").value(false))
                .andExpect(jsonPath("$.status").value("REVOKED"));
    }

    @Test
    void pendingRequestsAreListedForAdmin() throws Exception {
        createRequest("Jane Doe", "jane@example.com", "Pending");

        mockMvc.perform(get("/api/location-access/admin/requests/pending")
                        .header("X-Admin-Api-Key", "test-admin-key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    private String createRequest(String name, String email, String message) throws Exception {
        String body = message == null
                ? """
                {
                  "name": "%s",
                  "email": "%s"
                }
                """.formatted(name, email)
                : """
                {
                  "name": "%s",
                  "email": "%s",
                  "message": "%s"
                }
                """.formatted(name, email, message);

        MvcResult result = mockMvc.perform(post("/api/location-access/requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();
    }

    private String extractTokenFromLastEmail() {
        String text = lastEmailText.get();
        for (String line : text.split("\n")) {
            if (line.contains("token=")) {
                return line.substring(line.indexOf("token=") + "token=".length()).trim();
            }
        }
        throw new IllegalStateException("Approval email did not contain an access token link.");
    }
}
