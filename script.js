document.addEventListener('DOMContentLoaded', function() {
    const { jsPDF } = window.jspdf;
    const downloadBtn = document.getElementById('download-pdf');
    const form = document.getElementById('registration-form');
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted successfully!');
        // In a real application, you would send the form data to a server here
    });
    
    // PDF download handler
    downloadBtn.addEventListener('click', function() {
        // Temporarily hide the download button to exclude it from the PDF
        downloadBtn.style.visibility = 'hidden';
        
        const formElement = document.getElementById('form-to-pdf');
        const options = {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        };
        
        html2canvas(formElement, options).then(canvas => {
            // Show the button again
            downloadBtn.style.visibility = 'visible';
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190; // Reduced width for margins
            const pageHeight = 277; // A4 height in mm (297 - 10mm margins)
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            // Add header to PDF
            pdf.setFontSize(18);
            pdf.setTextColor(40, 40, 40);
            pdf.text('User Registration Form', 105, 15, { align: 'center' });
            
            // Add form content
            pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
            
            // Add footer
            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text('Generated on: ' + new Date().toLocaleString(), 105, 285, { align: 'center' });
            
            // Save the PDF
            pdf.save('user_registration_' + new Date().getTime() + '.pdf');
        });
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
