package edu.cit.bargamento.healthline;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class HealthlineApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
		// Proves the application starts up with the new package structure
	}

	@Test
	void testConsultationAccess() throws Exception {
		// Proves the Consultation slice is functional
		mockMvc.perform(get("/api/v1/consultations"))
				.andExpect(status().isOk());
	}
}