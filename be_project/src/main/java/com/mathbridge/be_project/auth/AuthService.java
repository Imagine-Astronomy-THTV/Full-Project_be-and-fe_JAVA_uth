package com.mathbridge.be_project.auth;

import com.mathbridge.be_project.security.JwtUtils;
import com.mathbridge.be_project.user.*;
import com.mathbridge.be_project.common.UserStatus;
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
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userService.getUserByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name());
    }

    public AuthResponse register(RegisterRequest request) {
        // Create user using available constructor on User
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(
                "", // fullName not provided in RegisterRequest
                request.getEmail(),
                encodedPassword,
                null, // phone
                request.getRole()
        );
        user.setStatus(UserStatus.ACTIVE);

        userService.createUser(user);
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getRole().name());
    }
}
