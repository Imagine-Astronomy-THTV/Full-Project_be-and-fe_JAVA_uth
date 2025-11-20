package com.mathbridge.be_project.auth;

import com.mathbridge.be_project.security.JwtUtils;
import com.mathbridge.be_project.user.*;
import com.mathbridge.be_project.common.UserStatus;
import com.mathbridge.be_project.common.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        try {
            // Xác thực user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userService.getUserByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));
            
            String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
            
            // Tạo UserDTO với thông tin user
            AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getRole().name()
            );
            
            // Tạo AuthResponse với đầy đủ thông tin
            AuthResponse response = new AuthResponse();
            response.setOk(true);
            response.setMessage("Đăng nhập thành công");
            response.setToken(token);
            response.setUser(userDTO);
            
            return response;
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Email hoặc mật khẩu không đúng", e);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi đăng nhập: " + e.getMessage(), e);
        }
    }

    public AuthResponse register(RegisterRequest request) {
        // Create user using available constructor on User
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        // Set default role to STUDENT if not provided
        UserRole role = request.getRole() != null ? request.getRole() : UserRole.STUDENT;
        User user = new User(
                "User", // Default fullName - can be updated later
                request.getEmail(),
                encodedPassword,
                null, // phone
                role
        );
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userService.createUser(user);
        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        
        // Tạo UserDTO với thông tin user
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
        
        // Tạo AuthResponse với đầy đủ thông tin
        AuthResponse response = new AuthResponse();
        response.setOk(true);
        response.setMessage("Đăng ký thành công");
        response.setToken(token);
        response.setUser(userDTO);
        
        return response;
    }
}
