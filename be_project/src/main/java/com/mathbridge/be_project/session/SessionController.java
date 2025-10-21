package com.mathbridge.be_project.session;

import com.mathbridge.be_project.common.SessionStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
@Tag(name = "Session Management", description = "APIs for managing tutoring sessions")
public class SessionController {
    
    @Autowired
    private SessionService sessionService;
    
    @PostMapping
    @Operation(summary = "Create a new session", description = "Schedule a new tutoring session")
    public ResponseEntity<Session> createSession(@Valid @RequestBody Session session) {
        try {
            Session createdSession = sessionService.createSession(session);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSession);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all sessions", description = "Retrieve all sessions")
    public ResponseEntity<List<Session>> getAllSessions() {
        List<Session> sessions = sessionService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get session by ID", description = "Retrieve a specific session by its ID")
    public ResponseEntity<Session> getSessionById(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        Optional<Session> session = sessionService.getSessionById(id);
        return session.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/tutor/{tutorId}")
    @Operation(summary = "Get sessions by tutor", description = "Retrieve all sessions for a specific tutor")
    public ResponseEntity<List<Session>> getSessionsByTutor(
            @Parameter(description = "Tutor ID") @PathVariable Long tutorId) {
        List<Session> sessions = sessionService.getSessionsByTutor(tutorId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get sessions by student", description = "Retrieve all sessions for a specific student")
    public ResponseEntity<List<Session>> getSessionsByStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        List<Session> sessions = sessionService.getSessionsByStudent(studentId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get sessions by status", description = "Retrieve sessions by their status")
    public ResponseEntity<List<Session>> getSessionsByStatus(
            @Parameter(description = "Session status") @PathVariable SessionStatus status) {
        List<Session> sessions = sessionService.getSessionsByStatus(status);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/tutor/{tutorId}/upcoming")
    @Operation(summary = "Get upcoming sessions for tutor", description = "Retrieve upcoming sessions for a specific tutor")
    public ResponseEntity<List<Session>> getUpcomingSessionsForTutor(
            @Parameter(description = "Tutor ID") @PathVariable Long tutorId) {
        List<Session> sessions = sessionService.getUpcomingSessionsForTutor(tutorId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/student/{studentId}/upcoming")
    @Operation(summary = "Get upcoming sessions for student", description = "Retrieve upcoming sessions for a specific student")
    public ResponseEntity<List<Session>> getUpcomingSessionsForStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        List<Session> sessions = sessionService.getUpcomingSessionsForStudent(studentId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/tutor/{tutorId}/completed")
    @Operation(summary = "Get completed sessions for tutor", description = "Retrieve completed sessions for a specific tutor")
    public ResponseEntity<List<Session>> getCompletedSessionsForTutor(
            @Parameter(description = "Tutor ID") @PathVariable Long tutorId) {
        List<Session> sessions = sessionService.getCompletedSessionsForTutor(tutorId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/student/{studentId}/completed")
    @Operation(summary = "Get completed sessions for student", description = "Retrieve completed sessions for a specific student")
    public ResponseEntity<List<Session>> getCompletedSessionsForStudent(
            @Parameter(description = "Student ID") @PathVariable Long studentId) {
        List<Session> sessions = sessionService.getCompletedSessionsForStudent(studentId);
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/date-range")
    @Operation(summary = "Get sessions by date range", description = "Retrieve sessions within a specific date range")
    public ResponseEntity<List<Session>> getSessionsByDateRange(
            @Parameter(description = "Start date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Session> sessions = sessionService.getSessionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(sessions);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update session", description = "Update session information")
    public ResponseEntity<Session> updateSession(
            @Parameter(description = "Session ID") @PathVariable Long id,
            @Valid @RequestBody Session session) {
        try {
            session.setId(id);
            Session updatedSession = sessionService.updateSession(session);
            return ResponseEntity.ok(updatedSession);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}/confirm")
    @Operation(summary = "Confirm session", description = "Confirm a scheduled session")
    public ResponseEntity<Session> confirmSession(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        try {
            Session confirmedSession = sessionService.confirmSession(id);
            return ResponseEntity.ok(confirmedSession);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}/complete")
    @Operation(summary = "Complete session", description = "Mark a session as completed")
    public ResponseEntity<Session> completeSession(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        try {
            Session completedSession = sessionService.completeSession(id);
            return ResponseEntity.ok(completedSession);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel session", description = "Cancel a session")
    public ResponseEntity<Session> cancelSession(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        try {
            Session cancelledSession = sessionService.cancelSession(id);
            return ResponseEntity.ok(cancelledSession);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/{id}/cancellation-fee")
    @Operation(summary = "Calculate cancellation fee", description = "Calculate the cancellation fee for a session")
    public ResponseEntity<BigDecimal> calculateCancellationFee(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        Optional<Session> sessionOpt = sessionService.getSessionById(id);
        if (sessionOpt.isPresent()) {
            BigDecimal fee = sessionService.calculateCancellationFee(sessionOpt.get());
            return ResponseEntity.ok(fee);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/conflict-check")
    @Operation(summary = "Check for conflicts", description = "Check if there are conflicting sessions for a tutor")
    public ResponseEntity<Boolean> hasConflictingSessions(
            @Parameter(description = "Tutor ID") @RequestParam Long tutorId,
            @Parameter(description = "Start time") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "End time") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        boolean hasConflicts = sessionService.hasConflictingSessions(tutorId, startTime, endTime);
        return ResponseEntity.ok(hasConflicts);
    }
    
    @GetMapping("/tutor/{tutorId}/count/{status}")
    @Operation(summary = "Count sessions by status for tutor", description = "Count sessions by status for a specific tutor")
    public ResponseEntity<Long> countSessionsByTutorAndStatus(
            @Parameter(description = "Tutor ID") @PathVariable Long tutorId,
            @Parameter(description = "Session status") @PathVariable SessionStatus status) {
        Long count = sessionService.countSessionsByTutorAndStatus(tutorId, status);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/student/{studentId}/count/{status}")
    @Operation(summary = "Count sessions by status for student", description = "Count sessions by status for a specific student")
    public ResponseEntity<Long> countSessionsByStudentAndStatus(
            @Parameter(description = "Student ID") @PathVariable Long studentId,
            @Parameter(description = "Session status") @PathVariable SessionStatus status) {
        Long count = sessionService.countSessionsByStudentAndStatus(studentId, status);
        return ResponseEntity.ok(count);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete session", description = "Delete a session")
    public ResponseEntity<Void> deleteSession(
            @Parameter(description = "Session ID") @PathVariable Long id) {
        try {
            sessionService.deleteSession(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
