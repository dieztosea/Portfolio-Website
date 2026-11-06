// labels shown beside the bigger hub points in the 3D hero background (the first 8 are used)
var heroTags = ['HTML', 'CSS', 'JS', 'SQL', 'JAVA', 'PYTHON', 'LAN', 'FIGMA', 'TCP/IP', 'DNS', 'GIT'];

// icons are search and selected from Remix Icon (https://remixicon.com/)
var languages = [
  { name: 'Python',     icon: 'ri-terminal-box-line', note: 'Data analysis & scripting' },
  { name: 'Java',       icon: 'ri-cup-line',          note: 'OOP & GUI applications' },
  { name: 'HTML',       icon: 'ri-html5-line',        note: 'Semantic markup' },
  { name: 'CSS',        icon: 'ri-css3-line',         note: 'Responsive layouts' },
  { name: 'JavaScript', icon: 'ri-javascript-line',   note: 'Interactive web pages' }
];

var frameworks = [
  { name: 'Figma',           icon: 'ri-pen-nib-fill',      note: 'UI/UX design & prototyping' },
  { name: 'Visual Studio',   icon: 'ri-code-box-line',   note: 'Development environment' },
  { name: 'MySQL Workbench', icon: 'ri-database-2-line', note: 'Database design & queries' },
  { name: 'NetBeans',        icon: 'ri-braces-line',     note: 'Java development' }
];

// details of projects
// demoVideo (optional): path to a file in the videos folder. Projects without it open the image instead.
var projects = [
  {
    name: 'JACENT — E-Commerce Website',
    type: 'E-Commerce Website', badge: 'Web',
    image: 'images/JACENT.png',
    demoVideo: 'videos/JACENT DEMO.mp4',
    githubUrl: 'https://github.com/dieztosea/JACENT---Mountain-Pen-Website.git',
    description: 'A website for online fountain pen sales with product browsing, search, filters, login/sign-up and a shopping cart.',
    concept: 'An e-commerce website that makes shopping simple and enjoyable.',
    stack: ['HTML', 'CSS', 'JavaScript'],
  },

  {
    name: 'L-IMAP — Database Project',
    type: 'Database', badge: 'Database',
    image: 'images/L-IMAP.png',
    description: 'Laboratory Inventory and Management Asset Portal (L-IMAP) is an all-in-one laboratory management platform that will assist in improving the management within the Laboratory Coordinator Office and Property Custodian Office of Divine Word College of Calapan.',
    concept: 'Organize data into a structured schema that is reliable and easy to query.',
    stack: ['MySQL', 'MySQL Workbench'],
  },
  
  {
    name: 'HIDEVERSE Game Development Project',
    type: 'Game Development', badge: 'Game Dev',
    image: 'images/HIDEVERSE.png',
    demoVideo: 'videos/HIDEVERSE DEMO.mp4',
    description: 'Hideverse is a single-player game featuring six players—one seeker and five hiders—who rotate roles each round every level. Players navigate a dynamic arena with three difficulty levels, each offering varying time limits and map layouts.',
    concept: 'Model characters and game mechanics as reusable objects.',
    stack: ['Java', 'Object-Oriented Programming'],
  },


  {
    name: 'PROJECT LTO CONFIGURATION',
    type: 'Network Configuration', badge: 'Networking',
    image: 'images/LTO.png',
    demoVideo: 'videos/LTO DEMO.mp4',
    description: 'This project presents a CCNA-based network design and prototype utilizing VLAN segmentation, OSPF dynamic routing, and security controls to modernize connectivity and enhance data communication at the LTO Regional Office in Calapan City.',
    concept: 'Design a working network topology with properly configured devices.',
    stack: ['Cisco Packet Tracer', 'Networking'],
  },


  {
    name: 'Java GUI GroceryPOS Project',
    type: 'Desktop Application', badge: 'Java GUI',
    image: 'images/POS.png',
    demoVideo: 'videos/JAVA PROJECT DEMO.mp4',
    githubUrl: 'https://github.com/dieztosea/GroceryInventoryPOS-Java.git',
    description: 'A Java GUI point-of-sale system for managing grocery items and processing sales.',
    concept: 'Make everyday store transactions fast and straightforward.',
    stack: ['Java', 'GUI'],
  },


  {
    name: 'SIT Website Project',
    type: 'Website', badge: 'Web',
    image: 'images/SIT WEB.png',
    demoVideo: 'videos/SIT WEB DEMO.mp4',
    githubUrl: 'https://github.com/dieztosea/SITWebsiteProj.git',
    description: 'A SIT website built with HTML and CSS.',
    concept: 'Present information specifically tailored for the SIT audience.',
    stack: ['HTML', 'CSS'],
  },

  {
    name: 'Wellness Website Project',
    type: 'Website Design', badge: 'Web',
    image: 'images/Wellness WEB.png',
    demoVideo: 'videos/WELLNESS DEMO.mp4',
    description: 'A wellness website design using FIGMA.',
    concept: 'Designed to promote mental and physical well-being.',
    stack: ['FIGMA', 'UI/UX Design'],
  },


  {
    name: 'Interiorize Mobile App Project',
    type: 'Mobile App', badge: 'Mobile',
    image: 'images/Interiorize.png',
    demoVideo: 'videos/Interiorize DEMO.mp4',
    description: 'A mobile app for interior design inspiration.',
    concept: 'Provide users with a platform to explore and save interior design ideas.',
    stack: ['FIGMA', 'UI/UX Design'],
  }

];

// details of certificates (image path is the file in images/certificates)
var achievements = [
  {
    issuer: 'Open Online Courses', kind: 'Platform', icon: 'ri-global-line',
    items: [
      { title: 'JavaScript Essentials 1', image: 'images/certificates/JavaScript Essentials 1.png'},
      { title: 'Data Analytics Essentials', image: 'images/certificates/Data Analytics Essentials.png' },
      { title: 'Introduction to Data Science', image: 'images/certificates/Introduction to Data Science.png' },
      { title: 'Networking Devices and Initial Configuration', image: 'images/certificates/Networking Devices and Initial Configuration.png' },
      { title: 'Basics of Data Structures and Algorithms', image: 'images/certificates/Basics of Data Structures and Algorithms.png' },
      { title: 'Data Analyst 101', image: 'images/certificates/Data Analyst 101.png' },
      { title: 'Learn CCNA 200-301 Network Fundamentals Online', image: 'images/certificates/Learn CCNA 200-301 Network Fundamentals Online.png' },
    ]
  },
  {
    issuer: 'Others', kind: 'Organization & Platform', icon: 'ri-global-line',
    items: [
      { title: 'Java Programming (NCIII)', image: 'images/certificates/Java Programming (NCIII).png' },
      { title: 'Certified Data Science Associate', image: 'images/certificates/CDSA.png' }
    ]
  }
];
