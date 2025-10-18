package com.mathbridge.be_project.student;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students") // khớp tên bảng trong V1__init.sql
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "note", length = 1000)
    private String note;

    // DB sẽ tự set DEFAULT SYSDATETIME(); không cần app set
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Student() {}

    public Student(String fullName, LocalDate dob, String phone, String note) {
        this.fullName = fullName;
        this.dob = dob;
        this.phone = phone;
        this.note = note;
    }

    // getters & setters
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public LocalDate getDob() { return dob; }
    public String getPhone() { return phone; }
    public String getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setNote(String note) { this.note = note; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
