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
public class ServiceRequestControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(ServiceRequestControllerTest.class);

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private Long testServiceRequestId;

    @BeforeEach
    public void setup() throws Exception {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();

        // Insert a test user into the database and retrieve its ID
        String newServiceRequestJson = "{\"status\":\"Pending\",\"urgency\":\"High\",\"submissionDate\":\"04/04/2026\",\"description\":\"Test description\",\"division\":\"Plumbing\"}";
        String response = mockMvc.perform(post("/service-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newServiceRequestJson))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract the ID from the response (assuming the response contains the user ID)
        Integer id = JsonPath.read(response, "$.serviceRequestId");
        testServiceRequestId = id.longValue();

        logger.info("Setup complete. Test user ID: {}", testServiceRequestId);
    }

    @Test
    public void testGetServiceRequestById() throws Exception {
        // Arrange
        logger.info("Testing GetServiceRequestById with ID: {}", testServiceRequestId);

        // Act & Assert
        mockMvc.perform(get("/service-request/{id}", testServiceRequestId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testServiceRequestId));

        logger.info("testGetServiceRequestById passed.");
    }

    @Test
    public void testCreateServiceRequest() throws Exception {
        // Arrange
        String newServiceRequestJson = "{\"status\":\"Pending\",\"urgency\":\"High\",\"submissionDate\":\"04/04/2026\",\"description\":\"Test description\",\"division\":\"Plumbing\"}";
        logger.info("Testing createServiceRequest with payload: {}", newServiceRequestJson);

        // Act & Assert
        mockMvc.perform(post("/service-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newServiceRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Pending"))
                .andExpect(jsonPath("$.urgency").value("High"))
                .andExpect(jsonPath("$.submissionDate").value("04/04/2026"))
        		.andExpect(jsonPath("$.description").value("Test description"))
				.andExpect(jsonPath("$.division").value("Plumbing"));

        logger.info("testCreateServiceRequest passed.");
    }

    @Test
    public void testGetAllServiceRequest() throws Exception {
        // Arrange
        logger.info("Testing getAllServiceRequest");

        // Act & Assert
        mockMvc.perform(get("/service-request"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        logger.info("testGetAllServiceRequest passed.");
    }

    @Test
    public void testUpdateServiceRequest() throws Exception {
        // Arrange
        String updatedServiceRequestJson = "{\"status\":\"closed\",\"urgency\":\"low\",\"submissionDate\":\"04/04/2026\",\"description\":\"Updated description\",\"division\":\"Updated division\"}";
        logger.info("Testing updateUser with ID: {} and payload: {}", testServiceRequestId, updatedServiceRequestJson);

        // Act & Assert
        mockMvc.perform(put("/service-request/{id}", testServiceRequestId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedServiceRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("closed"))
                .andExpect(jsonPath("$.urgency").value("low"))
                .andExpect(jsonPath("$.submissionDate").value("04/04/2026"))
                .andExpect(jsonPath("$.description").value("Updated description"))
                .andExpect(jsonPath("$.division").value("Updated division"));
        logger.info("testUpdateServiceRequest passed.");
    }

    @Test
    public void testDeleteServiceRequest() throws Exception {
        // Arrange
        logger.info("Testing deleteServiceRequest with ID: {}", testServiceRequestId);

        // Act & Assert
        mockMvc.perform(delete("/service-request/{id}", testServiceRequestId))
                .andExpect(status().isOk())
                .andExpect(content().string("ServiceRequest with id " + testServiceRequestId + " has been deleted successfully."));

        logger.info("testDeleteServiceRequest passed.");
    }
   
}