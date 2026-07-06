package com.foxstyle.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@SpringBootApplication
public class ApiApplication {

    public static void main(String[] args) {
        createDatabaseIfNotExist();
        SpringApplication.run(ApiApplication.class, args);
    }

    private static void createDatabaseIfNotExist() {
        java.util.Properties properties = new java.util.Properties();
        try (java.io.InputStream input = ApiApplication.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (input == null) {
                return;
            }
            properties.load(input);
        } catch (Exception e) {
            return;
        }

        String url = properties.getProperty("spring.datasource.url");
        String username = properties.getProperty("spring.datasource.username");
        String password = properties.getProperty("spring.datasource.password");

        if (url == null || !url.contains("jdbc:sqlserver:")) {
            return;
        }

        String dbName = "foxstyle_db";
        if (url.contains("databaseName=")) {
            int start = url.indexOf("databaseName=") + "databaseName=".length();
            int end = url.indexOf(";", start);
            if (end == -1) {
                dbName = url.substring(start);
            } else {
                dbName = url.substring(start, end);
            }
        }

        String masterUrl = url.replaceAll("databaseName=[^;]+", "databaseName=master");
        if (!masterUrl.contains("databaseName=master")) {
            masterUrl += ";databaseName=master";
        }

        boolean isIntegrated = url.contains("integratedSecurity=true");

        try (Connection connection = isIntegrated 
                ? DriverManager.getConnection(masterUrl)
                : DriverManager.getConnection(masterUrl, username != null ? username : "sa", password != null ? password : "123");
             Statement statement = connection.createStatement()) {
            
            String checkSql = "SELECT database_id FROM sys.databases WHERE name = '" + dbName + "'";
            try (var resultSet = statement.executeQuery(checkSql)) {
                if (!resultSet.next()) {
                    System.out.println("Database " + dbName + " does not exist. Creating database...");
                    String createSql = "CREATE DATABASE " + dbName;
                    statement.executeUpdate(createSql);
                    System.out.println("Database " + dbName + " created successfully!");
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not check/create database programmatically. Reason: " + e.getMessage());
        }
    }
}
