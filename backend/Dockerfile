# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

RUN useradd --system --create-home spring
USER spring

COPY --from=build /app/target/portfolio-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Render injects PORT at runtime; default to 8080 for local Docker runs.
ENTRYPOINT ["sh", "-c", "exec java -jar app.jar --server.port=${PORT:-8080}"]
