-- JISU-PHD Backend Database Schema

-- Users Table: Stores all users with a role.
-- This table will be used for authentication.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dsc_member', 'supervisor', 'co_supervisor', 'student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students Table: Stores student-specific information.
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(255) UNIQUE, -- e.g., JIS2024001
    program VARCHAR(255),
    status ENUM('pending', 'active', 'rejected', 'graduated') NOT NULL DEFAULT 'pending',
    application_date DATE,
    enrollment_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

-- Student-Supervisor Junction Table: Links students to their supervisors and co-supervisors.
CREATE TABLE student_supervisors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    supervisor_id INT NOT NULL,
    supervisor_role ENUM('supervisor', 'co_supervisor') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(student_id, supervisor_id)
);

-- Applications Table: For various student applications (registration, extension, etc.)
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    status ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    submission_date DATE,
    details TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Submissions Table: For pre-thesis, final thesis, etc.
CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    type VARCHAR(255) NOT NULL, -- e.g., 'pre-thesis', 'final-thesis'
    title VARCHAR(255),
    abstract TEXT,
    document_url VARCHAR(255),
    status ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    submission_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Proposals Table
CREATE TABLE proposals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    details TEXT,
    status ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    submission_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Reports Table
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    details TEXT,
    status ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    submission_date DATE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
