package com.mathbridge.be_project.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {
    private String fullName;
    private LocalDate dob;
    private String phone;
    private String note;
    private String grade;
    private String school;
    private String subjects;
}
