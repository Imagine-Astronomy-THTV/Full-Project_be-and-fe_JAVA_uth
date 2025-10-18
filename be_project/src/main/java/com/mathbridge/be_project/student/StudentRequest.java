package com.mathbridge.be_project.student;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record StudentRequest(
        @NotBlank @Size(max = 255) String fullName,
        LocalDate dob,
        @Size(max = 30) String phone,
        @Size(max = 1000) String note
) {}
