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
        // Create a new PDF document with custom properties
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4',
            filters: ['ASCIIHexEncode']
        });

        // Document dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 50;
        const contentWidth = pageWidth - margin * 2;
        let yPosition = margin;

        // Get all form values
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Get additional form values
        const gender = document.querySelector('input[name="gender"]:checked');
        const agreedToTerms = document.getElementById('terms').checked;
        const securityQuestion = document.getElementById('security-question').selectedOptions[0].text;

        // Add premium header with gradient
        const gradient = pdf.context.createLinearGradient(0, 0, pageWidth, 0);
        gradient.addColorStop(0, '#4b6cb7');
        gradient.addColorStop(1, '#182848');
        pdf.setFillColor(gradient);
        pdf.rect(0, 0, pageWidth, 120, 'F');

        // Add logo placeholder (replace with actual logo if available)
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);
        pdf.text('YOUR LOGO', margin, 40);

        // Add title with subtle shadow
        pdf.setFontSize(28);
        pdf.setTextColor(255, 255, 255);
        pdf.text('USER REGISTRATION', pageWidth / 2, 80, { align: 'center' });

        // Add decorative elements
        pdf.setDrawColor(255, 255, 255, 0.3);
        pdf.setLineWidth(1);
        pdf.line(margin, 100, pageWidth - margin, 100);

        yPosition = 150;

        // Add user details card
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, yPosition, contentWidth, 180, 5, 5, 'F');
        pdf.setDrawColor(230, 230, 230);
        pdf.roundedRect(margin, yPosition, contentWidth, 180, 5, 5, 'S');

        // Card title
        pdf.setFontSize(16);
        pdf.setTextColor(70, 130, 180);
        pdf.text('PERSONAL INFORMATION', margin + 20, yPosition + 30);

        // Two column layout
        const column1 = margin + 30;
        const column2 = pageWidth / 2 + 10;
        const lineHeight = 25;
        let cardY = yPosition + 60;

        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);

        // Column 1
        pdf.text(`• Full Name: ${data['full-name'] || 'Not provided'}`, column1, cardY);
        pdf.text(`• Username: ${data['username'] || 'Not provided'}`, column1, cardY + lineHeight);
        pdf.text(`• Unique ID: ${data['unique-id'] || 'Not provided'}`, column1, cardY + lineHeight * 2);

        // Column 2
        pdf.text(`• Email: ${data['email'] || 'Not provided'}`, column2, cardY);
        pdf.text(`• Phone: ${data['phone'] || 'Not provided'}`, column2, cardY + lineHeight);
        pdf.text(`• Date of Birth: ${data['birthdate'] || 'Not provided'}`, column2, cardY + lineHeight * 2);

        yPosition += 220;

        // Add security information card
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, yPosition, contentWidth, 150, 5, 5, 'F');
        pdf.setDrawColor(230, 230, 230);
        pdf.roundedRect(margin, yPosition, contentWidth, 150, 5, 5, 'S');

        // Card title
        pdf.setFontSize(16);
        pdf.setTextColor(70, 130, 180);
        pdf.text('SECURITY INFORMATION', margin + 20, yPosition + 30);

        cardY = yPosition + 60;
        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);

        pdf.text(`• Security Question: ${securityQuestion || 'Not selected'}`, column1, cardY);
        pdf.text(`• Security Answer: ${data['security-answer'] || 'Not provided'}`, column1, cardY + lineHeight);
        pdf.text(`• Password: ${'•'.repeat(8)}`, column2, cardY);
        pdf.text(`• Terms Accepted: ${agreedToTerms ? '✓ Yes' : '✗ No'}`, column2, cardY + lineHeight);

        yPosition += 180;

        // Add additional information card
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, yPosition, contentWidth, 120, 5, 5, 'F');
        pdf.setDrawColor(230, 230, 230);
        pdf.roundedRect(margin, yPosition, contentWidth, 120, 5, 5, 'S');

        // Card title
        pdf.setFontSize(16);
        pdf.setTextColor(70, 130, 180);
        pdf.text('ADDITIONAL DETAILS', margin + 20, yPosition + 30);

        cardY = yPosition + 60;
        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);

        pdf.text(`• Gender: ${gender ? gender.value.charAt(0).toUpperCase() + gender.value.slice(1) : 'Not specified'}`, column1, cardY);

        // Handle multi-line address with bullet point
        const addressText = `• Address: ${data['address'] || 'Not provided'}`;
        const addressLines = pdf.splitTextToSize(addressText, contentWidth - 60);
        pdf.text(addressLines, column1, cardY + lineHeight);

        // Add footer with gradient
        pdf.setFillColor(gradient);
        pdf.rect(0, pageHeight - 60, pageWidth, 60, 'F');

        // Footer text
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255, 0.8);
        pdf.text(`Document ID: #${Math.random().toString(36).substring(2, 10).toUpperCase()}`, margin, pageHeight - 35);
        pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, pageWidth - margin, pageHeight - 35, { align: 'right' });

        // Add subtle watermark
        pdf.setFontSize(48);
        pdf.setTextColor(230, 230, 230, 0.1);
        pdf.setGState(new pdf.GState({ opacity: 0.1 }));
        pdf.text('CONFIDENTIAL', pageWidth / 2, pageHeight / 2, { 
            angle: 45, 
            align: 'center' 
        });

        // Save the PDF with professional filename
        const fileName = `User_Registration_${data['username'] || 'Document'}_${new Date().toISOString().slice(0, 10)}.pdf`;
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
