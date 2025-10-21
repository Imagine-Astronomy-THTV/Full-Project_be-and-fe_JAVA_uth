package com.mathbridge.be_project.tutor;

import com.mathbridge.be_project.common.ApprovalStatus;
import com.mathbridge.be_project.user.User;
import com.mathbridge.be_project.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TutorService {
    
    @Autowired
    private TutorRepository tutorRepository;
    
    @Autowired
    private UserService userService;
    
    // Create new tutor
    public Tutor createTutor(Tutor tutor) {
        return tutorRepository.save(tutor);
    }
    
    // Get tutor by ID
    @Transactional(readOnly = true)
    public Optional<Tutor> getTutorById(Long id) {
        return tutorRepository.findById(id);
    }
    
    // Get tutor by user ID
    @Transactional(readOnly = true)
    public Optional<Tutor> getTutorByUserId(Long userId) {
        return tutorRepository.findByUserId(userId);
    }
    
    // Get all tutors
    @Transactional(readOnly = true)
    public List<Tutor> getAllTutors() {
        return tutorRepository.findAll();
    }
    
    // Get tutors by approval status
    @Transactional(readOnly = true)
    public List<Tutor> getTutorsByApprovalStatus(ApprovalStatus status) {
        return tutorRepository.findByApprovalStatus(status);
    }
    
    // Get approved tutors
    @Transactional(readOnly = true)
    public List<Tutor> getApprovedTutors() {
        return tutorRepository.findByApprovalStatusOrderByRatingDesc(ApprovalStatus.APPROVED);
    }
    
    // Get pending tutors
    @Transactional(readOnly = true)
    public List<Tutor> getPendingTutors() {
        return tutorRepository.findByApprovalStatus(ApprovalStatus.PENDING);
    }
    
    // Search tutors
    @Transactional(readOnly = true)
    public List<Tutor> searchTutors(String subject, BigDecimal minRate, BigDecimal maxRate, 
                                   BigDecimal minRating, Integer minExperience) {
        return tutorRepository.searchTutors(subject, minRate, maxRate, minRating, minExperience);
    }
    
    // Get top rated tutors
    @Transactional(readOnly = true)
    public List<Tutor> getTopRatedTutors() {
        return tutorRepository.findTopRatedTutors();
    }
    
    // Get most experienced tutors
    @Transactional(readOnly = true)
    public List<Tutor> getMostExperiencedTutors() {
        return tutorRepository.findMostExperiencedTutors();
    }
    
    // Update tutor
    public Tutor updateTutor(Tutor tutor) {
        return tutorRepository.save(tutor);
    }
    
    // Approve tutor
    public Tutor approveTutor(Long tutorId, Long approvedById) {
        Optional<Tutor> tutorOpt = tutorRepository.findById(tutorId);
        if (tutorOpt.isPresent()) {
            Tutor tutor = tutorOpt.get();
            tutor.setApprovalStatus(ApprovalStatus.APPROVED);
            tutor.setApprovedAt(LocalDateTime.now());
            
            Optional<User> approverOpt = userService.getUserById(approvedById);
            if (approverOpt.isPresent()) {
                tutor.setApprovedBy(approverOpt.get());
            }
            
            // Activate the user account
            userService.activateUser(tutor.getUser().getId());
            
            return tutorRepository.save(tutor);
        }
        throw new RuntimeException("Tutor not found with id: " + tutorId);
    }
    
    // Reject tutor
    public Tutor rejectTutor(Long tutorId, Long rejectedById) {
        Optional<Tutor> tutorOpt = tutorRepository.findById(tutorId);
        if (tutorOpt.isPresent()) {
            Tutor tutor = tutorOpt.get();
            tutor.setApprovalStatus(ApprovalStatus.REJECTED);
            tutor.setApprovedAt(LocalDateTime.now());
            
            Optional<User> rejecterOpt = userService.getUserById(rejectedById);
            if (rejecterOpt.isPresent()) {
                tutor.setApprovedBy(rejecterOpt.get());
            }
            
            // Deactivate the user account
            userService.deactivateUser(tutor.getUser().getId());
            
            return tutorRepository.save(tutor);
        }
        throw new RuntimeException("Tutor not found with id: " + tutorId);
    }
    
    // Update tutor rating
    public Tutor updateTutorRating(Long tutorId, BigDecimal newRating) {
        Optional<Tutor> tutorOpt = tutorRepository.findById(tutorId);
        if (tutorOpt.isPresent()) {
            Tutor tutor = tutorOpt.get();
            tutor.setRating(newRating);
            return tutorRepository.save(tutor);
        }
        throw new RuntimeException("Tutor not found with id: " + tutorId);
    }
    
    // Increment total sessions
    public Tutor incrementTotalSessions(Long tutorId) {
        Optional<Tutor> tutorOpt = tutorRepository.findById(tutorId);
        if (tutorOpt.isPresent()) {
            Tutor tutor = tutorOpt.get();
            tutor.setTotalSessions(tutor.getTotalSessions() + 1);
            return tutorRepository.save(tutor);
        }
        throw new RuntimeException("Tutor not found with id: " + tutorId);
    }
    
    // Delete tutor
    public void deleteTutor(Long id) {
        tutorRepository.deleteById(id);
    }
    
    // Check if user is already a tutor
    @Transactional(readOnly = true)
    public boolean isUserTutor(Long userId) {
        return tutorRepository.findByUserId(userId).isPresent();
    }
}
