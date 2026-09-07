package edu.uscb.csci470sp26.servexa_backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class TenantControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(TenantControllerTest.class);

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private Long testTenantId;

    @BeforeEach
    public void setup() throws Exception {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();

        // Insert a test user into the database and retrieve its ID
        String newTenantJson = "{\"email\":\"johndoe@example.com\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"phone\":\"1234567890\",\"unitNumber\":\"101\"}";
        String response = mockMvc.perform(post("/tenant")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newTenantJson))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // This parses the tenant id to ensure that it exists (assuming the response contains the tenant id)
        Integer id = JsonPath.read(response, "$.tenantId");
        testTenantId = id.longValue();

        logger.info("Setup complete. Test user ID: {}", testTenantId);
    }

    @Test
    public void testGetTenantById() throws Exception {
        // Arrange
        logger.info("Testing getUserById with ID: {}", testTenantId);

        // Act & Assert
        mockMvc.perform(get("/tenant/{id}", testTenantId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenantId").value(testTenantId));

        logger.info("testGetTenantById passed.");
    }

    @Test
    public void testCreateTenant() throws Exception {
        // Arrange
        String newTenantJson = "{\"email\":\"johndoe@example.com\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"phone\":\"1234567890\",\"unitNumber\":\"101\"}";
        logger.info("Testing createUser with payload: {}", newTenantJson);

        // Act & Assert
        mockMvc.perform(post("/tenant")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newTenantJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("johndoe@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
        		.andExpect(jsonPath("$.phone").value("1234567890"))
        		.andExpect(jsonPath("$.unitNumber").value("101"));

        logger.info("testCreateTenant passed.");
    }

    @Test
    public void testGetAllTenants() throws Exception {
        // Arrange
        logger.info("Testing getAllTenants");

        // Act & Assert
        mockMvc.perform(get("/tenant"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        logger.info("testGetAllTenants passed.");
    }

    @Test
    public void testUpdateTenant() throws Exception {
        // Arrange
        String updatedTenantJson = "{\"email\":\"janedoe@example.com\",\"firstName\":\"Jane\",\"lastName\":\"Doe\",\"phone\":\"0987654321\",\"unitNumber\":\"102\"}";
        logger.info("Testing updateTenant with ID: {} and payload: {}", testTenantId, updatedTenantJson);

        // Act & Assert
        mockMvc.perform(put("/tenant/{id}", testTenantId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedTenantJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("janedoe@example.com"))
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
        		.andExpect(jsonPath("$.phone").value("0987654321"))
        		.andExpect(jsonPath("$.unitNumber").value("102"));

        logger.info("testUpdateTenant passed.");
    }

    @Test
    public void testDeleteTenant() throws Exception {
        // Arrange
        logger.info("Testing deleteTenant with ID: {}", testTenantId);

        // Act & Assert
        mockMvc.perform(delete("/tenant/{id}", testTenantId))
                .andExpect(status().isOk())
                .andExpect(content().string("Tenant with id " + testTenantId + " has been deleted successfully."));

        logger.info("testDeleteTenant passed.");
    }
   
}