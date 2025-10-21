package com.mathbridge.be_project.session;

import com.mathbridge.be_project.common.SessionStatus;
import com.mathbridge.be_project.student.Student;
import com.mathbridge.be_project.tutor.Tutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SessionService {
    
    @Autowired
    private SessionRepository sessionRepository;
    
    // Create new session
    public Session createSession(Session session) {
        // Check for conflicts before creating
        if (hasConflictingSessions(session.getTutor().getId(), 
                                  session.getScheduledDate(), 
                                  session.getScheduledDate().plusMinutes(session.getDuration()))) {
            throw new RuntimeException("Conflicting session exists for the selected time slot");
        }
        
        return sessionRepository.save(session);
    }
    
    // Get session by ID
    @Transactional(readOnly = true)
    public Optional<Session> getSessionById(Long id) {
        return sessionRepository.findById(id);
    }
    
    // Get all sessions
    @Transactional(readOnly = true)
    public List<Session> getAllSessions() {
        return sessionRepository.findAll();
    }
    
    // Get sessions by tutor
    @Transactional(readOnly = true)
    public List<Session> getSessionsByTutor(Long tutorId) {
        return sessionRepository.findByTutorId(tutorId);
    }
    
    // Get sessions by student
    @Transactional(readOnly = true)
    public List<Session> getSessionsByStudent(Long studentId) {
        return sessionRepository.findByStudentId(studentId);
    }
    
    // Get sessions by status
    @Transactional(readOnly = true)
    public List<Session> getSessionsByStatus(SessionStatus status) {
        return sessionRepository.findByStatus(status);
    }
    
    // Get upcoming sessions for tutor
    @Transactional(readOnly = true)
    public List<Session> getUpcomingSessionsForTutor(Long tutorId) {
        return sessionRepository.findUpcomingSessionsForTutor(tutorId, LocalDateTime.now());
    }
    
    // Get upcoming sessions for student
    @Transactional(readOnly = true)
    public List<Session> getUpcomingSessionsForStudent(Long studentId) {
        return sessionRepository.findUpcomingSessionsForStudent(studentId, LocalDateTime.now());
    }
    
    // Get completed sessions for tutor
    @Transactional(readOnly = true)
    public List<Session> getCompletedSessionsForTutor(Long tutorId) {
        return sessionRepository.findCompletedSessionsForTutor(tutorId);
    }
    
    // Get completed sessions for student
    @Transactional(readOnly = true)
    public List<Session> getCompletedSessionsForStudent(Long studentId) {
        return sessionRepository.findCompletedSessionsForStudent(studentId);
    }
    
    // Get sessions by date range
    @Transactional(readOnly = true)
    public List<Session> getSessionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return sessionRepository.findByDateRange(startDate, endDate);
    }
    
    // Update session
    public Session updateSession(Session session) {
        return sessionRepository.save(session);
    }
    
    // Confirm session
    public Session confirmSession(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            if (session.getStatus() == SessionStatus.SCHEDULED) {
                session.setStatus(SessionStatus.CONFIRMED);
                return sessionRepository.save(session);
            } else {
                throw new RuntimeException("Session cannot be confirmed. Current status: " + session.getStatus());
            }
        }
        throw new RuntimeException("Session not found with id: " + sessionId);
    }
    
    // Complete session
    public Session completeSession(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            if (session.getStatus() == SessionStatus.CONFIRMED) {
                session.setStatus(SessionStatus.COMPLETED);
                return sessionRepository.save(session);
            } else {
                throw new RuntimeException("Session cannot be completed. Current status: " + session.getStatus());
            }
        }
        throw new RuntimeException("Session not found with id: " + sessionId);
    }
    
    // Cancel session
    public Session cancelSession(Long sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            if (session.getStatus() != SessionStatus.COMPLETED) {
                session.setStatus(SessionStatus.CANCELLED);
                return sessionRepository.save(session);
            } else {
                throw new RuntimeException("Cannot cancel completed session");
            }
        }
        throw new RuntimeException("Session not found with id: " + sessionId);
    }
    
    // Check for conflicting sessions
    @Transactional(readOnly = true)
    public boolean hasConflictingSessions(Long tutorId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Session> conflicts = sessionRepository.findConflictingSessions(tutorId, startTime, endTime);
        return !conflicts.isEmpty();
    }
    
    // Calculate cancellation fee
    public BigDecimal calculateCancellationFee(Session session) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sessionTime = session.getScheduledDate();
        
        long hoursUntilSession = java.time.Duration.between(now, sessionTime).toHours();
        
        if (hoursUntilSession >= 12) {
            return BigDecimal.ZERO; // No fee if cancelled 12+ hours before
        } else if (hoursUntilSession > 0) {
            return session.getTotalAmount().multiply(new BigDecimal("0.5")); // 50% fee if cancelled within 12 hours
        } else {
            return session.getTotalAmount(); // 100% fee if cancelled after session time
        }
    }
    
    // Delete session
    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }
    
    // Count sessions by status for tutor
    @Transactional(readOnly = true)
    public Long countSessionsByTutorAndStatus(Long tutorId, SessionStatus status) {
        return sessionRepository.countSessionsByTutorAndStatus(tutorId, status);
    }
    
    // Count sessions by status for student
    @Transactional(readOnly = true)
    public Long countSessionsByStudentAndStatus(Long studentId, SessionStatus status) {
        return sessionRepository.countSessionsByStudentAndStatus(studentId, status);
    }
}
