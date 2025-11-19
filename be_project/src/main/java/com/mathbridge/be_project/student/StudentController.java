package com.mathbridge.be_project.student;

import com.mathbridge.be_project.user.User;
import com.mathbridge.be_project.user.UserRepository;
import com.mathbridge.be_project.user.UserService;
import com.mathbridge.be_project.common.UserRole;
import com.mathbridge.be_project.common.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/create")
    public ResponseEntity<?> createStudent(@RequestBody StudentRequest request) {
        try {
            User mockUser = getOrCreateDefaultUser();
            Student student = studentService.createStudent(mockUser, request);
            return ResponseEntity.ok(student);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Lỗi khi tạo học sinh: " + e.getMessage()));
        }
    }

    // RESTful style: POST /api/students
    @PostMapping
    public ResponseEntity<?> createStudentRest(@RequestBody StudentRequest request) {
        try {
            User mockUser = getOrCreateDefaultUser();
            Student student = studentService.createStudent(mockUser, request);
            return ResponseEntity.ok(student);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Lỗi khi tạo học sinh: " + e.getMessage()));
        }
    }

    private User getOrCreateDefaultUser() {
        // Tìm user với ID=1 hoặc email default@mathbridge.com
        Optional<User> existingUser = userRepository.findById(1L);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }
        
        // Tìm theo email nếu có
        Optional<User> existingByEmail = userRepository.findByEmail("default@mathbridge.com");
        if (existingByEmail.isPresent()) {
            return existingByEmail.get();
        }
        
        // Tạo default user nếu chưa có
        User defaultUser = new User();
        defaultUser.setFullName("Default User");
        defaultUser.setEmail("default@mathbridge.com");
        defaultUser.setPassword(passwordEncoder.encode("default123")); // Encoded password
        defaultUser.setRole(UserRole.STUDENT);
        defaultUser.setStatus(UserStatus.ACTIVE);
        return userService.createUser(defaultUser);
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        error.put("message", message);
        return error;
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
