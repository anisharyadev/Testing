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
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 40;
        const lineHeight = 24;
        let yPosition = margin;
        
        // Get all form values
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Get radio button and checkbox values
        const gender = document.querySelector('input[name="gender"]:checked');
        const agreedToTerms = document.getElementById('terms').checked;
        const securityQuestion = document.getElementById('security-question').selectedOptions[0].text;

        // Add header with background
        pdf.setFillColor(33, 150, 243); // Blue background
        pdf.rect(0, 0, pageWidth, 80, 'F');
        
        // Add title
        pdf.setFontSize(24);
        pdf.setTextColor(255, 255, 255); // White text
        pdf.text('User Registration', pageWidth / 2, 50, { align: 'center' });
        
        // Add decorative element
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(2);
        pdf.line(pageWidth / 2 - 60, 60, pageWidth / 2 + 60, 60);
        
        yPosition = 100;

        // Add user details section
        pdf.setFontSize(16);
        pdf.setTextColor(33, 150, 243); // Blue text
        pdf.text('User Details', margin, yPosition);
        yPosition += lineHeight;
        
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50); // Dark gray text
        
        // Create two column layout
        const column1 = margin;
        const column2 = pageWidth / 2 + 20;
        
        // Column 1
        pdf.text(`Full Name: ${data['full-name'] || 'Not provided'}`, column1, yPosition);
        pdf.text(`Username: ${data['username'] || 'Not provided'}`, column1, yPosition + lineHeight);
        pdf.text(`Unique ID: ${data['unique-id'] || 'Not provided'}`, column1, yPosition + lineHeight * 2);
        
        // Column 2
        pdf.text(`Email: ${data['email'] || 'Not provided'}`, column2, yPosition);
        pdf.text(`Phone: ${data['phone'] || 'Not provided'}`, column2, yPosition + lineHeight);
        pdf.text(`Date of Birth: ${data['birthdate'] || 'Not provided'}`, column2, yPosition + lineHeight * 2);
        
        yPosition += lineHeight * 4;

        // Add divider
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10);
        
        // Add security section
        pdf.setFontSize(16);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Security Information', margin, yPosition);
        yPosition += lineHeight;
        
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        
        pdf.text(`Security Question: ${securityQuestion || 'Not selected'}`, column1, yPosition);
        pdf.text(`Security Answer: ${data['security-answer'] || 'Not provided'}`, column1, yPosition + lineHeight);
        pdf.text(`Password: ********`, column2, yPosition);
        pdf.text(`Terms Accepted: ${agreedToTerms ? '✓ Yes' : '✗ No'}`, column2, yPosition + lineHeight);
        
        yPosition += lineHeight * 3;

        // Add divider
        pdf.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10);
        
        // Add additional information
        pdf.setFontSize(16);
        pdf.setTextColor(33, 150, 243);
        pdf.text('Additional Information', margin, yPosition);
        yPosition += lineHeight;
        
        pdf.setFontSize(12);
        pdf.setTextColor(50, 50, 50);
        
        pdf.text(`Gender: ${gender ? gender.value.charAt(0).toUpperCase() + gender.value.slice(1) : 'Not specified'}`, column1, yPosition);
        
        // Handle multi-line address
        const addressLines = pdf.splitTextToSize(`Address: ${data['address'] || 'Not provided'}`, pageWidth - margin * 2);
        pdf.text(addressLines, column1, yPosition + lineHeight);
        
        // Add footer
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Document ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`, margin, 800);
        pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth - margin, 800, { align: 'right' });
        
        // Add watermark
        pdf.setFontSize(60);
        pdf.setTextColor(230, 230, 230);
        pdf.setGState(new pdf.GState({ opacity: 0.2 }));
        pdf.text('CONFIDENTIAL', pageWidth / 2, 450, { angle: 45, align: 'center' });
        pdf.setGState(new pdf.GState({ opacity: 1 }));
        
        // Save the PDF
        const fileName = `Registration_${data['username'] || 'User'}_${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}.pdf`;
        pdf.save(fileName);
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
