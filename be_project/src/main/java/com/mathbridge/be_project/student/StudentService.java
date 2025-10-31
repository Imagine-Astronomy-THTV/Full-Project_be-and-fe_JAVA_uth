package com.mathbridge.be_project.student;

import com.mathbridge.be_project.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    // Thêm mới học sinh
    public Student createStudent(User user, StudentRequest request) {
        Student student = new Student(
                user,
                request.getFullName(),
                request.getDob(),
                request.getPhone(),
                request.getNote(),
                request.getGrade()
        );
        return studentRepository.save(student);
    }

    // Cập nhật thông tin học sinh
    public Student updateStudent(Long id, StudentRequest request) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isEmpty()) {
            throw new RuntimeException("Student not found with id: " + id);
        }

        Student student = optionalStudent.get();
        student.setFullName(request.getFullName());
        student.setDob(request.getDob());
        student.setPhone(request.getPhone());
        student.setNote(request.getNote());
        student.setGrade(request.getGrade());
        student.setSchool(request.getSchool());
        student.setSubjects(request.getSubjects());

        return studentRepository.save(student);
    }

    // Lấy tất cả học sinh
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Lấy học sinh theo ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    // Xóa học sinh
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }
}
