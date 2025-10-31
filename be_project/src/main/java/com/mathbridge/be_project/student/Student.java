package com.mathbridge.be_project.student;

import com.mathbridge.be_project.user.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private User parent;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "note", length = 1000)
    private String note;

    @Column(name = "grade", length = 20)
    private String grade;

    @Column(name = "school", length = 255)
    private String school;

    @Column(name = "subjects", length = 1000)
    private String subjects;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Student() {}

    public Student(User user, String fullName, LocalDate dob, String phone, String note) {
        this.user = user;
        this.fullName = fullName;
        this.dob = dob;
        this.phone = phone;
        this.note = note;
    }

    public Student(String fullName, LocalDate dob, String phone, String note) {
        this.fullName = fullName;
        this.dob = dob;
        this.phone = phone;
        this.note = note;
    }

    public Student(User user, String fullName, LocalDate dob, String phone, String note, String grade) {
        this.user = user;
        this.fullName = fullName;
        this.dob = dob;
        this.phone = phone;
        this.note = note;
        this.grade = grade;
    }

    // Getters và Setters
    // (giữ nguyên như bạn đã có)
}
