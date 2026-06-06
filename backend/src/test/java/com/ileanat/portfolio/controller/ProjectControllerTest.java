package com.ileanat.portfolio.controller;

import com.ileanat.portfolio.service.ProjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProjectController.class)
@Import(ProjectService.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void projectsReturnsPortfolioData() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].title").value("Intervue"))
                .andExpect(jsonPath("$[1].title").value("ReviewRadar"))
                .andExpect(jsonPath("$[2].title").value("MarketHub"));
    }
}
