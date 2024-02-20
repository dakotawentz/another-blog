const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (response.ok) {
          document.location.replace('/');
        } else {
          throw new Error('Failed to log in');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Failed to log in. Please try again.');
      }
    } else {
      alert('Please enter both email and password');
    }
  };
  
const signupFormHandler = async (event) => {
    event.preventDefault();

    const firstName = document.querySelector("#signup-first-name").value.trim();
    const lastName = document.querySelector("#signup-last-name").value.trim();
    const email = document.querySelector("#email-signup").value.trim();
    const password = document.querySelector("#password-signup").value.trim();

    if (firstName && lastName && email && password) {
        try {
        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({ firstName, lastName, email, password }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            throw new Error(response.statusText);
        }
        } catch (error) {
        console.error('Signup error:', error);
        alert('Failed to sign up. Please try again.');
        }
    } else {
        alert('Please fill out all fields');
    }
  };
  
  document.querySelector('.login-form').addEventListener('submit', loginFormHandler);
  document.querySelector(".signup-form").addEventListener("submit", signupFormHandler);
  