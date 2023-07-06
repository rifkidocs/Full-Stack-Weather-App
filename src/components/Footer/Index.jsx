import React from "react";

const Footer = () => {
  return (
    <footer className='footer footer-center p-4 bg-base-300 text-base-content'>
      <div>
        <p>
          Copyright © 2023 - All right reserved by{" "}
          <a
            className='cursor-pointer hover:underline'
            href='https://webifyaja.com'>
            Webifyaja
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
