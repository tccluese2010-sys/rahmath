// PAGE INTERACTIONS
window.addEventListener('load', function(){
  setTimeout(function(){
    document.getElementById('loader').classList.add('gone');
  }, 1200);
});

var nav = document.getElementById('navbar');
window.addEventListener('scroll', function(){
  nav.classList.toggle('scrolled', window.scrollY > 60);
  var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('progress').style.width = pct + '%';
  document.getElementById('heroBg').style.transform = 'translateY(' + (window.scrollY * 0.35) + 'px)';
  document.querySelectorAll('.reveal').forEach(function(el){
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}, {passive: true});
window.dispatchEvent(new Event('scroll'));

function toggleMobile(){
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

function openLb(i){
  var lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.add('open');
}

function closeLb(){
  var lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('open');
}

document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') closeLb();
});

var cur = 0;
var total = 3;
function goSlide(n){
  cur = n;
  var track = document.getElementById('testiTrack');
  if (track) track.style.transform = 'translateX(-' + (n * 100) + '%)';
  document.querySelectorAll('.testi-dot').forEach(function(d,i){
    d.classList.toggle('active', i === n);
  });
}

function nextSlide(){
  goSlide((cur + 1) % total);
}

function prevSlide(){
  goSlide((cur - 1 + total) % total);
}

setInterval(nextSlide, 5000);
