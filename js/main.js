(function(){
  'use strict';
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const duration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--duration'));

  const inviteForm = $('#inviteForm');
  const invitee = $('#invitee');
  const leftBell = $('#left-bell');
  const rightBell = $('#right-bell');
  const andRight = $('.and-right');
  const andLeft = $('.and-left');
  const horizontal = $$('.horizontal');
  const btnPath = $('#btnPath');
  const reserved = $('#reserved');
  const seats = ['Brandon Stark'];

  const tl = new TimelineMax({
    repeat: -1,
    yoyo: true
  });
  tl
  .fromTo([leftBell, rightBell], duration, {
    rotation: 15,
    transformOrigin: '50% 5%'
  }, {
    rotation: -15,
    transformOrigin: '50% 5%'
  }, 'aj')
  .to(horizontal[0], duration, {
    x: -30
  }, 'aj')
  .to(horizontal[1], duration, {
    x: 30
  }, 'aj')
  .to(andLeft, duration, {
    x: 20
  }, 'aj')
  .to(andRight, duration, {
    x: -20
  }, 'aj');

  inviteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inviteName = invitee.value;
    btnPath.classList.toggle('animate-button');
    const drawTime = setTimeout(() => {
      btnPath.classList.toggle('animate-button')
      invitee.value = '';
      if(inviteName) {
        seats.push(inviteName);
        render(reserved, seats);
      }
    }, 2000);
  });

  function render(parent, children) {
    parent.innerHTML = children.join(', ');
  }
}());

