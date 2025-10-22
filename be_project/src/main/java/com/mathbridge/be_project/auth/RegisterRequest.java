package com.mathbridge.be_project.auth;

import com.mathbridge.be_project.common.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String email;
    private String password;
    private UserRole role;
}
