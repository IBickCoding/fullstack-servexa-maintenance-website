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
public class VendorControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(VendorControllerTest.class);

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private Long testVendorId;

    @BeforeEach
    public void setup() throws Exception {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();

        // Insert a test user into the database and retrieve its ID
        String newVendorJson = "{\"name\":\"test vendor name\",\"serviceType\":\"plumbing\",\"addressLine1\":\"123 crack rd\",\"addressLine2\":\"\",\"addressCity\":\"columbia\",\"addressZip\":\"29201\",\"contactFirstName\":\"john\",\"contactLastName\":\"doe\",\"phone\":\"8031234567\",\"email\":\"johndoe@example.com\"}";
        String response = mockMvc.perform(post("/vendor")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newVendorJson))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract the ID from the response (assuming the response contains the user ID)
        Integer id = JsonPath.read(response, "$.vendorId");
        testVendorId = id.longValue();

        logger.info("Setup complete. Test Vendor ID: {}", testVendorId);
    }

    @Test
    public void testGetVendorById() throws Exception {
        // Arrange
        logger.info("Testing getVendorById with ID: {}", testVendorId);

        // Act & Assert
        mockMvc.perform(get("/vendor/{id}", testVendorId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vendorId").value(testVendorId));

        logger.info("testGetVendorById passed.");
    }

    @Test
    public void testCreateVendor() throws Exception {
        // Arrange
        String newVendorJson = "{\"name\":\"test vendor name\",\"serviceType\":\"plumbing\",\"addressLine1\":\"123 crack rd\",\"addressLine2\":\"ste 2\",\"addressCity\":\"columbia\",\"addressZip\":\"29201\",\"contactFirstName\":\"john\",\"contactLastName\":\"doe\",\"phone\":\"8031234567\",\"email\":\"email@yahoo.com\"}";
        logger.info("Testing createUser with payload: {}", newVendorJson);

        // Act & Assert
        mockMvc.perform(post("/vendor")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newVendorJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("test vendor name"))
                .andExpect(jsonPath("$.serviceType").value("plumbing"))
                .andExpect(jsonPath("$.addressLine1").value("123 crack rd"))
                .andExpect(jsonPath("$.addressLine2").value("ste 2"))
                .andExpect(jsonPath("$.addressCity").value("columbia"))
                .andExpect(jsonPath("$.addressZip").value("29201"))
                .andExpect(jsonPath("$.contactFirstName").value("john"))
                .andExpect(jsonPath("$.contactLastName").value("doe"))
                .andExpect(jsonPath("$.phone").value("8031234567"))
                .andExpect(jsonPath("$.email").value("email@yahoo.com"));

        logger.info("testCreateVendor passed.");
    }

    @Test
    public void testGetAllVendor() throws Exception {
        // Arrange
        logger.info("Testing getAllVendor");

        // Act & Assert
        mockMvc.perform(get("/vendor"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        logger.info("testGetAllVendor passed.");
    }

    @Test
    public void testUpdateVendor() throws Exception {
        // Arrange
        String updatedVendorJson = "{\"name\":\"test vendor name2\",\"serviceType\":\"electrical\",\"addressLine1\":\"456 crack rd\",\"addressLine2\":\"ste 3\",\"addressCity\":\"columbia\",\"addressZip\":\"29201\",\"contactFirstName\":\"jane\",\"contactLastName\":\"doe\",\"phone\":\"8031234567\",\"email\":\"email2@yahoo.com\"}";
        logger.info("Testing updateVendor with ID: {} and payload: {}", testVendorId, updatedVendorJson);

        // Act & Assert
        mockMvc.perform(put("/vendor/{id}", testVendorId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedVendorJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("test vendor name2"))
                .andExpect(jsonPath("$.serviceType").value("electrical"))
                .andExpect(jsonPath("$.addressLine1").value("456 crack rd"))
                .andExpect(jsonPath("$.addressLine2").value("ste 3"))
                .andExpect(jsonPath("$.addressCity").value("columbia"))
                .andExpect(jsonPath("$.addressZip").value("29201"))
                .andExpect(jsonPath("$.contactFirstName").value("jane"))
                .andExpect(jsonPath("$.contactLastName").value("doe"))
                .andExpect(jsonPath("$.phone").value("8031234567"))
                .andExpect(jsonPath("$.email").value("email2@yahoo.com"));

        logger.info("testUpdateVendor passed.");
    }

    @Test
    public void testDeleteVendor() throws Exception {
        // Arrange
        logger.info("Testing deleteVendor with ID: {}", testVendorId);

        // Act & Assert
        mockMvc.perform(delete("/vendor/{id}", testVendorId))
                .andExpect(status().isOk())
                .andExpect(content().string("Vendor with id " + testVendorId + " has been deleted successfully."));

        logger.info("testDeleteVendor passed.");
    }
   
}