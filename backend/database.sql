-- JISU-PHD Backend Database Schema

-- Users Table: Stores all users with a role.
-- This table will be used for authentication.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dsc_member', 'supervisor', 'co_supervisor', 'student') NOT NULL,
    unique_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students Table: Stores student-specific information.
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dsc_id INT, -- Added DSC ID for direct linkage
    program VARCHAR(255),
    status ENUM('pending', 'active', 'rejected', 'graduated') NOT NULL DEFAULT 'pending',
    application_date DATE,
    enrollment_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dsc_id) REFERENCES dscs(id) ON DELETE SET NULL -- Or ON DELETE CASCADE, depending on business logic
);

-- DSC (Departmental Scrutiny Committee) Table
CREATE TABLE dscs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    formation_date DATE,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DSC Members Junction Table: Links users (faculty) to DSCs.
CREATE TABLE dsc_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dsc_id INT NOT NULL,
    role_in_dsc ENUM('supervisor', 'co_supervisor', 'member') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dsc_id) REFERENCES dscs(id) ON DELETE CASCADE,
    UNIQUE(user_id, dsc_id)
);


-- Submissions Table: For pre-thesis, final thesis, etc.
CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    type VARCHAR(255) NOT NULL, -- e.g., 'pre-thesis', 'final-thesis'
    title VARCHAR(255),
    abstract TEXT,
        status ENUM('pending', 'under_review', 'approved', 'rejected', 'pending_co_supervisor_approval', 'pending_supervisor_approval') NOT NULL DEFAULT 'pending',
    submission_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Feedback Table: Stores feedback/comments on submissions.
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
