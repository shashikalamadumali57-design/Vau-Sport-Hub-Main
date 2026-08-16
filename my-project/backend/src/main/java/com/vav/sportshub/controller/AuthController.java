package com.vav.sportshub.controller;

import java.util.List;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vav.sportshub.entity.User;
import com.vav.sportshub.repository.UserRepository;
import com.vav.sportshub.security.JwtUtils;
import com.vav.sportshub.security.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
        userDetails.getId(),
        userDetails.getUsername(),
        userDetails.getEmail(),
        roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
    System.out.println("Registration attempt - Username: " + signUpRequest.getUsername() +
        ", Email: " + signUpRequest.getEmail() +
        ", Role: " + signUpRequest.getRole());

    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      System.out.println("Registration failed - Username already exists: " + signUpRequest.getUsername());
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      System.out.println("Registration failed - Email already exists: " + signUpRequest.getEmail());
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    try {
      // Create new user's account
      User user = new User();
      user.setUsername(signUpRequest.getUsername());
      user.setEmail(signUpRequest.getEmail());
      user.setPassword(encoder.encode(signUpRequest.getPassword()));

      // Set role with validation
      if (signUpRequest.getRole() != null && !signUpRequest.getRole().isEmpty()) {
        try {
          User.Role userRole = User.Role.valueOf(signUpRequest.getRole());
          user.setRole(userRole);
          System.out.println("Role set successfully: " + userRole);
        } catch (IllegalArgumentException e) {
          System.err.println("Invalid role provided: " + signUpRequest.getRole());
          System.err.println(
              "Valid roles are: ROLE_STUDENT, ROLE_CAPTAIN, ROLE_VICE_CAPTAIN, ROLE_COACH, ROLE_ADMIN, ROLE_MEMBER");
          return ResponseEntity
              .badRequest()
              .body(new MessageResponse(
                  "Error: Invalid role specified! Valid roles are: ROLE_STUDENT, ROLE_CAPTAIN, ROLE_VICE_CAPTAIN, ROLE_COACH, ROLE_ADMIN, ROLE_MEMBER"));
        }
      } else {
        user.setRole(User.Role.ROLE_STUDENT);
        System.out.println("No role specified, defaulting to ROLE_STUDENT");
      }

      User savedUser = userRepository.save(user);
      System.out
          .println("User registered successfully: " + savedUser.getUsername() + " with role: " + savedUser.getRole());

      return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    } catch (Exception e) {
      System.err.println("Registration error: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Registration failed - " + e.getMessage()));
    }
  }
}

// Request/Response DTOs defined internally for brevity in this step
class LoginRequest {
  private String username;
  private String password;

  // getters setters
  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}

class SignupRequest {
  private String username;
  private String email;
  private String role;
  private String password;

  // getters setters
  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }
}

class JwtResponse {
  private String token;
  private Long id;
  private String username;
  private String email;
  private List<String> roles;

  public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }

  // getters
  public String getAccessToken() {
    return token;
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getUsername() {
    return username;
  }

  public List<String> getRoles() {
    return roles;
  }
}

class MessageResponse {
  private String message;

  public MessageResponse(String message) {
    this.message = message;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
