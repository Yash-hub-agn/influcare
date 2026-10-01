const fs = require('fs');

const css = `
/* ============================================================
   11. CONTACT MODAL
   ============================================================ */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; opacity: 0; visibility: hidden; transition: opacity 0.3s, visibility 0.3s;
}
.modal-overlay.active { opacity: 1; visibility: visible; }

.modal-content {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 24px; padding: 3rem 2rem; width: 90%; max-width: 500px;
  position: relative; transform: translateY(20px); transition: transform 0.3s;
}
.modal-overlay.active .modal-content { transform: translateY(0); }

.modal-close {
  position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none;
  color: var(--text-muted); font-size: 2rem; cursor: pointer; transition: color 0.2s; line-height: 1;
}
.modal-close:hover { color: var(--text-main); }

.modal-header h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
.modal-header p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem; }

.contact-form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.form-group input, .form-group textarea {
  background: var(--card); border: 1px solid var(--border); color: var(--text-main);
  padding: 1rem; border-radius: 12px; font-family: var(--body); font-size: 1rem;
  transition: border-color 0.2s, background 0.2s;
}
.form-group input:focus, .form-group textarea:focus {
  outline: none; border-color: var(--accent); background: var(--card-hover);
}
.form-group textarea { resize: vertical; min-height: 100px; }

.success-message {
  display: none; padding: 2rem; text-align: center;
  background: rgba(168, 85, 247, 0.1); border: 1px solid var(--accent);
  border-radius: 16px; color: var(--text-main);
}
.success-message h3 { margin-bottom: 0.5rem; color: var(--accent); }
`;
fs.appendFileSync('style.css', css);

const modalHTML = `
  <!-- Contact Modal -->
  <div class="modal-overlay" id="contactModal">
    <div class="modal-content">
      <button class="modal-close" id="closeModal">&times;</button>
      <div id="formContainer">
        <div class="modal-header">
          <h2>Contact Us</h2>
          <p>Fill out the form below and we'll get back to you shortly.</p>
        </div>
        <form id="contactForm" class="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" required placeholder="+91 98765 43210">
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" required placeholder="Tell us about your brand..."></textarea>
          </div>
          <button type="submit" class="btn-primary" style="margin-top: 1rem; width: 100%;">Submit Request</button>
        </form>
      </div>
      <div id="successMessage" class="success-message">
        <h3>Thank You!</h3>
        <p>Your request has been submitted successfully. We will reach out to you soon.</p>
      </div>
    </div>
  </div>
`;

const scriptJS = `
      // Contact Modal Logic
      const modal = document.getElementById('contactModal');
      const closeBtn = document.getElementById('closeModal');
      const contactForm = document.getElementById('contactForm');
      const formContainer = document.getElementById('formContainer');
      const successMessage = document.getElementById('successMessage');
      
      const contactLinks = document.querySelectorAll('a[href="#contact-modal"], a[href="mailto:hello@influcare.com"]');
      contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          modal.classList.add('active');
          // Reset form state if reopened
          formContainer.style.display = 'block';
          successMessage.style.display = 'none';
          contactForm.reset();
        });
      });

      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Show success
        formContainer.style.display = 'none';
        successMessage.style.display = 'block';
      });
`;

const files = ['index.html', 'services.html', 'privacy.html', 'termsandcondition.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/mailto:hello@influcare.com/g, '#contact-modal');
  content = content.replace(/href="#"/g, 'href="/"'); 
  
  if (file === 'index.html') {
    // Inject modal before </body>
    content = content.replace('</body>', modalHTML + '\n</body>');
    // Inject JS into existing script tag
    content = content.replace('// Set current year', scriptJS + '\n      // Set current year');
  } else {
    // Inject modal and a new script tag before </body>
    const newBodyEnd = modalHTML + '\n  <script>\n    document.addEventListener("DOMContentLoaded", () => {\n' + scriptJS + '\n      // Set current year\n      const yearEl = document.getElementById("year");\n      if (yearEl) yearEl.textContent = new Date().getFullYear();\n    });\n  </script>\n</body>';
    content = content.replace('</body>', newBodyEnd);
  }
  
  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});
