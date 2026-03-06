export const copy = {
  en: {
    brand: 'SilentVoix',
    navHome: 'Home',
    navCourses: 'Courses',
    navLearn: 'Learn',
    navDashboard: 'Dashboard',
    mainNavAria: 'Main navigation',
    heroTitle: 'Train Customer Sign Language With Confidence',
    heroSubtitle:
      'A modern practice space for customer teams to learn sign language with guided lessons and live camera feedback.',
    heroStatOne: 'Hands-on lessons',
    heroStatTwo: 'EN / VI learning mode',
    heroStatThree: 'Live mirror camera practice',
    catalogTitle: 'Course Catalog',
    catalogSub: 'Browse practical sign-language paths for customer-facing teams.',
    viewCourse: 'View Course',
    startLearning: 'Start Learning',
    lessonsTitle: 'Lesson Library',
    lessonsSub: 'Start with essentials for real customer conversations.',
    level: 'Level',
    duration: 'Duration',
    minutes: 'min',
    studioTitle: 'Practice Studio',
    studioSub: 'Watch the lesson and mirror the signs in your camera.',
    lessonVideo: 'Lesson Video',
    speed: 'Speed',
    cameraTitle: 'Your Camera',
    cameraHelp: 'Allow camera access and keep your hands + face in frame.',
    cameraOn: 'Enable Camera',
    cameraOff: 'Turn Off Camera',
    themeLight: 'Light',
    themeDark: 'Dark',
    tipsTitle: 'Coach Tips',
    tip1: 'Keep your shoulders visible for clearer gestures.',
    tip2: 'Repeat each sign slowly before increasing playback speed.',
    tip3: 'Use pauses to compare your hand shape with the tutor.',
    whatYouLearn: 'What you will learn',
    learnBulletOne: 'Greeting, support, and confirmation sign patterns.',
    learnBulletTwo: 'Customer-facing signing pace and clarity habits.',
    learnBulletThree: 'Practical hand-shape and framing correction routines.',
    markAsDone: 'Mark Lesson Done',
    toDashboard: 'Go To Dashboard',
    dashboardTitle: 'Learning Dashboard',
    dashboardSub: 'Track completion and continue where you left off.',
    progressLabel: 'Progress',
    continueLabel: 'Continue',
    backToCourses: 'Back To Courses',
    courseNotFoundTitle: 'Course not found',
    courseNotFoundSub: 'This course link is invalid or no longer available.',
    notFoundTitle: 'Page not found',
    notFoundSub: 'The route does not exist in this app.',
    backHome: 'Back Home',
    footer: 'UI/UX Prototype Only - Backend comes next.'
  },
  vi: {
    brand: 'SilentVoix',
    navHome: 'Trang chu',
    navCourses: 'Khoa hoc',
    navLearn: 'Hoc',
    navDashboard: 'Bang dieu khien',
    mainNavAria: 'Dieu huong chinh',
    heroTitle: 'Luyen Sign Language Cho Cham Soc Khach Hang',
    heroSubtitle:
      'Khong gian hoc hien dai cho doi ngu khach hang voi bai hoc huong dan va camera thuc hanh truc tiep.',
    heroStatOne: 'Bai hoc thuc hanh',
    heroStatTwo: 'Che do EN / VI',
    heroStatThree: 'Tap voi camera guong',
    catalogTitle: 'Danh Sach Khoa Hoc',
    catalogSub: 'Chon lo trinh sign language cho doi ngu cham soc khach hang.',
    viewCourse: 'Xem Khoa Hoc',
    startLearning: 'Bat Dau Hoc',
    lessonsTitle: 'Thu Vien Bai Hoc',
    lessonsSub: 'Bat dau voi cac tinh huong giao tiep khach hang co ban.',
    level: 'Cap do',
    duration: 'Thoi luong',
    minutes: 'phut',
    studioTitle: 'Phong Tap',
    studioSub: 'Xem video bai hoc va tap theo bang camera cua ban.',
    lessonVideo: 'Video Bai Hoc',
    speed: 'Toc do',
    cameraTitle: 'Camera Cua Ban',
    cameraHelp: 'Cho phep camera va giu ro tay + khuon mat trong khung.',
    cameraOn: 'Bat Camera',
    cameraOff: 'Tat Camera',
    themeLight: 'Sang',
    themeDark: 'Toi',
    tipsTitle: 'Meo Luyen Tap',
    tip1: 'Giup thay ro dong tac bang cach de lo phan vai.',
    tip2: 'Tap cham truoc, sau do moi tang toc do video.',
    tip3: 'Dung tam dung de so sanh dang tay voi giao vien.',
    whatYouLearn: 'Ban se hoc duoc gi',
    learnBulletOne: 'Mau ky hieu chao hoi, ho tro va xac nhan thong tin.',
    learnBulletTwo: 'Nhip ky hieu ro rang khi giao tiep voi khach.',
    learnBulletThree: 'Cach dieu chinh dang tay va khung hinh thuc hanh.',
    markAsDone: 'Danh Dau Da Hoc',
    toDashboard: 'Den Bang Dieu Khien',
    dashboardTitle: 'Bang Dieu Khien Hoc Tap',
    dashboardSub: 'Theo doi tien do va tiep tuc bai hoc dang do.',
    progressLabel: 'Tien do',
    continueLabel: 'Hoc Tiep',
    backToCourses: 'Quay Lai Khoa Hoc',
    courseNotFoundTitle: 'Khong tim thay khoa hoc',
    courseNotFoundSub: 'Lien ket khoa hoc khong hop le hoac da bi xoa.',
    notFoundTitle: 'Khong tim thay trang',
    notFoundSub: 'Duong dan nay khong ton tai trong ung dung.',
    backHome: 'Ve Trang Chu',
    footer: 'Day la ban UI/UX, backend se lam sau.'
  }
};

export const lessons = [
  {
    id: 1,
    level: 'Beginner',
    durationMinutes: 8,
    title: {
      en: 'Greeting Customers',
      vi: 'Chao Hoi Khach Hang'
    },
    description: {
      en: 'Learn hello, welcome, and thank you signs for front-desk interactions.',
      vi: 'Hoc cac ky hieu xin chao, chao mung va cam on cho quay tiep tan.'
    },
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4'
  },
  {
    id: 2,
    level: 'Intermediate',
    durationMinutes: 12,
    title: {
      en: 'Support Questions',
      vi: 'Hoi Dap Ho Tro'
    },
    description: {
      en: 'Practice signs for asking needs, clarifying requests, and confirming understanding.',
      vi: 'Luyen ky hieu de hoi nhu cau, lam ro yeu cau va xac nhan thong tin.'
    },
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4'
  },
  {
    id: 3,
    level: 'Advanced',
    durationMinutes: 15,
    title: {
      en: 'Order Confirmation Flow',
      vi: 'Quy Trinh Xac Nhan Don'
    },
    description: {
      en: 'Advanced lesson for product confirmation, quantity, and payment communication.',
      vi: 'Bai hoc nang cao cho xac nhan san pham, so luong va thanh toan.'
    },
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4'
  }
];
