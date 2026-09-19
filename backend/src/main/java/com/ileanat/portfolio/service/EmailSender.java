package com.ileanat.portfolio.service;

public interface EmailSender {

    boolean isConfigured();

    void sendEmail(String to, String subject, String text);

    void sendEmail(String to, String subject, String text, String replyTo);
}
