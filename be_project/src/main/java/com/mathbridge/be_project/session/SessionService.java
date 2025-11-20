package com.mathbridge.be_project.session;

import com.mathbridge.be_project.common.SessionStatus;
import com.mathbridge.be_project.student.Student;
import com.mathbridge.be_project.student.StudentRepository;
import com.mathbridge.be_project.tutor.Tutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
    
    @Autowired
    private StudentRepository studentRepository;
    
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
    
    // Create session from request (simplified form data)
    public Session createSessionFromRequest(SessionRequest request, Tutor tutor) {
        // Combine date and time into LocalDateTime
        LocalDateTime scheduledDate = request.getDate().atTime(request.getTime());
        
        // Get student from request or use first available student from database
        Student student = getStudentFromRequest(request);
        
        // Set subject (default to "Toán học" if not provided)
        String subject = (request.getSubject() != null && !request.getSubject().trim().isEmpty()) 
                ? request.getSubject().trim() 
                : "Toán học";
        
        // Set duration (default to 60 minutes)
        Integer duration = 60;
        
        // Get hourly rate from tutor, or default to 0
        BigDecimal hourlyRate = tutor.getHourlyRate() != null && tutor.getHourlyRate().compareTo(BigDecimal.ZERO) > 0
                ? tutor.getHourlyRate()
                : BigDecimal.valueOf(200000); // Default 200,000 VND per hour
        
        // Calculate total amount
        BigDecimal totalAmount = hourlyRate.multiply(BigDecimal.valueOf(duration / 60.0));
        
        // Set location based on method
        String location = "online".equalsIgnoreCase(request.getMethod()) 
                ? "Online (Zoom / Google Meet)" 
                : "Học trực tiếp";
        
        // Verify student ID exists in database before creating session
        if (student.getId() == null || !studentRepository.existsById(student.getId())) {
            throw new RuntimeException("Học sinh không tồn tại trong hệ thống. Vui lòng chọn học sinh khác.");
        }
        
        // Create session
        Session session = new Session();
        session.setTutor(tutor);
        session.setStudent(student);
        session.setSubject(subject);
        session.setScheduledDate(scheduledDate);
        session.setDuration(duration);
        session.setStatus(SessionStatus.SCHEDULED);
        session.setLocation(location);
        session.setNotes(request.getNote());
        session.setHourlyRate(hourlyRate);
        session.setTotalAmount(totalAmount);
        
        // Check for conflicts before creating
        if (hasConflictingSessions(tutor.getId(), 
                                  scheduledDate, 
                                  scheduledDate.plusMinutes(duration))) {
            throw new RuntimeException("Đã có lịch học trùng thời gian. Vui lòng chọn thời gian khác.");
        }
        
        try {
            return sessionRepository.save(session);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Handle foreign key constraint violations
            if (e.getMessage() != null && e.getMessage().contains("FOREIGN KEY")) {
                throw new RuntimeException("Lỗi: Học sinh không tồn tại trong hệ thống. Vui lòng chọn học sinh khác hoặc thêm học sinh mới.");
            }
            throw e;
        }
    }
    
    // Get student from request or use first available student from database
    private Student getStudentFromRequest(SessionRequest request) {
        Student student = null;
        
        // If studentId is provided, use that student
        if (request.getStudentId() != null && request.getStudentId() > 0) {
            Optional<Student> studentOpt = studentRepository.findById(request.getStudentId());
            if (studentOpt.isPresent()) {
                student = studentOpt.get();
                // Verify student actually exists and has an ID
                if (student.getId() == null) {
                    throw new RuntimeException("Học sinh không hợp lệ: ID không tồn tại");
                }
            } else {
                throw new RuntimeException("Không tìm thấy học sinh với ID: " + request.getStudentId() + ". Vui lòng chọn học sinh khác hoặc thêm học sinh mới.");
            }
        } else {
            // Otherwise, get the first available student from database
            List<Student> students = studentRepository.findAll();
            if (students.isEmpty()) {
                throw new RuntimeException("Không có học sinh nào trong hệ thống. Vui lòng thêm học sinh trước khi đặt lịch học.");
            }
            
            student = students.get(0);
            System.out.println("WARNING: No student selected, using first student from database. Student ID: " + student.getId() + ", Name: " + student.getFullName());
            // Verify student has an ID
            if (student.getId() == null) {
                throw new RuntimeException("Học sinh không hợp lệ: ID không tồn tại");
            }
        }
        
        System.out.println("Creating session with Student ID: " + student.getId() + ", Name: " + student.getFullName());
        
        // Final verification: ensure student ID is valid
        if (student == null || student.getId() == null) {
            throw new RuntimeException("Không thể xác định học sinh cho buổi học. Vui lòng thử lại.");
        }
        
        return student;
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
        List<Session> sessions = sessionRepository.findByTutorId(tutorId);
        // Trigger lazy loading for User in Tutor and Student to avoid LazyInitializationException
        if (sessions != null) {
            for (Session session : sessions) {
                if (session.getTutor() != null && session.getTutor().getUser() != null) {
                    // Trigger lazy loading
                    session.getTutor().getUser().getEmail();
                    session.getTutor().getUser().getFullName();
                }
                if (session.getStudent() != null && session.getStudent().getUser() != null) {
                    // Trigger lazy loading
                    session.getStudent().getUser().getEmail();
                    session.getStudent().getUser().getFullName();
                }
            }
        }
        return sessions;
    }
    
    // Get sessions by student
    @Transactional(readOnly = true)
    public List<Session> getSessionsByStudent(Long studentId) {
        List<Session> sessions = sessionRepository.findByStudentId(studentId);
        // Trigger lazy loading for User in Tutor and Student to avoid LazyInitializationException
        if (sessions != null) {
            for (Session session : sessions) {
                if (session.getTutor() != null && session.getTutor().getUser() != null) {
                    // Trigger lazy loading
                    session.getTutor().getUser().getEmail();
                    session.getTutor().getUser().getFullName();
                }
                if (session.getStudent() != null && session.getStudent().getUser() != null) {
                    // Trigger lazy loading
                    session.getStudent().getUser().getEmail();
                    session.getStudent().getUser().getFullName();
                }
            }
        }
        return sessions;
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
