// Main application script for Community Bridge Portal

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu'); // Will be added when implementing responsive menu
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            // This would toggle a mobile menu (implementation would require adding menu HTML)
            console.log('Mobile menu button clicked');
        });
    }

    // Form validation for report issue form
    const issueForm = document.getElementById('issueForm');
    if (issueForm) {
        issueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const issueType = document.getElementById('issueType').value;
            const description = document.getElementById('description').value;
            const severity = document.querySelector('input[name="severity"]:checked');
            const location = document.getElementById('location').value;

            if (!issueType || !description || !severity || !location) {
                alert('Please fill in all required fields');
                return;
            }

            // In a real app, this would send data to the backend
            console.log('Issue report submitted:', {
                issueType,
                description,
                severity: severity.value,
                location
            });

            alert('Thank you for reporting this issue! We will review it shortly.');
            issueForm.reset();
        });
    }

    // Volunteer form submission
    const volunteerForm = document.querySelector('#volunteer-form form');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation would go here
            console.log('Volunteer form submitted');
            alert('Thank you for your interest in volunteering! We will contact you soon.');
            volunteerForm.reset();
        });
    }

    // Login form submission
    const loginForm = document.querySelector('form[action="#"]');
    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }

            // In a real app, this would authenticate with the backend
            console.log('Login attempt with:', email);
            
            // For demo purposes, redirect to home page
            window.location.href = 'index.html';
        });
    }

    // Donation button handlers
    const donationButtons = document.querySelectorAll('button:contains("Donate")');
    donationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, this would open a payment modal
            console.log('Donation button clicked for:', 
                this.closest('.bg-white').querySelector('h3').textContent);
            alert('Thank you for your interest in donating! Payment processing would be implemented here.');
        });
    });

    // Volunteer signup buttons
    const volunteerSignupButtons = document.querySelectorAll('button:contains("Sign Up")');
    volunteerSignupButtons.forEach(button => {
        if (!button.closest('form')) { // Exclude form submission buttons
            button.addEventListener('click', function() {
                const eventTitle = this.closest('.bg-white').querySelector('h3').textContent;
                console.log('Signing up for:', eventTitle);
                alert(`You've signed up for "${eventTitle}". Details will be emailed to you.`);
            });
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Utility function to format dates (would be used in dynamic content)
function formatDate(dateString) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to initialize interactive elements on page load
function initInteractiveElements() {
    // Progress bar animations
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initInteractiveElements);