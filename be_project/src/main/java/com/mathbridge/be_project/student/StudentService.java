package com.mathbridge.be_project.student;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentService {
    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public List<Student> findAll() {
        return repo.findAll();
    }

    public Student findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + id));
    }

    public Student create(StudentRequest req) {
        Student s = new Student(req.fullName(), req.dob(), req.phone(), req.note());
        return repo.save(s);
    }

    public Student update(Long id, StudentRequest req) {
        Student s = findById(id);
        s.setFullName(req.fullName());
        s.setDob(req.dob());
        s.setPhone(req.phone());
        s.setNote(req.note());
        return repo.save(s);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) throw new IllegalArgumentException("Student not found: " + id);
        repo.deleteById(id);
    }
}
