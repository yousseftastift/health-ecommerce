
// Contact page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
});

function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Validate form
        const errors = validateContactForm(data);
        
        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            return;
        }
        
        // Simulate form submission
        submitContactForm(data);
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            const errorElement = document.getElementById(`${this.name}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                this.classList.remove('error');
            }
        });
    });
}

function validateContactForm(data) {
    const errors = {};
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }
    
    // Email validation
    if (!data.email || !validateEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional but if provided, must be valid)
    if (data.phone && !validatePhone(data.phone)) {
        errors.phone = 'Please enter a valid phone number';
    }
    
    // Subject validation
    if (!data.subject) {
        errors.subject = 'Please select a subject';
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }
    
    return errors;
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    let error = '';
    
    switch (fieldName) {
        case 'name':
            if (!value || value.trim().length < 2) {
                error = 'Name must be at least 2 characters long';
            }
            break;
            
        case 'email':
            if (!value || !validateEmail(value)) {
                error = 'Please enter a valid email address';
            }
            break;
            
        case 'phone':
            if (value && !validatePhone(value)) {
                error = 'Please enter a valid phone number';
            }
            break;
            
        case 'subject':
            if (!value) {
                error = 'Please select a subject';
            }
            break;
            
        case 'message':
            if (!value || value.trim().length < 10) {
                error = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    if (errorElement) {
        errorElement.textContent = error;
        field.classList.toggle('error', !!error);
    }
    
    return !error;
}

function displayErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const fieldElement = document.querySelector(`[name="${fieldName}"]`);
        
        if (errorElement) {
            errorElement.textContent = errors[fieldName];
        }
        
        if (fieldElement) {
            fieldElement.classList.add('error');
        }
    });
    
    // Scroll to first error
    const firstError = document.querySelector('.error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const fieldElements = document.querySelectorAll('.error');
    fieldElements.forEach(element => {
        element.classList.remove('error');
    });
}

function submitContactForm(data) {
    // Show loading state
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showContactSuccess();
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Log form data (in real app, this would be sent to server)
        console.log('Contact form submitted:', data);
        
    }, 2000);
}

function showContactSuccess() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message fade-in';
    successDiv.innerHTML = `
        <h3>Thank you for your message!</h3>
        <p>We'll get back to you within 24 hours.</p>
    `;
    
    // Insert after form
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Character counter for message field
document.addEventListener('input', function(e) {
    if (e.target.name === 'message') {
        const maxLength = 500;
        const currentLength = e.target.value.length;
        
        let counterElement = document.getElementById('message-counter');
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.id = 'message-counter';
            counterElement.style.cssText = `
                font-size: 0.875rem;
                color: #666;
                margin-top: 0.25rem;
                text-align: right;
            `;
            e.target.parentNode.appendChild(counterElement);
        }
        
        counterElement.textContent = `${currentLength}/${maxLength}`;
        counterElement.style.color = currentLength > maxLength ? 'var(--error-color)' : '#666';
    }
});

// Add CSS for error styling
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--error-color);
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .success-message {
        background: linear-gradient(135deg, var(--success-color), #20c997);
        color: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        margin: 2rem 0;
        text-align: center;
        box-shadow: var(--shadow-lg);
    }
    
    .success-message h3 {
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }
`;
document.head.appendChild(style);
