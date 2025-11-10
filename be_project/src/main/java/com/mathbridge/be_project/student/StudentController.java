package com.mathbridge.be_project.student;

import com.mathbridge.be_project.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping("/create")
    public ResponseEntity<Student> createStudent(@RequestBody StudentRequest request) {
        // Tạm thời mock user để test, sau này sẽ lấy từ Auth
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setFullName("Default User");
        Student student = studentService.createStudent(mockUser, request);
        return ResponseEntity.ok(student);
    }

    // RESTful style: POST /api/students
    @PostMapping
    public ResponseEntity<Student> createStudentRest(@RequestBody StudentRequest request) {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setFullName("Default User");
        Student student = studentService.createStudent(mockUser, request);
        return ResponseEntity.ok(student);
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentRequest request
    ) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    // Partial update to match FE schema that may send only changed fields
    @PatchMapping("/{id}")
    public ResponseEntity<Student> patchStudent(
            @PathVariable Long id,
            @RequestBody StudentRequest request
    ) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
