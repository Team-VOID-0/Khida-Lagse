import React from 'react';
import { Link } from 'react-router-dom'
import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn
} from 'mdb-react-ui-kit';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css'

export default function App() {
  return (
    <MDBFooter className='text-center' id='footer' color='white' style={{backgroundColor:"#323232"}}>

      <hr />
      
      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-3 brand-logo'>
                <MDBIcon icon="gem" className="me-3" />
                <span style={{color:"tomato"}}>Khida</span> Lagse
              </h6>
              {/* <div className="footer-logo mb-3"><img src={logo_side} alt="" /></div> */}
              <p className='footer-description'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
              </p>

              <div className="footer-social">
                <a href="https://www.facebook.com" className="footer-icon"><FaFacebookF /></a>
                <a href="https://www.facebook.com" className="footer-icon"><FaTwitter /></a>
                <a href="https://www.facebook.com" className="footer-icon"><FaLinkedinIn /></a>
              </div>

              
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='#!' className='footer-link'>
                  Angular
                </a>
              </p>
              <p>
                <a href='#!' className='footer-link'>
                  React
                </a>
              </p>
              <p>
                <a href='#!' className='footer-link'>
                  Vue
                </a>
              </p>
              <p>
                <a href='#!' className='footer-link'>
                  Laravel
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='#home' className='footer-link'>
                  Home
                </a>
              </p>
              <p>
                <a href='#menu' className='footer-link'>
                  Menu
                </a>
              </p>
              <p>
                <a href='#order' className='footer-link'>
                  Orders
                </a>
              </p>
              <p>
                <a href='#faq' className='footer-link'>
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Get In Touch</h6>
              <p className='footer-link'>
                <MDBIcon icon="home" className="me-2" /> Kaliakoir, Gazipur
              </p>
              <p>
                <Link className='footer-link' to={"mailto:2001009@iot.bdu.ac.bd"}>
                  <MDBIcon icon="envelope" className="me-3" />
                  khida-lagse@gmail.com
                </Link>
              </p>
              <p>
                <Link className='footer-link' to={"tel:+8801798709761"}>
                  <MDBIcon icon="phone" className="me-3" />
                  +880 1798709761
                </Link>
              </p>
              <p>
                <Link className='footer-link' to={"tel:+8801798709761"}>
                  <MDBIcon icon="print" className="me-3" />
                  +880 1640050330
                </Link>
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <hr style={{margin:"0"}}/>

      <div className='text-center p-4 copyright'>
        Copyright 2024 © khida-lagse.com - All Rights Reserved.
      </div>
    </MDBFooter>
  );
}