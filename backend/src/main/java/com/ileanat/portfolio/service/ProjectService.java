package com.ileanat.portfolio.service;

import com.ileanat.portfolio.model.Project;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private static final List<Project> PROJECTS = List.of(
            new Project(
                    "Intervue",
                    "AI-powered mock interview platform that simulates realistic technical and behavioral interviews with adaptive questioning and personalized performance feedback.",
                    List.of("TypeScript", "React", "FastAPI", "MongoDB"),
                    "https://github.com/justinyc1/intervue",
                    "https://www.intervue.org/"
            ),
            new Project(
                    "ReviewRadar",
                    "Full-stack review platform featuring a dynamic rating system, polished responsive UI, and collaborative development.",
                    List.of("TypeScript", "React", "Node.js", "Express.js", "MongoDB"),
                    "https://github.com/ileanat/ReviewRadar",
                    "https://reviewradar-1.onrender.com/"
            ),
            new Project(
                    "MarketHub",
                    "E-commerce demo with hoverable category filtering, product generation API, and interactive search functionality.",
                    List.of("HTML", "CSS", "JavaScript", "Node.js", "Express"),
                    null,
                    null
            )
    );

    public List<Project> getAllProjects() {
        return PROJECTS;
    }
}
