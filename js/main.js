// no. of projects shown before "See more" is clicked
var PROJECTS_VISIBLE = 3;

// no. of certificates shown before "See more" is clicked (counted across all cards)
var ACHIEVEMENTS_VISIBLE = 5;

// the project video preview stops after this many seconds
var VIDEO_PREVIEW_SECONDS = 10;

// words for the typing effect in the hero "I build..."
var typedWords = ['web pages.', 'databases.', 'network designs.', 'Java apps.', 'clean interfaces.'];

// the project filter that is picked right now
var currentFilter = 'All';

// added: true if the user turned off animations in their device settings
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// Escapes text so it is safe to place inside HTML
function escapeHtml(text) {
  var tempDiv = document.createElement('div');
  tempDiv.textContent = text;
  var safeText = tempDiv.innerHTML;
  return safeText;
}

// true if the visitor turned off animations in their device settings
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


// ---- TOAST (small message at the bottom, same idea as JACENT) ----

function showToast(message) {
  // remove the old toast first
  var existingToast = document.querySelector('.toast');
  if (existingToast !== null) {
    existingToast.remove();
  }

  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<i class="ri-checkbox-circle-line"></i> ' + escapeHtml(message);
  document.body.appendChild(toast);

  // two frames so the fade in can play
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });
  });

  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () {
      toast.remove();
    }, 400);
  }, 3000);
}


// ---- TECH STACK ----

function renderSkills(list, elementId) {
  var cardsHtml = '';

  for (var i = 0; i < list.length; i++) {
    var skill = list[i];

    cardsHtml = cardsHtml + '<div class="brand-card fade-in">';
    cardsHtml = cardsHtml +   '<div class="brand-card-icon"><i class="' + skill.icon + '"></i></div>';
    cardsHtml = cardsHtml +   '<h4>' + escapeHtml(skill.name) + '</h4>';
    cardsHtml = cardsHtml +   '<p>' + escapeHtml(skill.note) + '</p>';
    cardsHtml = cardsHtml + '</div>';
  }

  var container = document.getElementById(elementId);
  container.innerHTML = cardsHtml;
}

// ---- PROJECTS ----

function renderProjects() {
  var cardsHtml = '';

  for (var i = 0; i < projects.length; i++) {
    var project = projects[i];

    // Tech stack tags
    var tagsHtml = '';
    for (var j = 0; j < project.stack.length; j++) {
      tagsHtml = tagsHtml + '<span class="tag">' + escapeHtml(project.stack[j]) + '</span>';
    }

    var linksHtml = '';
    if (project.githubUrl) {
      linksHtml = '<a class="btn btn-blue-outline btn-sm project-github-link" href="' + escapeHtml(project.githubUrl) + '" target="_blank" rel="noopener noreferrer"><i class="ri-github-fill" aria-hidden="true"></i> GitHub</a>';
    } else {
      linksHtml = '<button class="btn btn-blue-outline btn-sm project-github-link" type="button" disabled title="Add a repository URL in js/data.js"><i class="ri-github-fill" aria-hidden="true"></i> GitHub</button>';
    }

    // cards after the first 3 are hidden until "See more" is clicked
    var extraClass = '';
    if (i >= PROJECTS_VISIBLE) {
      extraClass = ' extra';
    }

    // added: data-badge is used by the filter buttons
    cardsHtml = cardsHtml + '<article class="project-card fade-in' + extraClass + '" data-badge="' + escapeHtml(project.badge) + '">';
    cardsHtml = cardsHtml +   '<div class="project-image">';
    // projects with a demo video open the video in the modal, the others open the image
    var videoAttribute = '';
    var triggerKind = 'Project image';
    var triggerLabel = 'View ' + project.name + ' image';
    var playHtml = '';
    if (project.demoVideo) {
      videoAttribute = ' data-video="' + escapeHtml(project.demoVideo) + '"';
      triggerKind = 'Video demo';
      triggerLabel = 'Watch ' + project.name + ' video demo';
      playHtml = '<span class="project-play" aria-hidden="true"><i class="ri-play-circle-fill"></i></span>';
    }

    cardsHtml = cardsHtml +     '<button class="project-image-trigger' + (project.demoVideo ? ' has-video' : '') + '" type="button" data-image="' + escapeHtml(project.image) + '"' + videoAttribute + ' data-title="' + escapeHtml(project.name) + '" data-kind="' + triggerKind + '" aria-label="' + escapeHtml(triggerLabel) + '">';
    cardsHtml = cardsHtml +       '<img src="' + escapeHtml(project.image) + '" alt="">';
    cardsHtml = cardsHtml +       playHtml;
    cardsHtml = cardsHtml +     '</button>';
    cardsHtml = cardsHtml +     '<span class="project-badge">' + escapeHtml(project.badge) + '</span>';
    cardsHtml = cardsHtml +   '</div>';
    cardsHtml = cardsHtml +   '<div class="project-body">';
    cardsHtml = cardsHtml +     '<div class="project-type">' + escapeHtml(project.type) + '</div>';
    cardsHtml = cardsHtml +     '<h3 class="project-name">' + escapeHtml(project.name) + '</h3>';
    cardsHtml = cardsHtml +     '<p class="project-desc">' + escapeHtml(project.description) + '</p>';
    cardsHtml = cardsHtml +     '<p class="project-concept"><strong>Concept:</strong> ' + escapeHtml(project.concept) + '</p>';
    cardsHtml = cardsHtml +     '<div class="tags">' + tagsHtml + '</div>';
    cardsHtml = cardsHtml +     '<div class="project-links">' + linksHtml + '</div>';
    cardsHtml = cardsHtml +   '</div>';
    cardsHtml = cardsHtml + '</article>';
  }

  var grid = document.getElementById('projects-grid');
  grid.innerHTML = cardsHtml;
}


// ---- PROJECT FILTER (added) ----

function renderFilters() {
  var bar = document.getElementById('filter-bar');

  // collect each badge only once (Web appears two times in data.js)
  var badges = ['All'];
  for (var i = 0; i < projects.length; i++) {
    var alreadyAdded = false;
    for (var j = 0; j < badges.length; j++) {
      if (badges[j] === projects[i].badge) {
        alreadyAdded = true;
      }
    }
    if (alreadyAdded === false) {
      badges.push(projects[i].badge);
    }
  }

  var buttonsHtml = '';
  for (var k = 0; k < badges.length; k++) {
    var activeClass = '';
    if (badges[k] === 'All') {
      activeClass = ' active';
    }
    buttonsHtml = buttonsHtml + '<button class="filter-btn' + activeClass + '" type="button" data-filter="' + escapeHtml(badges[k]) + '">' + escapeHtml(badges[k]) + '</button>';
  }
  bar.innerHTML = buttonsHtml;

  var filterButtons = bar.querySelectorAll('.filter-btn');
  for (var m = 0; m < filterButtons.length; m++) {
    setupFilterButton(filterButtons[m]);
  }
}

function setupFilterButton(button) {
  button.addEventListener('click', function () {
    setProjectFilter(button.getAttribute('data-filter'));
  });
}

function setProjectFilter(badge) {
  currentFilter = badge;

  // highlight the picked button
  var filterButtons = document.querySelectorAll('.filter-btn');
  for (var i = 0; i < filterButtons.length; i++) {
    if (filterButtons[i].getAttribute('data-filter') === badge) {
      filterButtons[i].classList.add('active');
    } else {
      filterButtons[i].classList.remove('active');
    }
  }

  // show the cards that match, hide the rest
  var cards = document.querySelectorAll('.project-card');
  for (var j = 0; j < cards.length; j++) {
    var cardBadge = cards[j].getAttribute('data-badge');

    if (badge === 'All' || badge === cardBadge) {
      cards[j].classList.remove('hide');
      cards[j].classList.add('visible');

      // restart the pop animation
      cards[j].classList.remove('pop');
      void cards[j].offsetWidth;
      cards[j].classList.add('pop');
    } else {
      cards[j].classList.add('hide');
    }
  }

  // open the section so no matching card stays hidden
  if (badge !== 'All') {
    setSectionOpen('projects', true);
  }
}


// ---- ACHIEVEMENTS & CERTIFICATES ----

function renderAchievements() {
  var cardsHtml = '';

  // counts every certificate across all cards, so only the first few show before "See more"
  var shownSoFar = 0;

  for (var i = 0; i < achievements.length; i++) {
    var achievement = achievements[i];

    var itemsHtml = '';
    for (var j = 0; j < achievement.items.length; j++) {
      var item = achievement.items[j];
      var imageAttribute = item.image ? ' data-image="' + escapeHtml(item.image) + '"' : '';

      var itemExtra = '';
      if (shownSoFar >= ACHIEVEMENTS_VISIBLE) {
        itemExtra = ' class="extra"';
      }
      shownSoFar = shownSoFar + 1;

      itemsHtml = itemsHtml + '<li' + itemExtra + '>';
      itemsHtml = itemsHtml +   '<i class="ri-checkbox-circle-fill"></i>';
      itemsHtml = itemsHtml +   '<button class="ach-item" type="button" data-title="' + escapeHtml(item.title) + '" data-issuer="' + escapeHtml(achievement.issuer) + '"' + imageAttribute + '>';
      itemsHtml = itemsHtml +     escapeHtml(item.title);
      itemsHtml = itemsHtml +   '</button>';
      itemsHtml = itemsHtml + '</li>';
    }

    // a card whose certificates are all hidden is hidden too
    var cardExtra = '';
    if (shownSoFar - achievement.items.length >= ACHIEVEMENTS_VISIBLE) {
      cardExtra = ' extra';
    }

    cardsHtml = cardsHtml + '<div class="ach-card fade-in' + cardExtra + '">';
    cardsHtml = cardsHtml +   '<div class="ach-head">';
    cardsHtml = cardsHtml +     '<div class="ach-icon"><i class="' + achievement.icon + '"></i></div>';
    cardsHtml = cardsHtml +     '<div>';
    cardsHtml = cardsHtml +       '<div class="ach-kind">' + escapeHtml(achievement.kind) + '</div>';
    cardsHtml = cardsHtml +       '<h3>' + escapeHtml(achievement.issuer) + '</h3>';
    cardsHtml = cardsHtml +     '</div>';
    cardsHtml = cardsHtml +   '</div>';
    cardsHtml = cardsHtml +   '<ul class="ach-items">' + itemsHtml + '</ul>';
    cardsHtml = cardsHtml + '</div>';
  }

  var list = document.getElementById('achievements-list');
  list.innerHTML = cardsHtml;
}


// ---- IMAGE / VIDEO PREVIEW (a div that gets a "show" class, no <dialog>) ----

var lastClickedButton = null;

function openImageModal(imagePath, title, kind, videoPath) {
  var modal = document.getElementById('achievement-modal');
  var image = document.getElementById('achievement-modal-image');
  var video = document.getElementById('achievement-modal-video');
  var player = document.getElementById('achievement-video-player');
  var imageKind = document.getElementById('achievement-modal-kind');
  var imageTitle = document.getElementById('achievement-modal-title');
  var noteElement = document.getElementById('achievement-modal-note');

  if (videoPath) {
    // show the video demo instead of the image
    // (encodeURI because some file names have spaces)
    image.hidden = true;
    image.removeAttribute('src');
    player.hidden = false;
    video.poster = imagePath;
    noteElement.hidden = true;
    video.src = encodeURI(videoPath);
    video.load();

    // opened by a click, so the browser allows autoplay
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        // autoplay blocked: the user can press play
      });
    }
  } else {
    player.hidden = true;
    noteElement.hidden = true;
    image.hidden = false;
    image.src = imagePath;
    image.alt = title;
  }
  imageKind.textContent = kind;
  imageTitle.textContent = title;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  document.getElementById('achievement-modal-close').focus();
}

function closeImageModal() {
  var modal = document.getElementById('achievement-modal');
  var video = document.getElementById('achievement-modal-video');
  var player = document.getElementById('achievement-video-player');

  // stop the video and drop its source so it stops downloading
  video.pause();
  video.removeAttribute('src');
  video.removeAttribute('poster');
  video.load();
  player.hidden = true;

  modal.classList.remove('show');
  document.body.style.overflow = '';

  // give the focus back to the button that opened it
  if (lastClickedButton !== null) {
    lastClickedButton.focus();
  }
}

function setupImageButton(button) {
  button.addEventListener('click', function () {
    var imagePath = button.getAttribute('data-image');
    var title = button.getAttribute('data-title');
    var kind = button.getAttribute('data-kind') || 'Certificate';
    var videoPath = button.getAttribute('data-video');

    // some certificates may not have an image yet
    if (!imagePath) {
      showToast('No image added for this yet');
      return;
    }

    lastClickedButton = button;
    openImageModal(imagePath, title, kind, videoPath);
  });
}

// the video preview only plays the first VIDEO_PREVIEW_SECONDS seconds
// the browser's own controls show the full video time, so these controls are custom
function initVideoLimit() {
  var video = document.getElementById('achievement-modal-video');
  var noteElement = document.getElementById('achievement-modal-note');
  var playButton = document.getElementById('video-play');
  var muteButton = document.getElementById('video-mute');
  var progress = document.getElementById('video-progress');

  // length of the preview (a short video can end before the limit)
  function getLimit() {
    if (video.duration && video.duration < VIDEO_PREVIEW_SECONDS) {
      return video.duration;
    }
    return VIDEO_PREVIEW_SECONDS;
  }

  function updateProgress() {
    var percent = (video.currentTime / getLimit()) * 1000;
    if (percent > 1000) {
      percent = 1000;
    }
    progress.value = percent;
    progress.style.setProperty('--fill', (percent / 10) + '%');
  }

  // check the time on every frame so the stop is exact and the bar is smooth
  function watchTime() {
    updateProgress();

    if (video.currentTime >= getLimit()) {
      video.pause();
      noteElement.hidden = false;
      return;
    }

    if (video.paused === false) {
      requestAnimationFrame(watchTime);
    }
  }

  function setPlayIcon(isPlaying) {
    var icon = playButton.querySelector('i');
    if (isPlaying) {
      icon.className = 'ri-pause-fill';
      playButton.setAttribute('aria-label', 'Pause');
    } else {
      icon.className = 'ri-play-fill';
      playButton.setAttribute('aria-label', 'Play');
    }
  }

  video.addEventListener('play', function () {
    // pressing play after the preview ended starts over
    if (video.currentTime >= getLimit() - 0.1) {
      video.currentTime = 0;
    }
    noteElement.hidden = true;
    setPlayIcon(true);
    requestAnimationFrame(watchTime);
  });

  video.addEventListener('pause', function () {
    setPlayIcon(false);
  });

  video.addEventListener('ended', function () {
    updateProgress();
    noteElement.hidden = false;
  });

  // new video loaded: start the bar from zero
  video.addEventListener('loadstart', function () {
    progress.value = 0;
    progress.style.setProperty('--fill', '0%');
    setPlayIcon(false);
  });

  // play / pause with the button or by clicking the video
  function togglePlay() {
    if (video.paused) {
      video.play().catch(function () {});
    } else {
      video.pause();
    }
  }
  playButton.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  // drag the bar (only inside the preview length)
  progress.addEventListener('input', function () {
    video.currentTime = (progress.value / 1000) * getLimit();
    updateProgress();
  });

  // mute / unmute
  muteButton.addEventListener('click', function () {
    video.muted = !video.muted;
    var icon = muteButton.querySelector('i');
    if (video.muted) {
      icon.className = 'ri-volume-mute-fill';
      muteButton.setAttribute('aria-label', 'Unmute');
    } else {
      icon.className = 'ri-volume-up-fill';
      muteButton.setAttribute('aria-label', 'Mute');
    }
  });
}


function initImageModal() {
  var modal = document.getElementById('achievement-modal');
  var closeButton = document.getElementById('achievement-modal-close');
  var imageButtons = document.querySelectorAll('.ach-item, .project-image-trigger');

  for (var i = 0; i < imageButtons.length; i++) {
    setupImageButton(imageButtons[i]);
  }

  closeButton.addEventListener('click', closeImageModal);

  initVideoLimit();

  // click the dark area to close
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeImageModal();
    }
  });

  // Escape key closes it
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
      closeImageModal();
    }
  });
}


// ---- SEE MORE / SEE LESS ----

function setSectionOpen(sectionId, open) {
  var section = document.getElementById(sectionId);
  var button = section.querySelector('.see-more');
  var buttonText = button.querySelector('span');

  if (open) {
    section.classList.remove('collapsed');
    button.setAttribute('aria-expanded', 'true');
    buttonText.textContent = 'See less';
  } else {
    section.classList.add('collapsed');
    button.setAttribute('aria-expanded', 'false');
    buttonText.textContent = 'See more';
  }
}

function toggleSection(button) {
  var targetId = button.getAttribute('data-target');
  var section = document.getElementById(targetId);

  var isCollapsed = section.classList.contains('collapsed');

  if (isCollapsed) {
    setSectionOpen(targetId, true);
  } else {
    setSectionOpen(targetId, false);

    // going back to the short list, so clear the project filter too
    if (targetId === 'projects' && currentFilter !== 'All') {
      setProjectFilter('All');
    }
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function setupSeeMoreButton(button) {
  button.addEventListener('click', function () {
    toggleSection(button);
  });
}

function initSeeMore() {
  var buttons = document.querySelectorAll('.see-more');

  for (var i = 0; i < buttons.length; i++) {
    setupSeeMoreButton(buttons[i]);
  }
}


// ---- NAVIGATION ----

function initNavigation() {
  var navbar = document.getElementById('navbar');
  var menu = document.getElementById('nav-links');
  var toggleButton = document.getElementById('nav-toggle');
  var toTopButton = document.getElementById('to-top');
  var progressBar = document.getElementById('scroll-progress');
  var navLinks = menu.querySelectorAll('a');
  var sections = document.querySelectorAll('section[id]');
  var toggleIcon = toggleButton.querySelector('i');

  // Open / close the mobile menu
  toggleButton.addEventListener('click', function () {
    var menuIsOpen = menu.classList.contains('open');

    if (menuIsOpen) {
      menu.classList.remove('open');
      toggleIcon.className = 'ri-menu-line';
    } else {
      menu.classList.add('open');
      toggleIcon.className = 'ri-close-line';
    }
  });

  // Close the mobile menu after a link is clicked
  menu.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
      menu.classList.remove('open');
      toggleIcon.className = 'ri-menu-line';
    }
  });

  // Back to top
  toTopButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Runs while scrolling
  window.addEventListener('scroll', function () {
    var scrollPosition = window.scrollY;

    // added: progress bar at the very top
    var pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    var percent = 0;
    if (pageHeight > 0) {
      percent = (scrollPosition / pageHeight) * 100;
    }
    progressBar.style.width = percent + '%';

    // Navbar shadow
    if (scrollPosition > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top button
    if (scrollPosition > 400) {
      toTopButton.classList.add('show');
    } else {
      toTopButton.classList.remove('show');
    }

    // Find the section currently on screen
    var currentSectionId = '';
    for (var i = 0; i < sections.length; i++) {
      var sectionTop = sections[i].offsetTop - 120;

      if (scrollPosition >= sectionTop) {
        currentSectionId = sections[i].id;
      }
    }

    // Expertise belongs to the About link
    if (currentSectionId === 'expertise') {
      currentSectionId = 'about';
    }

    // Highlight the matching nav link
    for (var j = 0; j < navLinks.length; j++) {
      var linkTarget = navLinks[j].getAttribute('href');

      if (linkTarget === '#' + currentSectionId) {
        navLinks[j].classList.add('active');
      } else {
        navLinks[j].classList.remove('active');
      }
    }
  });
}


// ---- HERO: TYPING EFFECT (added) ----

function initTyping() {
  var typedText = document.getElementById('typed-text');
  if (typedText === null) return;

  // if animations are off, just show the first word
  if (reduceMotion) {
    typedText.textContent = typedWords[0];
    return;
  }

  var wordIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function typeNext() {
    var word = typedWords[wordIndex];
    var delay = 90;

    // add or remove one letter
    if (deleting) {
      charIndex = charIndex - 1;
      delay = 45;
    } else {
      charIndex = charIndex + 1;
    }

    typedText.textContent = word.substring(0, charIndex);

    if (deleting === false && charIndex === word.length) {
      // word is complete, wait a bit before deleting
      deleting = true;
      delay = 1500;
    } else if (deleting && charIndex === 0) {
      // word is gone, go to the next word
      deleting = false;
      wordIndex = wordIndex + 1;
      if (wordIndex >= typedWords.length) {
        wordIndex = 0;
      }
      delay = 400;
    }

    setTimeout(typeNext, delay);
  }

  // wait for the hero text to finish sliding in
  setTimeout(typeNext, 1200);
}


// ---- HERO: 3D NETWORK + SHOOTING STARS BACKGROUND ----
// a calm 3D version of a computer network:
//  - points float in 3D space and turn slowly. points that are far away
//    are small and faint, points that are close are bigger and brighter
//  - thin lines join points that are near each other, and a few data
//    packets travel along them
//  - the bigger "hubs" (HTML, SQL, DNS ...) have a label
//  - move the mouse: the scene tilts a little, close points are pulled
//    toward the pointer and connect to it with thin lines
//  - shooting stars cross the sky now and then. flick the mouse fast, or
//    click, to shoot your own.

function initHeroNetwork() {
  var hero = document.getElementById('home');
  var canvas = document.getElementById('hero-canvas');
  var content = document.querySelector('.hero-content');
  var ctx = canvas.getContext('2d');
  var points = [];
  var stars = [];
  var packets = [];
  var mouse = { x: -1000, y: -1000, lastX: -1000, lastY: -1000 };
  var zone = { left: 0, right: 0, top: 0, bottom: 0, active: false };
  var LINK_DISTANCE = 240;
  var POINTER_RADIUS = 170;
  var fieldRadius = 560;
  var camera = 1120;
  var angle = 0;
  var tiltSide = 0;
  var tiltUp = 0;
  var time = 0;
  var frame = 0;
  var lastFlick = 0;

  // not needed if the visitor turned off animations
  if (prefersReducedMotion()) {
    return;
  }

  // the area of the title + buttons. points behind it are made fainter
  // so the text is easy to read (only on wide screens)
  function updateZone() {
    if (canvas.width < 900) {
      zone.active = false;
      return;
    }

    var box = content.getBoundingClientRect();
    var heroBox = canvas.getBoundingClientRect();
    var width = Math.min(box.width, 820);
    var centerX = box.left - heroBox.left + box.width / 2;

    zone.left = centerX - width / 2;
    zone.right = centerX + width / 2;
    zone.top = box.top - heroBox.top - 20;
    zone.bottom = box.bottom - heroBox.top + 20;
    zone.active = true;
  }

  function isInZone(x, y) {
    return zone.active && x > zone.left && x < zone.right && y > zone.top && y < zone.bottom;
  }

  function setupNet() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    points = [];
    stars = [];
    packets = [];
    updateZone();

    // smaller 3D space on phones
    if (canvas.width < 700) {
      fieldRadius = 380;
    } else {
      fieldRadius = 560;
    }
    camera = fieldRadius * 2;

    // not too many points, so it stays calm
    var amount = Math.floor(canvas.width / 15);
    if (amount > 85) {
      amount = 85;
    }
    if (amount < 30) {
      amount = 30;
    }

    // the first few points are hubs (they get a label from heroTags)
    var hubTotal = Math.min(heroTags.length, 8);

    for (var i = 0; i < amount; i++) {
      // points are spread inside a round space, so turning it looks even
      var distance = Math.sqrt(Math.random()) * fieldRadius;
      var around = Math.random() * Math.PI * 2;
      var isHub = (i < hubTotal);
      var tag = '';

      if (isHub) {
        tag = heroTags[i];
      }

      points.push({
        x: Math.cos(around) * distance,
        y: (Math.random() - 0.5) * canvas.height * 1.2,
        z: Math.sin(around) * distance,
        hub: isHub,
        tag: tag,
        phase: Math.random(),
        flash: 0,
        sx: 0, sy: 0,
        rx: 0, ry: 0, rz: 0,
        scale: 1,
        depth: 0,
        near: 0
      });
    }
  }

  // turns every point and works out where it is on the screen.
  // depth: 0 = far away (small, faint), 1 = very close (big, bright)
  function turnPoints() {
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var cosSide = Math.cos(angle + tiltSide);
    var sinSide = Math.sin(angle + tiltSide);
    var cosUp = Math.cos(tiltUp);
    var sinUp = Math.sin(tiltUp);
    var nearScale = camera / (camera - fieldRadius);
    var farScale = camera / (camera + fieldRadius);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];

      // turn left / right
      var x1 = p.x * cosSide + p.z * sinSide;
      var z1 = -p.x * sinSide + p.z * cosSide;

      // tilt up / down
      var y1 = p.y * cosUp - z1 * sinUp;
      var z2 = p.y * sinUp + z1 * cosUp;

      p.rx = x1;
      p.ry = y1;
      p.rz = z2;

      // perspective: things that are closer look bigger
      p.scale = camera / (camera + z2);
      p.sx = centerX + x1 * p.scale;
      p.sy = centerY + y1 * p.scale;

      p.depth = (p.scale - farScale) / (nearScale - farScale);
      if (p.depth < 0) {
        p.depth = 0;
      }
      if (p.depth > 1) {
        p.depth = 1;
      }
    }
  }

  function isOnScreen(p) {
    return p.sx > -40 && p.sx < canvas.width + 40 && p.sy > -40 && p.sy < canvas.height + 40;
  }

  // distance between two points in 3D
  function distance3D(a, b) {
    var dx = a.rx - b.rx;
    var dy = a.ry - b.ry;
    var dz = a.rz - b.rz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // a small glowing dot that travels from one point to a neighbour
  function sendPacket() {
    var start = Math.floor(Math.random() * points.length);
    var neighbours = [];

    for (var i = 0; i < points.length; i++) {
      if (i !== start && distance3D(points[start], points[i]) < LINK_DISTANCE) {
        neighbours.push(i);
      }
    }

    if (neighbours.length > 0 && isOnScreen(points[start])) {
      var end = neighbours[Math.floor(Math.random() * neighbours.length)];
      packets.push({ from: start, to: end, progress: 0 });
    }
  }

  // launches a shooting star from (x, y) moving by (speedX, speedY) each frame
  function shootStar(x, y, speedX, speedY) {
    if (stars.length < 12) {
      stars.push({ x: x, y: y, speedX: speedX, speedY: speedY, age: 0 });
    }
  }

  function drawNet() {
    // do nothing while the hero is scrolled out of view
    if (window.scrollY < canvas.height) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time = time + 0.02;
      frame = frame + 1;
      updateZone();

      // the scene turns slowly. the mouse tilts it a little.
      var targetSide = 0;
      var targetUp = 0;
      if (mouse.x > 0) {
        targetSide = (mouse.x / canvas.width - 0.5) * 0.6;
        targetUp = (mouse.y / canvas.height - 0.5) * 0.35;
      }
      tiltSide = tiltSide + (targetSide - tiltSide) * 0.04;
      tiltUp = tiltUp + (targetUp - tiltUp) * 0.04;
      angle = angle + 0.0022;

      turnPoints();

      // the pointer pulls close points toward it (and remembers how close they are)
      for (var q = 0; q < points.length; q++) {
        var pulled = points[q];
        pulled.near = 0;

        if (mouse.x > 0) {
          var toPointerX = mouse.x - pulled.sx;
          var toPointerY = mouse.y - pulled.sy;
          var toPointer = Math.sqrt(toPointerX * toPointerX + toPointerY * toPointerY);

          if (toPointer < POINTER_RADIUS && toPointer > 0) {
            pulled.near = 1 - toPointer / POINTER_RADIUS;
            pulled.sx = pulled.sx + toPointerX * 0.2 * pulled.near;
            pulled.sy = pulled.sy + toPointerY * 0.2 * pulled.near;
          }
        }
      }

      // 1. thin lines between points that are close (in 3D)
      for (var a = 0; a < points.length; a++) {
        for (var b = a + 1; b < points.length; b++) {
          var lineDistance = distance3D(points[a], points[b]);

          if (lineDistance < LINK_DISTANCE && (isOnScreen(points[a]) || isOnScreen(points[b]))) {
            var depthMix = (points[a].depth + points[b].depth) / 2;
            var lineAlpha = 0.5 * (1 - lineDistance / LINK_DISTANCE) * (0.25 + depthMix * 0.75);
            lineAlpha = lineAlpha + (points[a].flash + points[b].flash) * 0.15;

            // fainter behind the text
            var middleX = (points[a].sx + points[b].sx) / 2;
            var middleY = (points[a].sy + points[b].sy) / 2;
            if (isInZone(middleX, middleY)) {
              lineAlpha = lineAlpha * 0.35;
            }

            ctx.beginPath();
            ctx.moveTo(points[a].sx, points[a].sy);
            ctx.lineTo(points[b].sx, points[b].sy);
            ctx.strokeStyle = 'rgba(96, 165, 250, ' + lineAlpha + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // lines from the pointer to the points that are close to it
      for (var t = 0; t < points.length; t++) {
        if (points[t].near > 0) {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(points[t].sx, points[t].sy);
          ctx.strokeStyle = 'rgba(255, 255, 255, ' + (points[t].near * 0.55) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // 2. draw the points from far to near (so near ones are on top)
      var order = points.slice();
      order.sort(function (first, second) {
        return second.rz - first.rz;
      });

      for (var n = 0; n < order.length; n++) {
        var dot = order[n];

        if (isOnScreen(dot)) {
          // slow twinkle + fainter when far away or behind the text
          var alpha = (0.3 + dot.depth * 0.7) * (0.85 + Math.sin(time * 2 + dot.phase * 10) * 0.15);
          if (isInZone(dot.sx, dot.sy)) {
            alpha = alpha * 0.35;
          }

          // points close to the pointer get brighter
          alpha = alpha + dot.near * 0.4;

          if (dot.hub) {
            // the hub is a bigger, brighter point (it flashes when a packet arrives)
            ctx.beginPath();
            ctx.arc(dot.sx, dot.sy, (3 + dot.flash * 2 + dot.near * 2) * dot.scale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(191, 219, 254, ' + (alpha + 0.1) + ')';
            ctx.fill();

            // label (only when the hub is not too far away)
            if (dot.depth > 0.3) {
              ctx.font = Math.round(9 + dot.depth * 3) + 'px monospace';
              ctx.fillStyle = 'rgba(147, 197, 253, ' + (alpha * 0.9) + ')';
              ctx.fillText(dot.tag, dot.sx + 12 * dot.scale, dot.sy + 4);
            }
          } else {
            ctx.beginPath();
            ctx.arc(dot.sx, dot.sy, (1.6 + dot.flash * 2 + dot.near * 2) * dot.scale, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(147, 197, 253, ' + alpha + ')';
            ctx.fill();
          }
        }

        dot.flash = dot.flash * 0.95;
      }

      // 3. a few data packets travelling along the lines
      if (Math.random() < 0.03 && packets.length < 5) {
        sendPacket();
      }

      for (var p = packets.length - 1; p >= 0; p--) {
        var packet = packets[p];
        var fromPoint = points[packet.from];
        var toPoint = points[packet.to];

        packet.progress = packet.progress + 0.012;

        if (packet.progress >= 1) {
          toPoint.flash = 1;
          packets.splice(p, 1);
        } else {
          var packetX = fromPoint.sx + (toPoint.sx - fromPoint.sx) * packet.progress;
          var packetY = fromPoint.sy + (toPoint.sy - fromPoint.sy) * packet.progress;
          var packetSize = (fromPoint.scale + toPoint.scale) / 2;

          ctx.beginPath();
          ctx.arc(packetX, packetY, 2 * packetSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
        }
      }

      // small dot where the pointer is (the thin lines start here)
      if (mouse.x > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
      }

      // 4. shooting stars
      // every few seconds a star crosses the sky by itself
      if (frame % 160 === 0 && Math.random() < 0.7) {
        shootStar(
          canvas.width * (0.3 + Math.random() * 0.8),
          -20 + Math.random() * canvas.height * 0.35,
          -(9 + Math.random() * 5),
          4.5 + Math.random() * 3
        );
      }

      for (var s = stars.length - 1; s >= 0; s--) {
        var star = stars[s];

        star.x = star.x + star.speedX;
        star.y = star.y + star.speedY;
        star.age = star.age + 1;

        // gone when it left the screen
        if (star.x < -250 || star.x > canvas.width + 250 || star.y < -250 || star.y > canvas.height + 250) {
          stars.splice(s, 1);
        } else {
          // the tail is a line that fades out behind the star
          var tailX = star.x - star.speedX * 16;
          var tailY = star.y - star.speedY * 16;
          var tail = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
          tail.addColorStop(0, 'rgba(147, 197, 253, 0)');
          tail.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(star.x, star.y);
          ctx.strokeStyle = tail;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(drawNet);
  }

  function setMouse(clientX, clientY) {
    var box = canvas.getBoundingClientRect();
    var newX = clientX - box.left;
    var newY = clientY - box.top;

    // a fast flick of the mouse shoots a star in that direction
    if (mouse.lastX > 0) {
      var moveX = newX - mouse.lastX;
      var moveY = newY - mouse.lastY;
      var speed = Math.sqrt(moveX * moveX + moveY * moveY);

      if (speed > 40 && frame - lastFlick > 20) {
        shootStar(newX, newY, (moveX / speed) * 13, (moveY / speed) * 13);
        lastFlick = frame;
      }
    }

    mouse.x = newX;
    mouse.y = newY;
    mouse.lastX = newX;
    mouse.lastY = newY;
  }

  function clearMouse() {
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.lastX = -1000;
    mouse.lastY = -1000;
  }

  hero.addEventListener('mousemove', function (event) {
    setMouse(event.clientX, event.clientY);
  });

  hero.addEventListener('mouseleave', clearMouse);

  // touch screens: finger works like the mouse
  hero.addEventListener('touchmove', function (event) {
    setMouse(event.touches[0].clientX, event.touches[0].clientY);
  });

  hero.addEventListener('touchend', clearMouse);

  // click = three shooting stars from the place you clicked
  hero.addEventListener('click', function (event) {
    var box = canvas.getBoundingClientRect();
    var clickX = event.clientX - box.left;
    var clickY = event.clientY - box.top;

    for (var i = 0; i < 3; i++) {
      shootStar(clickX + i * 14, clickY - i * 8, -(10 + Math.random() * 4), 5 + Math.random() * 3);
    }
  });

  window.addEventListener('resize', setupNet);

  setupNet();
  drawNet();
}


// ---- ABOUT: COUNT UP NUMBERS (added) ----

function countUp(elementId, target) {
  var element = document.getElementById(elementId);
  if (element === null) return;

  // no animation if the user turned it off
  if (reduceMotion) {
    element.textContent = target;
    return;
  }

  var current = 0;
  var timer = setInterval(function () {
    current = current + 1;
    element.textContent = current;

    if (current >= target) {
      clearInterval(timer);
    }
  }, 120);
}

function getCertificateCount() {
  var total = 0;
  for (var i = 0; i < achievements.length; i++) {
    total = total + achievements[i].items.length;
  }
  return total;
}

function initCounters() {
  var aboutSection = document.getElementById('about');

  // start counting once, when the about section shows up
  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      countUp('stat-projects', projects.length);
      countUp('stat-certs', getCertificateCount());
      countUp('stat-languages', languages.length);
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  observer.observe(aboutSection);
}


// ---- PROJECT CARD TILT (added) ----

function setupTilt(card) {
  card.addEventListener('mousemove', function (event) {
    var box = card.getBoundingClientRect();
    var x = (event.clientX - box.left) / box.width - 0.5;
    var y = (event.clientY - box.top) / box.height - 0.5;

    card.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (y * -6) + 'deg) translateY(-4px)';
  });

  card.addEventListener('mouseleave', function () {
    card.style.transform = '';
  });
}

function initCardTilt() {
  if (reduceMotion) return;

  var cards = document.querySelectorAll('.project-card');
  for (var i = 0; i < cards.length; i++) {
    setupTilt(cards[i]);
  }
}


// ---- CONTACT (added) ----

function initContact() {
  var form = document.getElementById('contact-form');
  var copyButton = document.getElementById('copy-email');

  // copy email button
  copyButton.addEventListener('click', function () {
    var email = copyButton.getAttribute('data-email');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(function () {
        showToast('Email copied to clipboard');
      }).catch(function () {
        // the browser blocked copying, so just show the email
        showToast('My email: ' + email);
      });
    } else {
      // old browsers: just show the email
      showToast('My email: ' + email);
    }
  });

  // the form opens the user's email app with the message filled in
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = document.getElementById('contact-name').value;
    var email = document.getElementById('contact-email').value;
    var message = document.getElementById('contact-message').value;

    var subject = 'Portfolio message from ' + name;
    var body = message + '\n\n' + name + '\n' + email;

    window.location.href = 'mailto:' + copyButton.getAttribute('data-email') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    showToast('Opening your email app...');
    form.reset();
  });
}


// ---- SCROLL ANIMATIONS ----

function initScrollAnimations() {

  function handleIntersections(entries, observer) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];

      if (entry.isIntersecting) {
        // added: cards that show at the same time appear one after another
        showAfterDelay(entry.target, i * 90);
        observer.unobserve(entry.target);
      }
    }
  }

  function showAfterDelay(element, delay) {
    setTimeout(function () {
      element.classList.add('visible');
    }, delay);
  }

  var observer = new IntersectionObserver(handleIntersections, { threshold: 0.08 });

  var fadeElements = document.querySelectorAll('.fade-in');
  for (var i = 0; i < fadeElements.length; i++) {
    observer.observe(fadeElements[i]);
  }
}



// ---- INSPECTION WARNING ----

// how long the popup stays on screen (milliseconds)
var INSPECTION_POPUP_MS = 2800;

function initInspectionWarning() {
  var popup = document.getElementById('inspection-popup');
  var hideTimer = null;

  // last known mouse / touch position, the popup appears there
  // (starts in the middle of the screen for keyboard-only visitors)
  var lastX = window.innerWidth / 2;
  var lastY = window.innerHeight / 2;

  document.addEventListener('mousemove', function (event) {
    lastX = event.clientX;
    lastY = event.clientY;
  });

  document.addEventListener('touchstart', function (event) {
    lastX = event.touches[0].clientX;
    lastY = event.touches[0].clientY;
  }, { passive: true });

  function showInspectionWarning(x, y) {
    // show it first so its size can be measured
    popup.hidden = false;

    // centered on the pointer, but never outside the screen
    var left = x - popup.offsetWidth / 2;
    var top = y - popup.offsetHeight / 2;
    var maxLeft = window.innerWidth - popup.offsetWidth - 8;
    var maxTop = window.innerHeight - popup.offsetHeight - 8;

    popup.style.left = Math.max(8, Math.min(left, maxLeft)) + 'px';
    popup.style.top = Math.max(8, Math.min(top, maxTop)) + 'px';

    // restart the pop animation if it was already showing
    popup.style.animation = 'none';
    void popup.offsetWidth;
    popup.style.animation = '';

    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      popup.hidden = true;
    }, INSPECTION_POPUP_MS);
  }

  // keyboard shortcuts that open the developer tools or the page source
  document.addEventListener('keydown', function (event) {
    var code = event.code;
    var devToolKey = code === 'KeyI' || code === 'KeyJ' || code === 'KeyC';

    var isInspectShortcut =
      event.key === 'F12' ||
      (event.ctrlKey && event.shiftKey && devToolKey) ||    // Ctrl + Shift + I / J / C
      (event.ctrlKey && code === 'KeyU') ||                 // Ctrl + U (view source)
      (event.metaKey && event.altKey && (devToolKey || code === 'KeyU')); // Cmd + Option + I / J / C / U (Mac)

    if (isInspectShortcut) {
      event.preventDefault();
      showInspectionWarning(lastX, lastY);
    }
  }, true);

  // right-click -> "Inspect"
  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    showInspectionWarning(event.clientX, event.clientY);
  });
}


// cards must be built before the scroll animations start
function startPage() {
  renderSkills(languages, 'languages-grid');
  renderSkills(frameworks, 'frameworks-grid');
  renderProjects();
  renderFilters();
  renderAchievements();
  initImageModal();
  initSeeMore();
  initNavigation();
  initTyping();
  initHeroNetwork();
  initCounters();
  initCardTilt();
  initContact();
  initScrollAnimations();
  initInspectionWarning();
}

document.addEventListener('DOMContentLoaded', startPage);

