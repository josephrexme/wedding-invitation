import React from 'react';
import { render } from 'react-dom';
import { Router } from '@reach/router';
import { createGlobalStyle } from 'styled-components';
import Page from './Page';

const root = document.getElementById('app');

const GlobalStyle = createGlobalStyle`
  :root {
    --duration: 2s;
    --text-color: hsl(333deg, 54%, 47%);
    --rose-gold: #b76e79;
    --grey: #999;
  }

  html{
    font-size: 62.5%;
  }

  .text {
    color: var(--rose-gold);
  }

  .black {
    font-family: arial-black, arial, sans-serif;
    font-weight: bold;
  }

  .invert {
    color: #888;
  }

  * {
    box-sizing: border-box;
  }

  path, rect, circle {
    stroke: var(--grey);
  }

  html {
    font-size: 62.5%;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 1.6rem;
    font-family: arial, sans-serif;
    background: linear-gradient(135deg, rgba(130, 65, 75, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%), url(https://res.cloudinary.com/strich/image/upload/v1560283401/IMG_0391_vd1rgj.jpg);
    background-size: cover;
    background-position: 40% top;
    background-repeat: no-repeat;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  section {
    position: relative;
    text-align: center;
  }

  h1 {
    margin: 2.5rem 0;
    font-size: 40px;
    text-transform: uppercase;
  }
  h1:first-of-type {
    margin-top: 0;
  }
  h1:last-of-type {
    margin-bottom: 0;
  }

  h3, h4 {
    margin: 1rem 0;
  }
  p{
    margin: .5rem 0;
    max-width: 70%;
  }
  .auto{
    margin-left: auto;
    margin-right: auto;
  }
  @media (max-width: 880px) {
    h1{
      font-size: 36px;
    }
    h4{
      font-size: 14px;
    }
  }
  @media (max-width: 850px) {
    h1{
      margin: 1.5rem 0;
      font-size: 28px;
    }
    h3{
      font-size: 16px;
    }
  }
  @media (max-width: 760px) {
    h3, h4{
      margin: .8rem 0;
    }
    h4{
      font-size: 12px;
    }
    h1{
      margin: .8rem 0;
      font-size: 24px;
    }
    p{
      font-size: 12px;
    }
  }
  @media (max-width: 650px) {
    h3{
      font-size: 12px;
    }
  }
  @media (max-width: 360px) {
    h1{
      margin: .5rem 0;
      font-size: 18px;
    }
    h3{
      font-size: 10px;
    }
    h4{
      margin: .5rem 0;
    }
  }

  form {
    margin: 0 0 10px;
  }

  label {
    display: block;
    position: relative;
    margin: 40px 0 10px;
  }
  label svg, label input {
    width: 100%;
    max-width: 300px;
  }
  label input {
    top: -24px;
    position: absolute;
    height: 30px;
    padding: 0 14px;
    border: 0;
    background: none;
    font: inherit;
    text-align: center;
    outline: none;
  }
  label input:focus + svg path {
    stroke: var(--rose-gold);
  }

  button {
    position: relative;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: none;
    border: 0;
    outline: none;
    cursor: pointer;
  }
  button svg {
    width: 150px;
    transition: -webkit-transform .5s ease-in-out;
    transition: transform .5s ease-in-out;
    transition: transform .5s ease-in-out, -webkit-transform .5s ease-in-out;
  }
  button span {
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    color: var(--grey);
    font-size: 1.6rem;
  }
  button em {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
  button:focus path {
    stroke: var(--rose-gold);
  }
  button:hover svg {
    -webkit-transform: scale(1.05);
            transform: scale(1.05);
  }
`;

render(
  <>
    <GlobalStyle />
    <Router>
      <Page path="/*" />
    </Router>
  </>
, root);
