package com.portfolio.band_go;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude={SecurityAutoConfiguration.class})
public class BandGoApplication {

	public static void main(String[] args) {
		SpringApplication.run(BandGoApplication.class, args);
	}

}
