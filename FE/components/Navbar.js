import React from "react";
import Image from "next/image";
import Logo from "../public/logo.png";

function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <Image class="logo" src={Logo} alt="vote24" />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                공지사항
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                이벤트
              </a>
            </li>
          </ul>
          <div class="d-flex">
            <a class="nav-link" href="#">
              <button type="button" class="btn btn-primary">
                로그인
              </button>
            </a>
            <a class="nav-link" href="#">
              <button type="button" class="btn btn-primary">
                서비스 신청
              </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
