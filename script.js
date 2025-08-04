document.addEventListener('DOMContentLoaded', function() {
    const { jsPDF } = window.jspdf;
    const downloadBtn = document.getElementById('download-pdf');
    const form = document.getElementById('registration-form');

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted successfully!');
    });

    // PDF download handler
    downloadBtn.addEventListener('click', function() {
        // Create a new PDF document
        const pdf = new jsPDF('p', 'pt', 'a4');
        
        // Add title
        pdf.setFontSize(20);
        pdf.setTextColor(33, 150, 243); // Blue color
        pdf.text('User Registration Details', 40, 40);
        
        // Add line under title
        pdf.setDrawColor(33, 150, 243);
        pdf.setLineWidth(1);
        pdf.line(40, 50, 550, 50);
        
        // Get all form values
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Set styles for the content
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0); // Black color
        
        // Add personal information section
        pdf.setFontSize(14);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Personal Information', 40, 80);
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        
        pdf.text(`Full Name: ${data['full-name'] || 'Not provided'}`, 40, 100);
        pdf.text(`Username: ${data['username'] || 'Not provided'}`, 40, 120);
        pdf.text(`Unique ID: ${data['unique-id'] || 'Not provided'}`, 40, 140);
        pdf.text(`Email: ${data['email'] || 'Not provided'}`, 40, 160);
        pdf.text(`Phone: ${data['phone'] || 'Not provided'}`, 40, 180);
        
        // Add account security section
        pdf.setFontSize(14);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Account Security', 40, 220);
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        
        pdf.text(`Password: ********`, 40, 240);
        pdf.text(`Security Question: ${document.getElementById('security-question').selectedOptions[0].text || 'Not selected'}`, 40, 260);
        pdf.text(`Security Answer: ${data['security-answer'] || 'Not provided'}`, 40, 280);
        
        // Add additional information section
        pdf.setFontSize(14);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Additional Information', 40, 320);
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        
        pdf.text(`Date of Birth: ${data['birthdate'] || 'Not provided'}`, 40, 340);
        
        // Get selected gender
        const gender = document.querySelector('input[name="gender"]:checked');
        pdf.text(`Gender: ${gender ? gender.value : 'Not specified'}`, 40, 360);
        
        pdf.text(`Address: ${data['address'] || 'Not provided'}`, 40, 380);
        
        // Add terms agreement
        const agreedToTerms = document.getElementById('terms').checked;
        pdf.text(`Terms Accepted: ${agreedToTerms ? 'Yes' : 'No'}`, 40, 420);
        
        // Add generation date
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, 40, 560);
        
        // Add page border
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.rect(20, 20, 555, 555);
        
        // Save the PDF
        pdf.save(`user_registration_${data['username'] || 'form'}_${new Date().getTime()}.pdf`);
    });

    // Password confirmation validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    
    function validatePassword() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords don't match");
        } else {
            confirmPassword.setCustomValidity('');
        }
    }
    
    password.onchange = validatePassword;
    confirmPassword.onkeyup = validatePassword;
});
