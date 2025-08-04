document.addEventListener('DOMContentLoaded', function() {
    // Load jsPDF from CDN dynamically if not already available
    if (!window.jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = initializePDFGenerator;
        document.head.appendChild(script);
    } else {
        initializePDFGenerator();
    }

    function initializePDFGenerator() {
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
            // Show loading state
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Generating PDF...';

            try {
                // Create a new PDF document
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: 'a4'
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
                const securityQuestion = document.getElementById('security-question').selectedOptions[0]?.text || 'Not selected';

                // Add header with gradient
                pdf.setFillColor(75, 108, 183); // #4b6cb7
                pdf.rect(0, 0, pageWidth, 100, 'F');

                // Add title
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(24);
                pdf.setTextColor(255, 255, 255);
                pdf.text('User Registration', pageWidth / 2, 60, { align: 'center' });

                yPosition = 120;

                // Add user details section
                createSectionCard(pdf, margin, yPosition, contentWidth, 160, 'Personal Information');
                yPosition += 30;

                // Two column layout
                const column1 = margin + 30;
                const column2 = pageWidth / 2 + 10;
                const lineHeight = 22;

                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(12);
                pdf.setTextColor(60, 60, 60);

                // Column 1
                pdf.text(`• Full Name: ${data['full-name'] || 'Not provided'}`, column1, yPosition);
                pdf.text(`• Username: ${data['username'] || 'Not provided'}`, column1, yPosition + lineHeight);
                pdf.text(`• Unique ID: ${data['unique-id'] || 'Not provided'}`, column1, yPosition + lineHeight * 2);

                // Column 2
                pdf.text(`• Email: ${data['email'] || 'Not provided'}`, column2, yPosition);
                pdf.text(`• Phone: ${data['phone'] || 'Not provided'}`, column2, yPosition + lineHeight);
                pdf.text(`• Date of Birth: ${data['birthdate'] || 'Not provided'}`, column2, yPosition + lineHeight * 2);

                yPosition += 180;

                // Add security information section
                createSectionCard(pdf, margin, yPosition, contentWidth, 130, 'Security Information');
                yPosition += 30;

                pdf.text(`• Security Question: ${securityQuestion}`, column1, yPosition);
                pdf.text(`• Security Answer: ${data['security-answer'] || 'Not provided'}`, column1, yPosition + lineHeight);
                pdf.text(`• Password: ${'•'.repeat(8)}`, column2, yPosition);
                pdf.text(`• Terms Accepted: ${agreedToTerms ? '✓ Yes' : '✗ No'}`, column2, yPosition + lineHeight);

                yPosition += 150;

                // Add additional information section
                createSectionCard(pdf, margin, yPosition, contentWidth, 110, 'Additional Details');
                yPosition += 30;

                pdf.text(`• Gender: ${gender ? gender.value.charAt(0).toUpperCase() + gender.value.slice(1) : 'Not specified'}`, column1, yPosition);

                // Handle multi-line address
                const addressText = `• Address: ${data['address'] || 'Not provided'}`;
                const addressLines = pdf.splitTextToSize(addressText, contentWidth - 60);
                pdf.text(addressLines, column1, yPosition + lineHeight);

                // Add footer
                pdf.setFillColor(75, 108, 183); // #4b6cb7
                pdf.rect(0, pageHeight - 50, pageWidth, 50, 'F');

                // Footer text
                pdf.setFontSize(10);
                pdf.setTextColor(255, 255, 255);
                pdf.text(`Document generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 30, { align: 'center' });

                // Save the PDF
                const fileName = `User_Registration_${data['username'] || 'Document'}_${new Date().getTime()}.pdf`;
                pdf.save(fileName);

            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Failed to generate PDF. Please try again.');
            } finally {
                // Reset button state
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Download as PDF';
            }
        });

        // Helper function to create section cards
        function createSectionCard(pdf, x, y, width, height, title) {
            pdf.setFillColor(245, 245, 245);
            pdf.roundedRect(x, y - 20, width, height, 5, 5, 'F');
            pdf.setDrawColor(220, 220, 220);
            pdf.roundedRect(x, y - 20, width, height, 5, 5, 'S');
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(16);
            pdf.setTextColor(70, 130, 180);
            pdf.text(title, x + 20, y);
        }

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
    }
});
