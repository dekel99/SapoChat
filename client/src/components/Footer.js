import React from 'react';
import '../styles/footer.css';

export default function Footer() {
  
  // Get current year **
  const curentYear= new Date().getFullYear() 
  
  return (
    <div>
      <footer className="footer">
      <p>All rights recieved ©{curentYear}</p>
      </footer>
    </div>
  );
}

