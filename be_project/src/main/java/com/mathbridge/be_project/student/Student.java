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
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getParent() {
        return parent;
    }

    public void setParent(User parent) {
        this.parent = parent;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getSubjects() {
        return subjects;
    }

    public void setSubjects(String subjects) {
        this.subjects = subjects;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
