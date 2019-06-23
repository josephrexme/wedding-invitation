import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { TimelineMax } from 'gsap/TweenMax';
import axios from 'axios';
import visitormap from './visitormap';

const ButtonDraw = keyframes`
  0% {
    stroke-dashoffset: 182.023;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const DrawBottom = keyframes`
  0% {
    stroke-dashoffset: 682.237;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;
const DrawTop = keyframes`
  0% {
    stroke-dashoffset: 172.409;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;
const DrawTopBottom = keyframes`
  0% {
    stroke-dashoffset: 205.338;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;
const DrawWiggleTop = keyframes`
  0% {
    stroke-dashoffset: 313.633;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const AnimatedPath = styled.path`
  stroke: var(--rose-gold);
  &.bottom-left, &.bottom-right {
    stroke-dasharray: 682.237;
    animation: ${DrawBottom} var(--duration) ease-in-out 0s infinite alternate;
  }

  &.bottomRight, &.bottomLeft {
    stroke-dasharray: 205.338;
    animation: ${DrawTopBottom} var(--duration) ease-in-out 0s infinite alternate;
  }

  &.w-right, &.w-left {
    stroke-dasharray: 313.633;
    animation: ${DrawWiggleTop} var(--duration) ease-in-out 0s infinite alternate;
  }

  &.topRight, &.topLeft {
    stroke-dasharray: 172.409;
    animation: ${DrawTop} var(--duration) ease-in-out 0s infinite alternate;
  }
`;

const Container = styled.div`
  width: 98%;
  max-width: 900px;
  margin: 10px auto;
  padding: 20px;
  border: solid medium #8f4752;
  background: #fff;
  @media (max-width: 480px) {
    padding: 4px;
  }
`;

const GroupA = styled.section`
  .top, .bottom, .invitation, .couple{
    position: absolute;
    left: 0;
    right: 0;
  }
  .top{
    top: 8%;
    > :last-child{
      display: none;
    }
  }
  .couple{
    top: 31.5%;
  }
  @media (max-width: 960px) {
    .couple {
      top: 30%;
    }
  }
  .invitation {
    bottom: 21%;
  }
  .bottom {
    bottom: 2.5%;
    text-transform: uppercase;
  }
  @media (max-width: 850px) {
    .top{
      top: 6%;
    }
    .couple{
      top: 34%;
    }
  }
  @media (max-width: 800px) {
    .couple{
      top: 33%;
    }
  }
  @media (max-width: 760px) {
    .couple{
      top: 32%;
    }
    .top{
      > :last-child{
        display: inline-block;
      }
      > :first-child{
        display: none;
      }
    }
    .and-right, .and-left, .and-box{
      display: none;
    }
  }
  @media(max-width: 600px) {
    #ribbon{
      display: none;
    }
  }
  @media (max-width: 540px) {
    .invitation{
      bottom: 15%;
    }
    .top{
      top: 4%;
    }
    .bottom{
      bottom: 2%;
      font-size: 14px;
    }
    #invitee-box{
      display: none;
    }
  }
  @media (max-width: 480px) {
    .couple{
      top: 25%;
    }
  }
`;
const GroupB = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 430px;
  margin-top: -100px;
  padding: 20px 10px 10px;
  .pillar {
    position: absolute;
    top: 0;
    left: 0;
    width: 130px;
  }
  .pillar:last-of-type {
    left: auto;
    right: 0;
  }
  .event-time {
    position: absolute;
    bottom: 3%;
    left: 10px;
    text-align: left;
  }
  .event-time:last-of-type {
    left: auto;
    right: 10px;
    text-align: right;
  }
  @media (max-width: 700px) {
    .pillar{
      display: none;
    }
  }
  @media (max-width: 700px) {
    ${({empty}) => empty && css`
      height: 250px;
    `}
  }
`;
const GroupC = styled.section`
  > h4{
    position: absolute;
    bottom: 4%;
    left: -4px;
    right: 0;
  }
  @media (max-width: 600px) {
    .direction-line-right, .direction-line-left, .direction-box{
      display: none;
    }
  }
`;
const GroupD = styled.section`
  h3{
    position: absolute;
    left: 0;
    right: 0;
  }
  h3:first-of-type {
    top: 15%;
  }
  h3:last-of-type {
    bottom: 0;
  }
  @media (max-width: 540px) {
    h3:first-of-type {
      top: 10%;
    }
    h3:last-of-type {
      bottom: -3%;
    }
  }
`;

const Venue = styled.div`
  display: block;
  position: absolute;
  top: -70px;
  left: 0;
  right: 0;
  svg{
    width: 30%;
    max-width: 300px;
  }
`;

const BtnPath = styled.path`
  stroke: none;
  ${({ active }) => active && css`
    stroke: #9c4e5a;
    stroke-dasharray: 182.023;
    animation: ${ButtonDraw} var(--duration) ease-in-out;
  `}
`;

const { pathname } = window.location;
const visitorId = pathname.length === 1 ?
  undefined : visitormap[pathname.substring(1)];
axios.defaults.baseURL = HOST;
axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const invitationMap = {
  1: 'YOU MAY INVITE 1 MORE PERSON. ENTER THEIR NAME',
  2: 'YOU MAY INVITE 2 MORE PEOPLE. ENTER EACH OF THEIR NAMES',
  3: 'YOU MAY INVITE 3 MORE PEOPLE. ENTER EACH OF THEIR NAMES',
};

function Page() {
  const leftBell = useRef();
  const rightBell = useRef();
  const horizontalA = useRef();
  const horizontalB = useRef();
  const andLeft = useRef();
  const andRight = useRef();
  const invitee = useRef();
  const [btnClicked, setBtnClicked] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState({});
  const [inviteCount, setInviteCount] = useState(0);
  const [reservations, setReservations] = useState([]);

  const getVisitor = async (id) => {
    const visitor = await axios.get(`/attendees/${id}`);
    const { fields } = visitor.data;
    setVisitorInfo(fields);
    setInviteCount(fields.invites);
    if(fields.rsvps) {
      setReservations([fields.name, ...fields.rsvps.split(', ')]);
    } else {
      setReservations([fields.name]);
    }
  };

  const addGuest = async (id, newGuests) => {
    const visitor = await axios.patch(`/attendees/${id}`, {
      fields: {
        rsvps: newGuests.slice(1).join(', '),
        invites: visitorInfo.invites - 1,
      }
    });
    setInviteCount(visitorInfo.invites - 1);
    setVisitorInfo(visitor.data.fields);
  };

  useEffect(() => {
    // animations
    const duration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--duration'));
    const tl = new TimelineMax({ repeat: -1, yoyo: true });
    tl
    .fromTo([leftBell.current, rightBell.current], duration, {
      rotation: 15,
      transformOrigin: '50% 5%'
    }, {
      rotation: -15,
      transformOrigin: '50% 5%'
    }, 'aj')
    .to(horizontalA.current, duration, {
      x: -30
    }, 'aj')
    .to(horizontalB.current, duration, {
      x: 30
    }, 'aj')
    .to(andLeft.current, duration, {
      x: 20
    }, 'aj')
    .to(andRight.current, duration, {
      x: -20
    }, 'aj');
    // request
    if(visitorId) {
      getVisitor(visitorId);
    } else {
      setVisitorInfo({ name: 'Dr. Strange' });
      setReservations(['Captain Rogers', 'Tony Stark']);
    }
  }, []);

  const formSubmit = (e) => {
    e.preventDefault();
    const inviteName = invitee.current.value;
    if(inviteName) {
      setBtnClicked(true);
      const removeClick = setTimeout(() => {
        const newReservations = [...reservations, inviteName];
        addGuest(visitorId, newReservations);
        setReservations(newReservations);
        setBtnClicked(false);
      }, 2000);
    }
  };

  return (
    <Container>
      <GroupA>
        <h3 className="top black text"><span>SEPTEMBER 1 2019</span><span>9.1.19</span></h3>
        <h4 className="invitation text">INVITE YOU</h4>
        <h3 className="bottom text">{visitorInfo.name}</h3>
        <div className="couple">
          <h1 className="black text">Amanda</h1>
          <h4 className="text">AND</h4>
          <h1 className="black text">Joseph</h1>
        </div>
        <svg viewBox="0 0 488 293" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#000">
        <path d="m246.26 3.591-3.096-3.091-3.094 3.098 3.097 3.091z"/>
        <path d="m177.681 13.189v4.431h-6.385s-3.71.517-4.019 3.412c-.308 2.896 0 21.878 0 21.878s.791 4.447 4.019 4.473c3.229.027 144.331 0 144.331 0s3.676-.826 3.766-4.211 0-21.599 0-21.599-1.257-3.739-3.632-3.739h-6.465v-4.698"/>
        <path d="m113.553 32.565 5.738 5.738h29.202l14.726 14.726h159.198l14.715-14.715h29.439l5.749-5.749"/>
        <path d="m128.468 38.303v25.348l5.668-3.773 5.13 3.769-.03-25.271"/>
        <path d="m346.98 38.303v25.348l5.668-3.773 5.131 3.769-.03-25.271"/>
        <path d="m121.696 5.287 4.734-4.429h85.328l-7.529 7.528h-103.293v-3.099h106.393"/>
        <path d="m162.894 32.565v-19.376h16.983l4.802-4.803h-26.765l.003 24.179"/>
        <path d="m167.14 32.565h-84.666l-6.223-6.223h81.663"/>
        <path d="m85.383 26.342v-2.084h-4.234s-2.049-.04-2.884-2.483c-1.27.04-2.014 0-2.014 0v4.567"/>
        <path d="m152.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m147.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m142.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m137.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m133.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m128.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m123.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m118.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m114.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m109.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m105.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m101.779 8.386-.156 9.059c-.184 3.357-.199 7.47-6.797 8.897"/>
        <path d="m365.313 5.287-4.734-4.429h-85.328l7.529 7.528h103.293v-3.099h-106.393"/>
        <path d="m324.114 32.565v-19.376h-16.982l-4.803-4.803h26.766l-.004 24.179"/>
        <path d="m319.869 32.565h84.665l6.224-6.223h-81.663"/>
        <path d="m401.57 26.342v-2.084h4.234s2.048-.04 2.883-2.483c1.27.04 2.014 0 2.014 0v4.567"/>
        <path d="m334.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m339.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m344.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m349.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m353.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m358.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m363.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m368.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m372.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m377.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m381.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m385.23 8.386.156 9.059c.184 3.357.199 7.47 6.797 8.897"/>
        <path d="m486.106 108.841h-33.573v-2.646h33.995v62.735h-66.505v-5.393"/>
        <path d="m486.528 163.517h-85.24l-5.29-5.29h90.53"/>
        <path d="m486.528 139.817h-67.37v-2.254h67.37"/>
        <path d="m486.528 132.454h-54.616l-5.451-5.451h60.067"/>
        <path d="m486.528 168.93v33.455l-8.225 10.576.045-36.445h-43.559l-7.585-7.586"/>
        <path d="m478.313 212.961-8.785 11.825-.037-29.732s.236-6.933-6.358-6.978c-4.971-.034-20.949 0-20.949 0v-11.391"/>
        <path d="m456.866 188.061v44.836l-5.605-4.297-5.175 4.044v-44.593"/>
        <path d="m486.528 106.195v-4.815h-17.226l-4.816 4.815"/>
        <path d="m456.494 132.454v5.109"/>
        <path d="m480.887 109.069v10.313s.388 7.475-6.282 7.621"/>
        <path d="m475.887 109.069v10.313s.388 7.475-6.282 7.621"/>
        <path d="m470.887 109.069v10.313s.388 7.475-6.282 7.621"/>
        <path d="m465.887 109.069v10.313s.388 7.475-6.282 7.621"/>
        <path d="m460.887 109.069v10.313s.388 7.475-6.282 7.621"/>
        <path d="m456.887 109.069v10.313s.388 7.475-6.282 7.621"/>
        <path d="m452.887 109.069v10.313s.388 7.475-6.282 7.621"/>
        <path d="m481.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m476.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m471.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m466.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m461.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m457.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m452.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m447.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m442.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m437.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m433.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m428.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m423.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m419.635 140.269v10.313s.388 7.475-6.282 7.621"/>
        <path d="m.923 108.841h33.572v-2.646h-33.995v62.735h66.505v-5.393"/>
        <path d="m.5 163.517h85.24l5.29-5.29h-90.53"/>
        <path d="m.5 139.817h67.37v-2.254h-67.37"/>
        <path d="m.5 132.454h54.617l5.45-5.451h-60.067"/>
        <path d="m.5 168.93v33.455l8.225 10.576-.045-36.445h43.559l7.585-7.586"/>
        <path d="m8.715 212.961 8.785 11.825.037-29.732s-.236-6.933 6.358-6.978c4.972-.034 20.949 0 20.949 0v-11.391"/>
        <path d="m30.162 188.061v44.836l5.605-4.297 5.175 4.044v-44.593"/>
        <path d="m.5 106.195v-4.815h17.226l4.816 4.815"/>
        <path d="m30.534 132.454v5.109"/>
        <path d="m6.141 109.069v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m11.141 109.069v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m16.141 109.069v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m21.141 109.069v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m26.141 109.069v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m30.141 109.069v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m34.141 109.069v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m5.393 140.269v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m10.393 140.269v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m15.393 140.269v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m20.393 140.269v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m25.393 140.269v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m29.393 140.269v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m34.393 140.269v10.313s-.388 7.475 6.282 7.621"/><path d="m39.393 140.269v10.313s-.388 7.475 6.282 7.621"/><path d="m44.393 140.269v10.313s-.388 7.475 6.282 7.621"/><path d="m49.393 140.269v10.313s-.388 7.475 6.282 7.621"/><path d="m53.393 140.269v10.313s-.388 7.475 6.282 7.621"/><path d="m58.393 140.269v10.313s-.388 7.475 6.282 7.621"/><path d="m63.393 140.269v10.313s-.388 7.475 6.282 7.621"/><path d="m67.393 140.269v10.313s-.388 7.475 6.282 7.621"/>
        <path d="m142.189 275.683 27.052-16.305 146.352-.302 28.551 16.607-27.772 13.934h-147.782z" id="invitee-box"/>
        <path d="m23.023 259h16.883v16.335h-16.883z"/><path d="m5.667 226.718v65.315h64.26l-8.505-8.505h-48.02v-49.205z"/><path d="m446.081 259h16.883v16.335h-16.883z"/><path d="m479.985 226.718v65.315h-64.26l8.505-8.505h48.02v-49.205z"/>
        <g className="and-right" ref={andRight}>
        <AnimatedPath d="m355.608 143.802h-84"/>
        <AnimatedPath d="m361.597 143.799-2.996-3.092-2.993 3.099 2.996 3.091z"/>
        </g>
        <g className="and-left" ref={andLeft}>
        <AnimatedPath d="m131.315 143.802h84"/>
        <AnimatedPath d="m125.325 143.799 2.996-3.092 2.994 3.099-2.997 3.091z"/>
        </g>
        <path d="m215.029 143.678 10.111-11.127h35.991l10.477 11.127-9.701 11.375h-35.907z" className="and-box" fill="#fff"/>
        <g id="ribbon">
          <path d="m196.577 211.25h93.18v19.784h-93.18z"/>
          <path d="m289.757 214.016h8.131l12.209.071-13.903 7.055 13.903 7.055-12.209.07h-8.131z"/>
          <path d="m196.577 214.016h-8.131l-12.209.071 13.902 7.055-13.902 7.055 12.209.07h8.131z"/>
        </g>
        <AnimatedPath d="m462.192 188.384v60.993h-8.479v17.541h-16.703v8.64h-92.866" className="bottomRight"/>
        <AnimatedPath d="m24.142 188.267v61.11h8.479v17.541h16.703v8.64h92.865" className="bottomLeft"/>
        <AnimatedPath d="m76.251 24.059h-70.322v-8.029h8.706v85.35" className="topLeft"/>
        <AnimatedPath d="m101.779 16.03h-46.912s-6.836.048-6.836 5.514v32.843c.319 4.68 12.656 6.684 13.378-2.969.439-5.865-4.721-6.654-6.891-6.735-3.289-.124-29.615-.38-29.615-.38-5.298.075-7.199-11.872 1.957-12.872 7.147-.78 7.254 3.868 7.455 6.396l.053 26.982c.393 6.391 11.667 9.061 13.37 1.696 1.191-5.148-1.4-7.511-5.008-7.8h-32.711s-4.09-.284-4.09 5.523v37.152" className="w-left"/>
        <AnimatedPath d="m411.456 24.059h70.323v-8.029h-8.707v85.35" className="topRight"/>
        <AnimatedPath d="m385.929 16.03h46.911s6.837.048 6.837 5.514v32.843c-.319 4.68-12.656 6.684-13.379-2.969-.439-5.865 4.721-6.654 6.892-6.735 3.288-.124 29.615-.38 29.615-.38 5.298.075 7.199-11.872-1.957-12.872-7.148-.78-7.254 3.868-7.455 6.396l-.053 26.982c-.394 6.391-11.667 9.061-13.37 1.696-1.191-5.148 1.4-7.511 5.008-7.8h32.711s4.09-.284 4.09 5.523v37.152" className="w-right"/>
          </g>
        </svg>
      </GroupA>
      <GroupB empty={!inviteCount}>
        {
          inviteCount ? (
            <>
            <h3 className="text">{invitationMap[inviteCount]}</h3>
            <form onSubmit={formSubmit}>
              <label htmlFor="">
                <input type="text" placeholder="e.g Arya Stark" ref={invitee} />
                <svg viewBox="0 0 201 8" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#000"><path d="m194.5 3.595h-187.417"/><path d="m200.49 3.591-2.997-3.091-2.993 3.098 2.996 3.091z"/><path d="m6.49 3.591-2.997-3.091-2.993 3.098 2.996 3.091z"/></g></svg>
              </label>
              <button>
                <span>ADD INVITE</span>
                <svg viewBox="0 0 85 21" xmlns="http://www.w3.org/2000/svg"><path d="m.5 11.129 11.227-10.436 60.741-.193 11.849 10.629-11.526 8.919h-61.334l-10.957-8.919z" fill="none" stroke="#000"/></svg>
                <em><svg viewBox="0 0 85 21" xmlns="http://www.w3.org/2000/svg">
                <BtnPath active={btnClicked} d="m.5 11.129 11.227-10.436 60.741-.193 11.849 10.629-11.526 8.919h-61.334l-10.957-8.919z" fill="none"/></svg></em>
              </button>
            </form>
            </>
          ) : null
        }
        <h4 className="text">SEATS RESERVED FOR:</h4>
        <p className="auto text" id="reserved">{reservations.join(', ')}</p>
        <div className="event-time">
          <p className="text">CEREMONY</p>
          <h4 className="text">3:00PM</h4>
        </div>
        <div className="event-time">
          <p className="text">RECEPTION</p>
          <h4 className="text">5:00PM</h4>
        </div>
      <svg viewBox="0 0 76 249" xmlns="http://www.w3.org/2000/svg" className="pillar">
      <g fill="none" stroke="#000">
      <g className="horizontal" ref={horizontalA}>
      <path d="m68.876 241.733h-68.376"/>
      <path d="m75.066 241.73-3.097-3.092-3.093 3.099 3.096 3.091z"/>
      </g>
      <path d="m.5.5v247.594h16.85l6.361-6.361" className="vertical"/>
      </g></svg>
      <svg viewBox="0 0 76 249" xmlns="http://www.w3.org/2000/svg" className="pillar">
      <g fill="none" stroke="#000">
      <g className="horizontal" ref={horizontalB}>
      <path d="m6.689 241.733h68.377"/>
      <path d="m.5 241.73 3.096-3.092 3.093 3.099-3.096 3.091z"/>
      </g>
      <path d="m75.066.5v247.594h-16.85l-6.361-6.361" className="vertical"/>
      </g>
      </svg>
      </GroupB>
      <GroupC>
        <h4 className="text"><a href="https://goo.gl/maps/nGC5Vd4PxEiYZdnNA" target="_blank" title="Directions from Milwaukee">GET DIRECTIONS</a></h4>
        <Venue>
          <svg viewBox="0 0 172 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#000"><path d="m.5 63.118h170.555"/><path d="m106.101 63.118v-56.249"/><path d="m65.486 63.118v-56.249"/><path d="m11.332 63.118v-29.814"/><path d="m160.255 63.118v-29.814"/><path d="m126.409 63.118-.016-38.31"/><path d="m45.178 63.118-.015-38.343"/><path d="m61.405 2.863h48.745v4.006h-48.745z"/><path d="m126.393 29.299h35.844v4.006h-35.844z"/><path d="m126.409 26.936h37.225v2.363h-37.225z"/><path d="m9.329 29.299h35.844v4.006h-35.844z"/><path d="m7.932 26.936h37.225v2.363h-37.225z"/><path d="m44.018 21.292 21.468-10.42-.046 4.171-21.343 9.991z"/><path d="m41.984 19.429 23.465-11.62-.004 3.063-23.374 11.406z"/><path d="m127.57 21.292-21.469-10.42.046 4.171 21.343 9.991z"/><path d="m129.604 19.429-23.465-11.62.003 3.063 23.374 11.406z"/><path d="m58.8.5h54.16v2.363h-54.16z"/><path d="m147.792 41.478-.021-3.347h4.458v6.924h-4.417l-.02-3.577h4.437"/><path d="m147.792 52.308-.021-3.346h4.458v6.924h-4.417l-.02-3.578h4.437"/><path d="m32.716 41.478-.022-3.347h4.458v6.924h-4.417l-.019-3.577h4.436"/><path d="m32.716 52.308-.022-3.346h4.458v6.924h-4.417l-.019-3.578h4.436"/><path d="m134.253 41.478-.021-3.347h4.458v6.924h-4.417l-.02-3.577h4.437"/><path d="m134.253 52.308-.021-3.346h4.458v6.924h-4.417l-.02-3.578h4.437"/><path d="m19.177 41.478-.021-3.347h4.458v6.924h-4.417l-.02-3.577h4.437"/><path d="m19.177 52.308-.021-3.346h4.458v6.924h-4.417l-.02-3.578h4.437"/><path d="m70.882 21.78v-9.653h29.554v13.16h-29.503l-.051-3.507h29.554"/><path d="m93.423 12.127v9.653"/><path d="m85.977 12.127v9.653"/><path d="m78.531 12.127v9.653"/><path d="m70.882 39.379v-9.653h29.554v13.161h-29.503l-.051-3.508h29.554"/><path d="m93.423 29.726v9.653"/><path d="m85.977 29.726v9.653"/><path d="m78.531 29.726v9.653"/><path d="m108.471 36.397v-9.653h15.191v13.16h-15.165l-.026-3.507h15.191"/><path d="m118.704 26.744v9.653"/><path d="m113.522 26.744v9.653"/><path d="m108.471 53.32v-9.653h15.191v13.16h-15.165l-.026-3.507h15.191"/><path d="m118.704 43.667v9.653"/><path d="m113.522 43.667v9.653"/><path d="m47.549 36.397v-9.653h15.19v13.16h-15.164l-.026-3.507h15.19"/><path d="m57.781 26.744v9.653"/><path d="m52.6 26.744v9.653"/><path d="m47.549 53.32v-9.653h15.19v13.16h-15.164l-.026-3.507h15.19"/><path d="m57.781 43.667v9.653"/><path d="m52.6 43.667v9.653"/><path d="m70.882 63.118v-16.182l29.554.084v16.098"/><path d="m77.167 63.118v-12.156l16.984.064v12.092"/><path d="m77.167 53.518h16.984"/><path d="m85.659 50.962v2.556"/><path d="m98.228 47.155h2.208v2.233h-2.208z"/><path d="m70.882 47.155h2.208v2.233h-2.208z"/></g></svg>
          <h3 className="text">DECATUR CONFERENCE CENTER</h3>
          <p className="auto text">4191, W US Hwy 36, Decatur, IL 62522</p>
          <p className="auto invert">Coming from Milwaukee? Use link below for less tolls</p>
        </Venue>
        <svg viewBox="0 0 490 124" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#000"><path d="m22.464 5.162-4.662-4.662h-17.302v30.782h55.16l5.477-5.477h-60.637"/><path d="m.5 5.201h34.121v2.675h-34.121"/><path d="m48.711 31.282v5.77h-48.211v-5.77"/><path d="m41.659 37.052-7.038 7.037h-25.198v65.719h-8.923v-72.756"/><path d="m9.423 109.808h8.353v-48.247s-.199-5.973 5.435-5.973h8.115v-11.443"/><path d="m6.161 7.876v10.208s.017 7.592 5.765 7.634"/><path d="m11.161 7.876v10.208s.017 7.592 5.765 7.634"/><path d="m16.161 7.876v10.208s.017 7.592 5.765 7.634"/><path d="m20.161 7.876v10.208s.017 7.592 5.765 7.634"/><path d="m25.161 7.876v10.208s.017 7.592 5.765 7.634"/><path d="m30.161 7.876v10.208s.017 7.592 5.765 7.634"/><path d="m34.161 7.876v10.208s.017 7.592 5.765 7.634"/><path d="m467.173 5.162 4.661-4.662h17.303v30.782h-55.16l-5.477-5.477h60.637"/><path d="m489.137 5.201h-34.122v2.675h34.122"/><path d="m440.926 31.282v5.77h48.211v-5.77"/><path d="m447.978 37.052 7.037 7.037h25.199v65.719h8.923v-72.756"/><path d="m480.214 109.808h-8.353v-48.247s.198-5.973-5.435-5.973h-8.115v-11.443"/><path d="m483.476 7.876v10.208s-.017 7.592-5.765 7.634"/><path d="m478.476 7.876v10.208s-.017 7.592-5.765 7.634"/><path d="m473.476 7.876v10.208s-.017 7.592-5.765 7.634"/><path d="m469.476 7.876v10.208s-.017 7.592-5.765 7.634"/><path d="m464.476 7.876v10.208s-.017 7.592-5.765 7.634"/><path d="m459.476 7.876v10.208s-.017 7.592-5.765 7.634"/><path d="m455.476 7.876v10.208s-.017 7.592-5.765 7.634"/>
        <path d="m179.936 110.395 17.004-14.307 91.996-.265 17.946 14.572-17.457 12.225h-92.894z" className="direction-box"/>
        <path d="m472.152 109.808h-165.27" className="direction-line-right"/>
        <path d="m179.936 109.808h-163.444" className="direction-line-left"/>
        </g></svg>
      </GroupC>
      <GroupD>
        <h3 className="black text">PLEASE REPLY BY JULY 30TH<br />TO 414-204-2202</h3>
        <h3 className="black text">THANK YOU</h3>
        <svg viewBox="0 0 490 151" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="#000">
          <g id="left-bell" ref={leftBell}>
          <path d="m54.447 36.228s8.744 4.272 20.28.061c-.718-.771-2.924.006-4.546-10.593-.532-4.917-8.431-7.808-11.012-.515-2.207 8.6-2.029 9.844-4.722 11.047z"/>
          <path d="m63.985 20.773-.233-12.267 1.426-.003.326 12.27"/>
          <path d="m62.024 38.145s1.903 3.756 4.466 0"/>
          </g>
          <g id="right-bell" ref={rightBell}>
          <path d="m414.447 36.228s8.744 4.272 20.28.061c-.718-.771-2.924.006-4.546-10.593-.532-4.917-8.431-7.808-11.012-.515-2.207 8.6-2.029 9.844-4.722 11.047z"/>
          <path d="m423.985 20.773-.233-12.267 1.426-.003.326 12.27"/>
          <path d="m422.024 38.145s1.903 3.756 4.466 0"/>
          </g>
          <AnimatedPath d="m379.739 121.053h23.774l6.017 6.017h72.586v8.021h-8.357v-86.014h-8.658s8.308-33.741-23.55-48.577c7.022.263 21.836 0 21.836 0v8.448h16.816v17.016h8.705v22.919h-7.062v38.15s-.463 6.212-5.463 6.212h-30.413c-1.064-.077-6.917-.417-6.031-7.129.637-6.14 6.485-6.352 7.042-6.3 0 0 6.414-.076 6.502 5.738.088 5.813-.063 28.399-.063 28.399-.064 2.954 1.662 6.166 6.448 6.244 5.112.084 7.416-4.181 7.125-6.425-.225-1.741-.366-6.193-6.152-6.949-6.133-.081-28.509-.066-28.509-.066-1.745.241-6.22-1.224-5.67-7.051.589-6.248 5.498-6.493 6.903-6.448 0 0 6.368.227 6.394 6.119.026 5.893 0 41.193 0 41.193s.339 7.44-6.872 7.484c-7.211.045-25.239.02-25.239.02" className="bottom-right"/>
          <AnimatedPath d="m109.605 121.053h-23.496l-6.017 6.017h-72.586v8.021h8.357v-86.014h8.658s-8.308-33.741 23.55-48.577c-7.022.263-21.836 0-21.836 0v8.448h-16.815v17.016h-8.706v22.919h7.063v38.15s.462 6.212 5.462 6.212h30.414c1.064-.077 6.916-.417 6.03-7.129-.637-6.14-6.484-6.352-7.042-6.3 0 0-6.414-.076-6.502 5.738-.088 5.813.063 28.399.063 28.399.064 2.954-1.661 6.166-6.447 6.244-5.113.084-7.417-4.181-7.126-6.425.225-1.741.366-6.193 6.152-6.949 6.133-.081 28.51-.066 28.51-.066 1.744.241 6.219-1.224 5.669-7.051-.589-6.248-5.497-6.493-6.903-6.448 0 0-6.368.227-6.394 6.119-.026 5.893 0 41.193 0 41.193s-.338 7.44 6.873 7.484c7.21.045 24.992 0 24.992 0" className="bottom-left"/>
          <circle cx="64.587" cy="38.736" r="38.236"/>
          <circle cx="64.587" cy="38.736" r="34"/>
          <circle cx="64.587" cy="38.736" r="30.233"/><circle cx="424.587" cy="38.736" r="38.236"/><circle cx="424.587" cy="38.736" r="34"/><circle cx="424.587" cy="38.736" r="30.233"/><path d="m471.651.572h16.883v16.335h-16.883z"/>
          <path d="m.5.572h16.883v16.335h-16.883z"/>
          <path d="m302.921 125.984 4.609 4.609h16.663v19.381h4.995v-23.99"/>
          <path d="m310.186 130.593v4.639h5.869c3.228.075 4.456.946 4.439 5.449-.018 4.761 0 9.293 0 9.293h3.813"/>
          <path d="m334.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m339.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m344.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m349.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m354.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m358.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m363.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m368.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m373.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m377.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m382.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m386.722 125.984v9.223s-.291 8.992 6.743 8.992"/>
          <path d="m329.188 144.199h82.228l-5.775 5.775h-76.453"/>
          <path d="m186.416 125.984-4.609 4.609h-16.663v19.381h-4.995v-23.99"/>
          <path d="m179.151 130.593v4.639h-5.869c-3.228.075-4.456.946-4.439 5.449.018 4.761 0 9.293 0 9.293h-3.813"/>
          <path d="m154.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m149.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m144.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m139.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m134.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m130.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m125.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m120.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m115.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m111.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m106.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m102.615 125.984v9.223s.291 8.992-6.743 8.992"/>
          <path d="m160.149 144.199h-82.228l5.775 5.775h76.453"/>
          <path d="m101.97 125.984v-2.59h284.986v2.439z"/>
          <path d="m107.478 123.394 4.682-4.682h264.871l4.683 4.682"/>
          <circle cx="132.786" cy="91.093" r="24.452"/>
          <circle cx="132.786" cy="91.093" r="18.892"/>
          <circle cx="132.786" cy="91.093" r="12.747"/>
          <circle cx="132.786" cy="91.093" r="3.788"/>
          <path d="m134.914 94.225 10.882 24.487h4.631z"/>
          <path d="m130.197 94.225-10.882 24.487h-4.631z"/>
          <path d="m146.264 68.299h3.609v3.609h-3.609z"/>
          <path d="m155.982 80.838h3.609v3.609h-3.609z"/>
          <path d="m156.433 96.03h3.609v3.609h-3.609z"/>
          <path d="m148.678 109.286h3.609v3.609h-3.609z"/>
          <path d="m115.433 68.299h3.609v3.609h-3.609z"/>
          <path d="m105.714 80.838h3.609v3.609h-3.609z"/>
          <path d="m105.264 96.03h3.609v3.609h-3.609z"/>
          <path d="m112.051 108.964h3.609v3.609h-3.609z"/>
          <path d="m130.462 62.686h3.609v3.609h-3.609z"/>
          <path d="m370.066 115.143h-100.942v3.599h100.647z"/>
          <path d="m270.791 115.143-5.774-20.134s5.416-8.636 51.995 1.37c46.578 10.005 57.454 2.206 57.454 2.206l-5.967 16.558"/>
          <path d="m370.481 98.585c.101-.084-8.389 16.558-8.389 16.558"/>
          <path d="m362.958 98.585-13.659 16.558"/>
          <path d="m350.413 98.594-11.978 16.549"/>
          <path d="m332.673 96.485-9.224 18.658"/>
          <path d="m318.303 94.643-8.853 20.5"/>
          <path d="m304.681 91.79-6.568 23.353"/>
          <path d="m292.13 89.776-4.452 25.367"/>
          <path d="m279.813 88.995-.903 26.148"/>
          <path d="m269.124 89.462 4.281 25.681"/>
          <path d="m264.212 91.79 6.579 23.353"/>
          <path d="m267.044 102.075s4.281-8.425 49.529 0 55.701 2.549 55.701 2.549"/>
          <path d="m269.431 108.442s4.066-8.424 47.046 0c42.98 8.425 52.908 2.549 52.908 2.549"/>
          <path d="m208.751 91.486h48.167c1.082-.712-21.119 11.5-24.084 22.879-2.838-11.347-23.932-23.091-24.083-22.879z"/>
          <path d="m222.262 118.742.706-2.812h19.279l1.16 2.812"/>
          <path d="m232.854 82.696-.02 36.046"/>
          <path d="m237.95 115.93-2.588-6.35"/>
          <path d="m227.302 115.93 2.588-6.35"/>
          <path d="m189.555 95.889 6.955-12.533"/>
          <path d="m182.851 95.889-6.955-12.533"/>
          <path d="m182.851 103.044-6.955 15.073"/>
          <path d="m189.873 103.044 6.955 15.073"/>
          <path d="m186.275 94.805c2.833 0 4.596 2.141 4.596 4.749 0 2.607-1.589 4.532-4.423 4.532s-4.459-1.855-4.459-4.462c0-2.608 1.452-4.819 4.286-4.819z"/>
          <path d="m186.43 118.447v-41.559"/>
          <path d="m202.643 95.889-16.213 3.556-16.214-3.277"/>
        </g></svg>
      </GroupD>
    </Container>
  );
}

export default Page;
