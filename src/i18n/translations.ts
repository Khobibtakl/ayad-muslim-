import type {
  FontFamilyOption,
  HadithCollectionId,
  LanguageCode,
  ThemeId,
  UserSettings,
} from '../types';

export interface TranslationStrings {
  appName: string;
  appSubtitle: string;
  welcome: string;
  greetingPrefix: string;
  offlineBanner: string;
  onlineStatus: string;
  offlineStatus: string;
  installApp: string;
  installIOS: string;
  iosInstallSteps: string;
  offlineZeroAdsBadge: string;
  versionPrefix: string;
  gpsLabel: string;
  kmUnit: string;
  daysShortUnit: string;
  hijriYearSuffix: string;
  languageNames: Record<LanguageCode, string>;
  fontNames: Record<FontFamilyOption, string>;
  nav: {
    dashboard: string;
    quran: string;
    dictionary: string;
    hadith: string;
    adhkar: string;
    tasbeeh: string;
    duas: string;
    prayer: string;
    qibla: string;
    mosques: string;
    library: string;
    quotes: string;
    zakat: string;
    calendar: string;
    tasks: string;
    routines: string;
    statistics: string;
    assistant: string;
    search: string;
    notifications: string;
    settings: string;
    about: string;
    admin: string;
    moreModules: string;
  };
  navGroups: {
    worship: string;
    quranHadith: string;
    knowledgeTools: string;
    system: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    all: string;
    copy: string;
    copied: string;
    share: string;
    download: string;
    downloaded: string;
    offlineReady: string;
    localCacheLabel: string;
    bookmark: string;
    favorite: string;
    favorites: string;
    bookmarks: string;
    close: string;
    confirm: string;
    reset: string;
    back: string;
    next: string;
    previous: string;
    loading: string;
    empty: string;
    source: string;
    verified: string;
    today: string;
    completed: string;
    pending: string;
    yes: string;
    no: string;
    exportCard: string;
    enable: string;
    disable: string;
    apply: string;
    total: string;
  };
  onboarding: {
    title: string;
    subtitle: string;
    chooseLang: string;
    chooseTheme: string;
    yourName: string;
    namePlaceholder: string;
    defaultUserName: string;
    locationOpt: string;
    locationDesc: string;
    allowLocation: string;
    notifOpt: string;
    notifDesc: string;
    allowNotif: string;
    noSignupNote: string;
    startApp: string;
  };
  dashboard: {
    hijriDate: string;
    gregorianDate: string;
    nextPrayer: string;
    prayerSummary: string;
    adhkarProgress: string;
    quranProgress: string;
    tasksProgress: string;
    dailyGoals: string;
    dailyHadith: string;
    dailyAyah: string;
    dailyDua: string;
    recommendedBook: string;
    upcomingEvent: string;
    quickAccess: string;
    carouselTitle: string;
    carouselPaused: string;
    carouselPlaying: string;
    daysLeft: string;
    ayahsRemaining: string;
    asrSurahRef: string;
  };
  prayers: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    city: string;
    detectLocation: string;
    calcMethod: string;
    madhab: string;
    hanafi: string;
    shafi: string;
    adjustments: string;
    monthlyCalendar: string;
    adhanAlert: string;
    markPrayed: string;
    prayed: string;
    manualLocation: string;
    selectCity: string;
    methods: Record<UserSettings['calcMethod'], string>;
  };
  qiblaModule: {
    northShort: string;
    southShort: string;
    eastShort: string;
    westShort: string;
    makkahLabel: string;
    compassHeading: string;
    bearingTrueNorth: string;
    enableSensor: string;
    sensorMissingTitle: string;
    sensorMissingDesc: string;
    calibrationTitle: string;
    calibrationSteps: string;
    worldCitiesTitle: string;
    previewDialLabel: string;
  };
  mosquesModule: {
    offlineRadarTitle: string;
    offlineRadarDesc: string;
    openDirections: string;
    sourceLabel: string;
    youAreHere: string;
    ringLabel: string;
  };
  quranModule: {
    surahWord: string;
    juzWord: string;
    surahs: string;
    juzs: string;
    meccan: string;
    medinan: string;
    ayahs: string;
    readingMode: string;
    studyMode: string;
    nightMode: string;
    tafsir: string;
    tafsirMuyassar: string;
    tafsirIbnKathir: string;
    tafsirJalalayn: string;
    defaultTafsirSource: string;
    lexicalMeaning: string;
    asbabNuzul: string;
    lastRead: string;
    continueReading: string;
    dailyGoal: string;
    khatmah: string;
    downloadOffline: string;
    downloadAllOffline: string;
    reciter: string;
    speed: string;
    repeat: string;
    searchAyahs: string;
    shareCard: string;
    wordDictionary: string;
    cacheAudioBtn: string;
    audioCachedBadge: string;
    offlineSpeechPlay: string;
    offlineSpeechStop: string;
  };
  hadithModule: {
    collections: string;
    narrator: string;
    grade: string;
    chapter: string;
    hadithNum: string;
    commentary: string;
    hadithOfDay: string;
    authenticityNotice: string;
    topics: string;
    topicLabels: Record<string, string>;
    gradeLabels: Record<string, string>;
  };
  dictionaryModule: {
    learningHistory: string;
  };
  duasModule: {
    categories: Record<'Personal' | 'Family' | 'Knowledge' | 'Rizq' | 'Healing', string>;
    translationPlaceholder: string;
    notesPlaceholder: string;
  };
  libraryModule: {
    subtitleSuffix: string;
    addDocumentBtn: string;
    zoomIn: string;
    zoomOut: string;
    fullscreen: string;
    pageLabel: string;
    pageShort: string;
    volumeShort: string;
    localUserDoc: string;
    publicDomainLabel: string;
    sizeUnitMB: string;
    chapterLabel: string;
    chaptersListTitle: string;
    aboutAuthorLabel: string;
  };
  quotesModule: {
    authenticityBanner: string;
  };
  zakatModule: {
    cash: string;
    goldGrams: string;
    goldPricePerGram: string;
    silverGrams: string;
    silverPricePerGram: string;
    businessGoods: string;
    otherAssets: string;
    debts: string;
    nisabStandard: string;
    goldStandard: string;
    silverStandard: string;
    goldShort: string;
    silverShort: string;
    nisabLabel: string;
    calculate: string;
    resultTitle: string;
    totalAssets: string;
    netZakatable: string;
    zakatDue: string;
    belowNisab: string;
    fiqhNote: string;
    history: string;
    currencies: Record<'USD' | 'AFN' | 'SAR' | 'EUR', string>;
    recipientsTitle: string;
    recipientsVerseRef: string;
    recipients: string[];
    fitrTitle: string;
    fitrDesc: string;
  };
  calendarModule: {
    sightingNote: string;
    eventsTitle: string;
    ramadan: string;
    laylatulQadr: string;
    eidFitr: string;
    dhulHijjahTen: string;
    arafah: string;
    eidAdha: string;
    ashura: string;
    tasua: string;
    hijriNewYear: string;
    rabiAwwal12: string;
    israMiraj: string;
    midShaban: string;
    friday: string;
    hijriMonthsCount: string;
    fastingIndicatorsTitle: string;
    ayyamAlBidLabel: string;
    sunnahFastMonThu: string;
  };
  tasksModule: {
    views: Record<'today' | 'upcoming' | 'overdue' | 'completed' | 'all', string>;
    priorities: Record<'high' | 'medium' | 'low', string>;
    recurrences: Record<'none' | 'daily' | 'weekly' | 'monthly', string>;
    descPlaceholder: string;
  };
  statsModule: {
    localRealData: string;
    lockBtn: string;
    weeklyChartTitle: string;
    pinPlaceholder: string;
    pinLengthHint: string;
  };
  notificationsModule: {
    morningAdhkarLabel: string;
    eveningAdhkarLabel: string;
    unreadLabel: string;
    markAllRead: string;
    clearRead: string;
    testAlert: string;
    checkReminders: string;
    prefsTitle: string;
    scheduledTodayTitle: string;
    filterAll: string;
    filterUnread: string;
    openModule: string;
    soundChime: string;
    permissionGranted: string;
    permissionDefault: string;
    permissionBlocked: string;
    permissionUnsupported: string;
    inAppFallbackNote: string;
    testTitle: string;
    testBody: string;
    prayerDueTitle: string;
    prayerDueBody: string;
    morningAdhkarTitle: string;
    morningAdhkarBody: string;
    eveningAdhkarTitle: string;
    eveningAdhkarBody: string;
    quranReminderTitle: string;
    quranReminderBody: string;
    fridayReminderTitle: string;
    fridayReminderBody: string;
    eventReminderTitle: string;
    taskReminderTitle: string;
    welcomeNotifTitle: string;
    welcomeNotifBody: string;
  };
  assistantModule: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    offlineLocalNotice: string;
    scholarlyNotice: string;
    quickPrompts: string[];
  };
  settingsModule: {
    appearance: string;
    language: string;
    theme: string;
    wallpaper: string;
    fontFamily: string;
    fontSize: string;
    lineSpacing: string;
    customBgTint: string;
    tints: Record<'default' | 'ivory' | 'mint' | 'cream' | 'slate' | 'forest', string>;
    securityBackup: string;
    encryptedNote: string;
    createBackup: string;
    restoreBackup: string;
    backupPassword: string;
    restoreConfirm: string;
    statsPin: string;
    setPin: string;
    pinSaved: string;
    pinCleared: string;
    unlockStats: string;
    wrongPin: string;
    deleteAllData: string;
    deleteConfirm: string;
    aboutTitle: string;
    version: string;
    checkUpdates: string;
    upToDate: string;
  };
  adminModule: {
    subtitle: string;
    tabs: Record<'hadith' | 'book' | 'announcement', string>;
    collectionNames: Record<HadithCollectionId, string>;
    arabicTextPlaceholder: string;
    translationPlaceholder: string;
    sourceRequiredPlaceholder: string;
    bookTitlePlaceholder: string;
    bookAuthorPlaceholder: string;
    bookContentPlaceholder: string;
    publishAnnouncementTitle: string;
    announcementTitlePlaceholder: string;
    announcementBodyPlaceholder: string;
    reviewedLabel: string;
    seeSourceLabel: string;
    adminEditionLabel: string;
    permittedLabel: string;
  };
  aboutModule: {
    pageTitle: string;
    developerLabel: string;
    developerName: string;
    developerRole: string;
    essayTitle: string;
    essayParagraphs: string[];
    pillarsTitle: string;
    pillars: string[];
    closingDua: string;
    replaySplash: string;
    privacyTitle: string;
    privacyBody: string;
    openPrivacyPolicy: string;
    dataSafetyTitle: string;
    dataSafetyItems: string[];
    shareApp: string;
    shareCopied: string;
    playStoreReadyTitle: string;
    playStoreChecklist: string[];
  };
  themes: Record<ThemeId, string>;
  hijriMonths: string[];
  weekdays: string[];
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  ps: {
    appName: 'إِيَادُ المُسْلِم',
    appSubtitle: 'د مسلمان ملګری',
    welcome: 'ښه راغلاست',
    greetingPrefix: 'السلام علیکم،',
    offlineBanner: 'آفلاین حالت — ټولې محلّي سرچینې پرته له انټرنېټ کار کوي',
    onlineStatus: 'آنلاین',
    offlineStatus: 'آفلاین',
    installApp: 'اپلیکیشن نصب کړئ',
    installIOS: 'په آیفون کې نصبول',
    iosInstallSteps: '۱. د شریکولو تڼۍ کېکاږئ ← ۲. اصلي پاڼې ته یې زیات کړئ.',
    offlineZeroAdsBadge: 'بشپړ آفلاین · له اعلانونو خالي',
    versionPrefix: 'نسخه',
    gpsLabel: 'خودکار موقعیت',
    kmUnit: 'کیلومتره',
    daysShortUnit: 'ورځې',
    hijriYearSuffix: 'هـ ق',
    languageNames: {
      ps: 'پښتو',
      ar: 'عربي',
      fa: 'فارسي',
      en: 'انګلیسي',
    },
    fontNames: {
      'plus-amiri': 'امیري او عصري خط',
      naskh: 'نسخ عربي خط',
      scheherazade: 'شهرزاد نوی خط',
      kufi: 'کوفي خط',
      lateef: 'لطیف کلاسیک خط',
      vazirmatn: 'وزیرمتن خط',
    },
    nav: {
      dashboard: 'اصلي پاڼه',
      quran: 'قرآن او تفسیر',
      dictionary: 'قرآني قاموس',
      hadith: 'حدیث کتابتون',
      adhkar: 'اذکار او اوراد',
      tasbeeh: 'برېښنایي تسبیح',
      duas: 'شخصي دعاګانې',
      prayer: 'د لمانځه وختونه',
      qibla: 'د قبلې سمت',
      mosques: 'نږدې جوماتونه',
      library: 'اسلامي کتابتون',
      quotes: 'رقائق او اقوال',
      zakat: 'د زکات محاسبه',
      calendar: 'اسلامي تقویم',
      tasks: 'ورځنۍ دندې',
      routines: 'ورځنی روټین',
      statistics: 'ورځنۍ احصائیې',
      assistant: 'د ایاد مرستیال',
      search: 'جامع لټون',
      notifications: 'خبرتیاوې',
      settings: 'تنظیمات او خوندي ساتنه',
      about: 'د جوړوونکي په اړه',
      admin: 'اداره او بیاکتنه',
      moreModules: 'نورې برخې',
    },
    navGroups: {
      worship: 'عبادت او اوقات',
      quranHadith: 'قرآن، حدیث او اذکار',
      knowledgeTools: 'پوهه، کتابتون او پلان',
      system: 'تنظیمات او مرسته',
    },
    common: {
      save: 'ثبتول',
      cancel: 'لغوه',
      delete: 'حذف',
      edit: 'سمون',
      add: 'زیاتول',
      search: 'لټون...',
      filter: 'چاڼ',
      all: 'ټول',
      copy: 'کاپي',
      copied: 'کاپي شو',
      share: 'شریکول',
      download: 'ډاونلوډ',
      downloaded: 'خوندي شوی',
      offlineReady: 'آفلاین چمتو',
      localCacheLabel: 'محلّي حافظه',
      bookmark: 'نښه کول',
      favorite: 'خوښ شوی',
      favorites: 'خوښ شوي',
      bookmarks: 'نښې',
      close: 'تړل',
      confirm: 'تایید',
      reset: 'بیا پیل',
      back: 'شاته',
      next: 'بل',
      previous: 'مخکینی',
      loading: 'په حال کې...',
      empty: 'معلومات ونه موندل شول.',
      source: 'سرچینه',
      verified: 'تایید شوی',
      today: 'نن',
      completed: 'بشپړ شوی',
      pending: 'پاتې',
      yes: 'هو',
      no: 'نه',
      exportCard: 'انځوریز کارت',
      enable: 'فعالول',
      disable: 'بندول',
      apply: 'تطبیق',
      total: 'ټولټال',
    },
    onboarding: {
      title: 'إِيَادُ المُسْلِم – د مسلمان ملګری',
      subtitle: 'ستاسو د عبادت، قرآن، حدیث، علم او ورځني ژوند جامع آفلاین ملګری — پرته له اعلانونو او اجباري نوم‌ليکنې.',
      chooseLang: 'ژبه وټاکئ',
      chooseTheme: 'د اپلیکیشن بڼه وټاکئ',
      yourName: 'ستاسو نوم',
      namePlaceholder: 'د بېلګې په توګه: احمد',
      defaultUserName: 'مسلمان ورور',
      locationOpt: 'د لمانځه د دقیقو وختونو لپاره موقعیت (اختیاري)',
      locationDesc: 'ستاسو موقعیت یوازې ستاسو پر وسیله د لمانځه وختونو، قبلې او نږدې جوماتونو لپاره کارول کېږي.',
      allowLocation: 'موقعیت اجازه ورکول',
      notifOpt: 'د اذکارو او لمانځه خبرتیاوې (اختیاري)',
      notifDesc: 'د لمانځه او سهار/ماښام اذکارو د یادونې لپاره خبرتیاوې فعالې کړئ.',
      allowNotif: 'خبرتیاوې فعالول',
      noSignupNote: 'ټول معلومات ستاسو پر وسیله په خوندي ډول ساتل کېږي. هېڅ حساب جوړولو ته اړتیا نشته.',
      startApp: 'اپلیکیشن پیل کړئ',
    },
    dashboard: {
      hijriDate: 'هجري نېټه',
      gregorianDate: 'میلادي نېټه',
      nextPrayer: 'راتلونکی لمونځ',
      prayerSummary: 'د نن ورځې لمونځونه',
      adhkarProgress: 'د اذکارو پرمختګ',
      quranProgress: 'د قرآن تلاوت',
      tasksProgress: 'ورځنۍ دندې',
      dailyGoals: 'د نن ورځې اهداف',
      dailyHadith: 'د نن ورځې حدیث',
      dailyAyah: 'د نن ورځې قرآني آیت',
      dailyDua: 'د نن ورځې دعا',
      recommendedBook: 'وړاندیز شوی کتاب',
      upcomingEvent: 'راتلونکې اسلامي مناسبه',
      quickAccess: 'چټک لاسرسی',
      carouselTitle: 'ورځنی اسلامي کاروان',
      carouselPaused: 'کاروان درول شوی',
      carouselPlaying: 'په هرو ۱۰ ثانیو کې بدلېږي',
      daysLeft: 'ورځې پاتې',
      ayahsRemaining: 'آیتونه پاتې',
      asrSurahRef: 'سورت العصر · ۱-۳',
    },
    prayers: {
      fajr: 'سهار (فجر)',
      sunrise: 'لمر خاته',
      dhuhr: 'ماسپښین (ظهر)',
      asr: 'مازدیګر (عصر)',
      maghrib: 'ماښام (مغرب)',
      isha: 'ماسختن (عشاء)',
      city: 'ښار / سیمه',
      detectLocation: 'اتومات موقعیت پېژندنه',
      calcMethod: 'د محاسبې طریقه',
      madhab: 'د عصر فقهي مذهب',
      hanafi: 'حنفي مذهب',
      shafi: 'جمهور (شافعي، مالکي او حنبلي)',
      adjustments: 'د وختونو لاسي اصلاح (دقیقې)',
      monthlyCalendar: 'میاشتنی جدول',
      adhanAlert: 'د اذان خبرتیا',
      markPrayed: 'ادا شو',
      prayed: 'ادا شوی',
      manualLocation: 'لاسي ښار ټاکل',
      selectCity: 'مشهور ښار وټاکئ',
      methods: {
        Karachi: 'د کراچۍ اسلامي پوهنتون',
        MuslimWorldLeague: 'د اسلامي نړۍ رابطه',
        UmmAlQura: 'ام‌القرى (مکه مکرمه)',
        Egyptian: 'د مصر عمومي اداره',
        NorthAmerica: 'شمالي امریکا اسلامي ټولنه',
        Tehran: 'د تهران طریقه',
      },
    },
    qiblaModule: {
      northShort: 'ش',
      southShort: 'ج',
      eastShort: 'خ',
      westShort: 'ل',
      makkahLabel: 'مکه مکرمه',
      compassHeading: 'د قطب‌نما زاویه',
      bearingTrueNorth: 'له ریښتیني شمال څخه زاویه',
      enableSensor: 'د قطب‌نما سنسور فعالول',
      sensorMissingTitle: 'د موبایل قطب‌نما سنسور ونه موندل شو',
      sensorMissingDesc: 'تاسو کولای شئ شمال پر صفر درجې ونیسئ او د یادې زاویې په اندازه ښي لوري ته وګرځئ.',
      calibrationTitle: 'د سنسور د تنظیم لارښوونه',
      calibrationSteps: '۱. وسیله له فلزي شیانو لیرې وساتئ. ۲. موبایل په هوا کې د اتو هندسې په بڼه وګرځوئ. ۳. د دقیقې پایلې لپاره موقعیت فعال کړئ.',
      worldCitiesTitle: 'د نړۍ مشهورو ښارونو د قبلې زاویې',
      previewDialLabel: 'د زاویې لاسي ازموینه',
    },
    mosquesModule: {
      offlineRadarTitle: 'د نږدې جوماتونو آفلاین نقشه',
      offlineRadarDesc: 'د مرکز نقطې شاوخوا خوندي شوي جوماتونه د واټن او لوري له مخې',
      openDirections: 'لاره ښودل',
      sourceLabel: 'سیمه‌ییزه نقشه او خوندي شوي معلومات',
      youAreHere: 'ستاسو ځای',
      ringLabel: 'واټن',
    },
    quranModule: {
      surahWord: 'سورت',
      juzWord: 'پاره',
      surahs: 'سورتونه (۱۱۴)',
      juzs: 'پارې (۳۰)',
      meccan: 'مکي',
      medinan: 'مدني',
      ayahs: 'آیتونه',
      readingMode: 'د تلاوت حالت',
      studyMode: 'د مطالعې او تفسیر حالت',
      nightMode: 'د شپې لوستل',
      tafsir: 'تفسیر او تشریح',
      tafsirMuyassar: 'آسان تفسیر (المیسر)',
      tafsirIbnKathir: 'تفسیر ابن کثیر',
      tafsirJalalayn: 'تفسیر الجلالین',
      defaultTafsirSource: 'آسان تفسیر — د ملک فهد چاپ‌خونه',
      lexicalMeaning: 'لغوي معنا',
      asbabNuzul: 'شان نزول',
      lastRead: 'وروستی لوستل شوی ځای',
      continueReading: 'تلاوت ته دوام ورکړئ',
      dailyGoal: 'د تلاوت ورځنی هدف',
      khatmah: 'ختم القرآن',
      downloadOffline: 'د آفلاین لپاره ډاونلوډ',
      downloadAllOffline: 'مهم سورتونه آفلاین ډاونلوډ',
      reciter: 'قاري',
      speed: 'سرعت',
      repeat: 'تکرار',
      searchAyahs: 'په آیتونو کې لټون...',
      shareCard: 'انځوریز کارت جوړول',
      wordDictionary: 'د قرآن کلمې',
      cacheAudioBtn: 'غږیز تلاوت آفلاین خوندي کړئ',
      audioCachedBadge: 'غږ آفلاین خوندي دی',
      offlineSpeechPlay: 'د وسیلې غږیز لوستل',
      offlineSpeechStop: 'غږ درول',
    },
    hadithModule: {
      collections: 'د حدیثو کتابونه',
      narrator: 'راوي',
      grade: 'درجه',
      chapter: 'باب',
      hadithNum: 'شمېره',
      commentary: 'تشریح او فواید',
      hadithOfDay: 'د ورځې حدیث',
      authenticityNotice: 'د حدیث متن، درجه او سرچینه له معتبرو حدیثي کتابونو تایید شوې ده.',
      topics: 'موضوعات',
      topicLabels: {
        'Sincerity & Intention': 'اخلاص او نیت',
        'Ihsan & Worship': 'احسان او عبادت',
        'Quran & Teaching': 'قرآن او تعلیم',
        'Brotherhood & Heart': 'ورورولي او د زړه پاکي',
        'Knowledge & Help': 'علم او مرسته',
        'Patience & Gratitude': 'صبر او شکر',
        'Mercy & Character': 'رحمت او اخلاق',
        'Trustworthiness & Honesty': 'امانت او رښتینولي',
        'Seeking Knowledge': 'د علم طلب',
        'Taqwa & Character': 'تقوا او ښه چلند',
        'Character & Mindful Living': 'اخلاق او هوښیارتیا',
        'Dhikr & Gratitude': 'ذکر او شکرګزاري',
        'Worship & Prayer': 'عبادت او لمونځ',
        'Safety & Trust': 'امنیت او امانت',
        'Charity & Blessing': 'صدقه او برکت',
        Repentance: 'توبه',
        'Sincere Devotion': 'خالصانه بندګي',
        Character: 'اخلاق',
        'Forgiveness & Brotherhood': 'بخښنه او ورورولي',
        'Quran & Sunnah': 'قرآن او سنت',
        Brotherhood: 'ورورولي',
        'Lawful & Pure Heart': 'حلال رزق او پاک زړه',
        'Trust in Allah': 'پر الله توکل',
        'Family & Parents': 'کورنۍ او مور و پلار',
        'Neighborhood & Ethics': 'ګاونډيتوب او ادب',
        'Kindness & Charity': 'مهرباني او سخاوت',
        'Dhikr & Hope': 'ذکر او امید',
        'Justice & Mercy': 'عدل او رحمت',
        'Divine Mercy': 'الهي رحمت',
        Reviewed: 'تایید شوی',
      },
      gradeLabels: {
        'صحيح (متفق عليه)': 'صحیح (متفق علیه)',
        صحيح: 'صحیح',
        'صحيح (الترمذي والألباني)': 'صحیح (ترمذي او الباني)',
        'صحيح (الألباني وحسنه الترمذي)': 'صحیح (الباني او ترمذي)',
        'صحيح (الترمذي والحاكم)': 'صحیح (ترمذي او حاکم)',
        'صحيح (الترمذي وابن حبان)': 'صحیح (ترمذي او ابن حبان)',
        'صحيح لغيره (السيوطي والألباني)': 'صحیح لغیره',
        'حسن صحيح': 'حسن صحیح',
        'حسن صحيح (النووي والألباني)': 'حسن صحیح',
        'حسن (الترمذي والحاكم)': 'حسن (ترمذي او حاکم)',
        'حسن (الترمذي وابن ماجه)': 'حسن (ترمذي او ابن ماجه)',
        'حسن لغيره (الموطأ والحاكم)': 'حسن لغیره',
      },
    },
    dictionaryModule: {
      learningHistory: 'د زده‌کړې تاریخچه',
    },
    duasModule: {
      categories: {
        Personal: 'شخصي',
        Family: 'کورنۍ',
        Knowledge: 'علم',
        Rizq: 'حلال رزق',
        Healing: 'شفا',
      },
      translationPlaceholder: 'د دعا ژباړه یا معنا ولیکئ...',
      notesPlaceholder: 'یادښت او وخت...',
    },
    libraryModule: {
      subtitleSuffix: 'خوندي اسلامي کتابونه او اسناد',
      addDocumentBtn: 'سند زیاتول',
      zoomIn: 'لویول',
      zoomOut: 'کوچنی کول',
      fullscreen: 'بشپړه پاڼه',
      pageLabel: 'مخ',
      pageShort: 'مخ',
      volumeShort: 'ټوک',
      localUserDoc: 'شخصي سند',
      publicDomainLabel: 'آزاد علمي سند',
      sizeUnitMB: 'مېګابایټ',
      chapterLabel: 'فصل',
      chaptersListTitle: 'د کتاب فصلونه',
      aboutAuthorLabel: 'د لیکوال پېژندنه',
    },
    quotesModule: {
      authenticityBanner: 'د علماوو اقوال او د صحابه وو آثار له نبوي احادیثو څخه جلا ساتل شوي او د کتاب، ټوک او مخ له سرچینې سره ثبت دي.',
    },
    zakatModule: {
      cash: 'نغدې پیسې او بانکي حسابونه',
      goldGrams: 'سره زر (په ګرام)',
      goldPricePerGram: 'د یو ګرام سرو زرو بیه',
      silverGrams: 'سپین زر (په ګرام)',
      silverPricePerGram: 'د یو ګرام سپینو زرو بیه',
      businessGoods: 'سوداګریز مالونه او پانګه',
      otherAssets: 'نور زکات‌لرونکي شتمنۍ',
      debts: 'د منلو وړ پورونه او واجبات',
      nisabStandard: 'د نصاب معیار',
      goldStandard: 'د سرو زرو نصاب (۸۵ ګرامه)',
      silverStandard: 'د سپینو زرو نصاب (۵۹۵ ګرامه)',
      goldShort: 'سره زر',
      silverShort: 'سپین زر',
      nisabLabel: 'نصاب',
      calculate: 'زکات محاسبه کړئ',
      resultTitle: 'د زکات پایله',
      totalAssets: 'ټوله شتمني',
      netZakatable: 'خالص زکات‌لرونکی مال',
      zakatDue: 'واجب زکات (۲.۵٪)',
      belowNisab: 'مال تر نصاب کم دی، زکات پرې نشته.',
      fiqhNote: 'فقهي یادونه: د احتیاط او د فقراوو د مصلحت له مخې په حنفي مذهب کې د نغدو پیسو لپاره د سپینو زرو نصاب هم معتبر ګڼل کېږي؛ د خاصو مسایلو لپاره له عالم سره مشوره وکړئ.',
      history: 'د محاسبو تاریخچه',
      currencies: {
        USD: 'امریکایي ډالر',
        AFN: 'افغانۍ',
        SAR: 'سعودي ریال',
        EUR: 'یورو',
      },
      recipientsTitle: 'د زکات اته شرعي مصارف',
      recipientsVerseRef: 'سورة التوبة (آیت ۶۰)',
      recipients: [
        'فقیران (هغه کسان چې بشپړ نصاب نه لري)',
        'مسکینان (سخت اړمن او بې‌وسه کسان)',
        'د زکات راټولوونکي کارکوونکي',
        'د زړونو د تالیف لپاره (نوي مسلمانان)',
        'د بندي او غلام د آزادولو لپاره',
        'پوروړي (چې په حلاله توګه تر پوره نصابه پوروړي وي)',
        'د الله په لاره کې (د دیني، علمي او عامه خیر لارې)',
        'مسافر (چې په سفر کې بې‌خرڅه پاتې وي)',
      ],
      fitrTitle: 'صدقة الفطر (د سرسايې یادونه)',
      fitrDesc: 'د کوچني اختر له لمانځه مخکې پر هر وړ مسلمان (او د هغه د کورنۍ په استازیتوب) نیم صاع غنم (~۲.۲ کیلوګرامه) یا یو صاع اوربشې/خرما یا د هغوی معادل نغد قیمت ادا کول واجب دي.',
    },
    calendarModule: {
      sightingNote: 'یادونه: دلته ښودل شوې هجري نېټه د فلکي محاسبې پر بنسټ ده؛ د شرعي میاشتو رسمي پیل د هلال په رؤیت پورې اړه لري.',
      eventsTitle: 'اسلامي مناسبتونه',
      ramadan: 'د رمضان المبارک لومړۍ ورځ',
      laylatulQadr: 'د قدر شپه / وروستۍ لسیزه (رمضان ۲۷)',
      eidFitr: 'کوچنی اختر (شوال ۱)',
      dhulHijjahTen: 'د ذوالحجې مبارکې لومړۍ لسیزه (ذوالحجه ۱)',
      arafah: 'د عرفې ورځ (ذوالحجه ۹)',
      eidAdha: 'لوی اختر (ذوالحجه ۱۰)',
      ashura: 'د عاشورا ورځ (محرم ۱۰)',
      tasua: 'د تاسوعا روژه (محرم ۹)',
      hijriNewYear: 'نوی هجري قمري کال (محرم ۱)',
      rabiAwwal12: 'د نبي کریم ﷺ د بعثت او سیرت یاد (ربیع‌الأول ۱۲)',
      israMiraj: 'د اسراء او معراج تاریخي یادونه (رجب ۲۷)',
      midShaban: 'د شعبان پنځلسمه (شعبان ۱۵)',
      friday: 'د جمعې مبارکه ورځ',
      hijriMonthsCount: 'د هجري کال میاشتې (۱۲)',
      fastingIndicatorsTitle: 'د نن ورځې د مسنونو روژو نښه',
      ayyamAlBidLabel: 'أيام البيض (د میاشتې ۱۳، ۱۴، ۱۵ نېټې — سپينې ورځې)',
      sunnahFastMonThu: 'د دوشنبې او پنجشنبې مسنونه روژه',
    },
    tasksModule: {
      views: {
        today: 'نن',
        upcoming: 'راتلونکې',
        overdue: 'تېرې شوې',
        completed: 'بشپړې شوې',
        all: 'ټولې',
      },
      priorities: {
        high: 'لوړ لومړیتوب',
        medium: 'منځنی',
        low: 'عادي',
      },
      recurrences: {
        none: 'یو ځل',
        daily: 'هره ورځ',
        weekly: 'هره اونۍ',
        monthly: 'هره میاشت',
      },
      descPlaceholder: 'تفصیل او یادښت...',
    },
    statsModule: {
      localRealData: 'سل په سلو کې رښتیني محلّي عبادتي ارقام',
      lockBtn: 'قفل کول',
      weeklyChartTitle: 'د اوو ورځو د عبادت او مطالعې فعالیت',
      pinPlaceholder: 'پټ کوډ',
      pinLengthHint: 'لږ تر لږه ۴ توري یا شمېرې',
    },
    notificationsModule: {
      morningAdhkarLabel: 'د سهار اذکار',
      eveningAdhkarLabel: 'د ماښام اذکار',
      unreadLabel: 'نه‌لوستل شوې خبرتیاوې',
      markAllRead: 'ټول لوستل شوي',
      clearRead: 'لوستل شوي پاکول',
      testAlert: 'ازمایښتي زنګ او خبرتیا',
      checkReminders: 'د نن یادونې کتنه',
      prefsTitle: 'د خبرتیاوو تنظیمات',
      scheduledTodayTitle: 'د نن ورځې مهالویش شوي یادونې',
      filterAll: 'ټول',
      filterUnread: 'نه‌لوستل شوې',
      openModule: 'برخه پرانیستل',
      soundChime: 'د خبرتیا آرام غږ',
      permissionGranted: 'د براوزر خبرتیاوې فعالې دي',
      permissionDefault: 'د براوزر اجازه لا نه ده ورکړل شوې (د اپلیکیشن دننه خبرتیاوې فعالې دي)',
      permissionBlocked: 'براوزر بهرنۍ خبرتیاوې بندې کړې دي — د اپلیکیشن دننه خبرتیاوې کار کوي',
      permissionUnsupported: 'د دې وسیلې براوزر یوازې د اپلیکیشن دننه خبرتیاوې ملاتړ کوي',
      inAppFallbackNote: 'خبرتیاوې په اتومات ډول د اپلیکیشن په مرکز کې ثبتیږي او د سکرین په سر کې له آرام غږ سره ښودل کېږي.',
      testTitle: 'د إِيَادُ المُسْلِم خبرتیا ازموینه',
      testBody: 'د خبرتیاوو سیستم په بریالیتوب سره فعال دی — لمونځ، اذکار، قرآن او ورځنۍ دندې په خپل وخت یادول کېږي.',
      prayerDueTitle: 'د لمانځه وخت نږدې/داخل دی',
      prayerDueBody: 'مهرباني وکړئ د لمانځه لپاره اودس او تیاری ونیسئ.',
      morningAdhkarTitle: 'د سهار مسنون اذکار',
      morningAdhkarBody: 'د سهار له رڼا سره د خپل رب ذکر، آیة الکرسي او معوذات مه هېروئ.',
      eveningAdhkarTitle: 'د ماښام مسنون اذکار',
      eveningAdhkarBody: 'د ماښام له اذکارو او استغفار سره خپله شپه خوندي او باسکونه کړئ.',
      quranReminderTitle: 'د قرآن کریم ورځنی ورد',
      quranReminderBody: 'نن لا ستاسو د تلاوت هدف پاتې دی؛ څو آیتونه له تفسیره تلاوت کړئ.',
      fridayReminderTitle: 'د جمعې مبارکه ورځ',
      fridayReminderBody: 'نن جمعه ده! سورت الکهف تلاوت کړئ او پر نبي کریم ﷺ ډېر درود شریف ووایاست.',
      eventReminderTitle: 'راتلونکې اسلامي مناسبه',
      taskReminderTitle: 'د دندې یادونه',
      welcomeNotifTitle: 'خبرتیاوې فعالې شوې',
      welcomeNotifBody: 'ستاسو د نن ورځې د لمانځه، اذکارو، تلاوت او دندو مهالویش په اوتومات ډول فعال شو.',
    },
    assistantModule: {
      title: 'د ایاد مرستیال',
      subtitle: 'د قرآن، حدیث، عبادت او اسلامي مطالعې هوښیار آفلاین او آنلاین ملګری',
      placeholder: 'خپله پوښتنه ولیکئ (د بېلګې په توګه: د سهار د اذکارو فضیلت څه دی؟)...',
      send: 'لېږل',
      offlineLocalNotice: 'آفلاین علمي حالت فعال دی — پوښتنې ستاسو له محلّي قرآن، حدیث، اذکارو او کتابتون سرچینو ځوابیږي.',
      scholarlyNotice: 'یادونه: دا مرستیال شرعي فتوا نه صادروي؛ د مهمو فقهي مسایلو لپاره معتبر عالم ته مراجعه وکړئ.',
      quickPrompts: [
        'د سورت الفاتحة لنډ تفسیر راته بیان کړه',
        'د ورځني قرآن او اذکارو یو منظم پلان راته جوړ کړه',
        'د امانت او رښتینولۍ په اړه صحیح حدیث له سرچینې سره وښیه',
        'د لمانځه د خشوع لپاره عملي لارښوونې راکړه',
      ],
    },
    settingsModule: {
      appearance: 'بڼه او لیک‌بڼه',
      language: 'ژبه',
      theme: 'د اپلیکیشن تیم',
      wallpaper: 'د شیشې تر شا انځور (بګرونډ)',
      fontFamily: 'د عربي خط ډول',
      fontSize: 'د متن اندازه',
      lineSpacing: 'د کرښو ترمنځ فاصله',
      customBgTint: 'د شالید ځانګړی رنګ',
      tints: {
        default: 'اصلي',
        ivory: 'عاجي کاغذ',
        mint: 'نرم شین',
        cream: 'کریمي',
        slate: 'آسماني خړ',
        forest: 'تیاره شین',
      },
      securityBackup: 'محرمیت، پټ کوډ او خوندي بیک اپ',
      encryptedNote: 'خوندي کوډ شوې نسخه',
      createBackup: 'خوندي بیک اپ جوړول',
      restoreBackup: 'بیک اپ بېرته راوستل',
      backupPassword: 'د کوډګذارۍ پټنوم (اختیاري)',
      restoreConfirm: 'د بیک اپ راوستل به اوسني معلومات بدل کړي. آیا ډاډه یاست؟',
      statsPin: 'د احصائیو پټ کوډ',
      setPin: 'کوډ تنظیمول',
      pinSaved: 'پټ کوډ ثبت شو',
      pinCleared: 'پټ کوډ پاک شو',
      unlockStats: 'د احصائیو د کتلو لپاره پټ کوډ داخل کړئ',
      wrongPin: 'پټ کوډ ناسم دی.',
      deleteAllData: 'ټول محلّي معلومات پاکول',
      deleteConfirm: 'آیا ډاډه یاست چې غواړئ ټول ثبت شوي معلومات حذف کړئ؟',
      aboutTitle: 'د اپلیکیشن په اړه',
      version: 'نسخه',
      checkUpdates: 'د نوي اپډېټ کتنه',
      upToDate: 'ستاسو اپلیکیشن پر وروستۍ نسخه دی.',
    },
    adminModule: {
      subtitle: 'د معتبرو اسلامي موادو بیاکتنه او د نسخې مدیریت',
      tabs: {
        hadith: 'حدیث',
        book: 'کتاب',
        announcement: 'اعلان',
      },
      collectionNames: {
        bukhari: 'صحیح البخاري',
        muslim: 'صحیح مسلم',
        abudawud: 'سنن أبي داود',
        tirmidhi: 'جامع الترمذي',
        nasai: 'سنن النسائي',
        ibnmajah: 'سنن ابن ماجه',
        malik: 'موطأ مالک',
        nawawi40: 'الأربعون النووية',
        adab: 'الأدب المفرد',
        qudsi: 'قدسي احادیث',
      },
      arabicTextPlaceholder: 'د حدیث عربي متن ولیکئ...',
      translationPlaceholder: 'د حدیث پښتو ژباړه ولیکئ...',
      sourceRequiredPlaceholder: 'معتبره سرچینه (حتمي ده)...',
      bookTitlePlaceholder: 'د کتاب نوم',
      bookAuthorPlaceholder: 'لیکوال',
      bookContentPlaceholder: 'د کتاب متن...',
      publishAnnouncementTitle: 'خبرتیا یا د نسخې اعلان خپرول',
      announcementTitlePlaceholder: 'سرلیک',
      announcementBodyPlaceholder: 'د خبرتیا تفصیل...',
      reviewedLabel: 'بیاکتل شوی',
      seeSourceLabel: 'سرچینه وګورئ',
      adminEditionLabel: 'بیاکتل شوې نسخه',
      permittedLabel: 'مباح او آزاد علمي متن',
    },
    aboutModule: {
      pageTitle: 'د اپلیکیشن او جوړوونکي په اړه',
      developerLabel: 'د اپلیکیشن جوړوونکی',
      developerName: 'طالب العلم خبیب تکل',
      developerRole: 'د شرعي او عصري علومو طالب‌العلم · د اسلامي ډیجیټل خدمتونو خادم',
      essayTitle: 'د اپلیکیشن د جوړوونکي په اړه لیکنه',
      essayParagraphs: [
        'إِيَادُ المُسْلِم – د مسلمان ملګری د طالب العلم خبیب تکل له خوا په خالص نیت، علمي امانت‌دارۍ او د امت مسلمه د ورځني عبادتي او علمي خدمت په موخه طرحه او جوړ شوی دی.',
        'نن ورځ ډېری مسلمانان د قرآن کریم د تلاوت، تفسیر، حدیث، اذکارو، د لمانځه د وختونو، قبلې، کتابتون او ورځنیو کارونو د تنظیم لپاره بېلابېلو جلا اپلیکیشنونو ته اړتیا لري، چې ډېری یې له اعلانونو ډک یا له انټرنېټ پرته بې‌کاره وي. طالب العلم خبیب تکل دا ستونزه درک کړه او دا جامع اسلامي ملګری یې داسې ډیزاین کړ چې پاک، له اعلانونو خالي، آفلاین محوره او د باوري علمي سرچینو پر بنسټ ولاړ وي.',
        'د دې پروژې په جوړولو کې کوښښ شوی چې د پښتو، عربي، فارسي او انګلیسي ژبو ویونکو لپاره اسانه، آرام‌بښونکی او هر اړخیز چاپېریال برابر شي، تر څو هر مسلمان ورور او خور وکولای شي خپل عبادت، مطالعه او ورځنی ژوند په نظم او اخلاص پرمخ بوځي.',
      ],
      pillarsTitle: 'د إِيَادُ المُسْلِم اساسي ارزښتونه',
      pillars: [
        'له هېڅ ډول اعلانونو پرته پاک عبادتي چاپېریال',
        'د قرآن او صحیحو احادیثو په نقل کې علمي دقت او سرچینه ښوونه',
        'د کاروونکي بشپړ محرمیت او بشپړ آفلاین ملاتړ',
        'د پښتو، عربي، فارسي او انګلیسي ژبو خالص او بشپړ ملاتړ',
      ],
      closingDua: 'اللَّهُمَّ تَقَبَّلْ هَذَا الْعَمَلَ خَالِصًا لِوَجْهِكَ الْكَرِيمِ، وَانْفَعْ بِهِ طَالِبَ الْعِلْمِ خُبَيْب تَكَل وَوَالِدَيْهِ وَمَشَايِخَهُ وَجَمِيعَ الْمُسْلِمِينَ.',
      replaySplash: 'د پیل پاڼه بیا وګورئ',
      privacyTitle: 'د محرمیت تګلاره او د معلوماتو خوندیتوب',
      privacyBody: 'دا اپلیکیشن هېڅ اعلانونه او تعقیبوونکي کوډونه نلري. ستاسو ټول معلومات یوازې ستاسو پر موبایل کې خوندي پاتې کېږي.',
      openPrivacyPolicy: 'بشپړه د محرمیت تګلاره لوستل',
      dataSafetyTitle: 'د Play Store د محرمیت ضمانت',
      dataSafetyItems: [
        'له اعلانونو او درېیمګړو تعقیب څخه ۱۰۰٪ پاک',
        'شخصي معلومات یوازې په محلي ډول ستاسو پر وسیله ساتل کېږي',
        'موقعیت او خبرتیاوې یوازې ستاسو په اختیاري اجازې سره کار کوي',
        'هر وخت د معلوماتو بشپړ پاکولو او بیک‌اپ اخیستلو اختیار',
      ],
      shareApp: 'اپلیکیشن شریک کړئ',
      shareCopied: 'د اپلیکیشن لینک کاپي شو',
      playStoreReadyTitle: 'د Play Store خپرولو چمتووالی',
      playStoreChecklist: [
        'لوړ کیفیت ایکنونه (۱۹۲×۱۹۲، ۵۱۲×۵۱۲ او Maskable) او PWA منیفیسټ بشپړ دي',
        'په بشپړ ډول آفلاین کار کوي (۴۱ سورتونه، ۵۰ احادیث، ۹۱ اذکار او ۳۲ کتابونه)',
        'د محرمیت رسمي پاڼه (/privacy.html) او د Android چټک لنډلارونه چمتو دي',
        'بشپړ RTL/LTR او د ۱۰ شیشه‌يي تیمونو او ۶ اسلامي بګرونډونو ملاتړ',
      ],
    },
    themes: {
      light: 'روښانه',
      dark: 'تیاره',
      system: 'د سیستم مطابق',
      emerald: 'اسلامي شین',
      gold: 'شاهي طلایي',
      'islamic-blue': 'اسلامي آبي',
      'minimal-white': 'ساده سپین',
      'night-black': 'د شپې تور',
      'desert-sand': 'د دښتې شګه',
      'royal-islamic': 'شاهي اسلامي',
    },
    hijriMonths: [
      'محرم',
      'صفر',
      'ربيع الأول',
      'ربيع الثاني',
      'جمادى الأولى',
      'جمادى الآخرة',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذو القعدة',
      'ذو الحجة',
    ],
    weekdays: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  },
  ar: {
    appName: 'إِيَادُ المُسْلِم',
    appSubtitle: 'رفيق المسلم الشامل',
    welcome: 'أهلاً بك',
    greetingPrefix: 'السلام عليكم،',
    offlineBanner: 'وضع عدم الاتصال — كافة الموارد المحلية تعمل دون إنترنت',
    onlineStatus: 'متصل',
    offlineStatus: 'دون إنترنت',
    installApp: 'تثبيت التطبيق',
    installIOS: 'التثبيت على آيفون',
    iosInstallSteps: '١. اضغط على زر المشاركة ← ٢. اختر إضافة إلى الشاشة الرئيسية.',
    offlineZeroAdsBadge: 'يعمل دون إنترنت · خالٍ من الإعلانات',
    versionPrefix: 'إصدار',
    gpsLabel: 'تحديد تلقائي',
    kmUnit: 'كم',
    daysShortUnit: 'يوم',
    hijriYearSuffix: 'هـ',
    languageNames: {
      ps: 'البشتو',
      ar: 'العربية',
      fa: 'الفارسية',
      en: 'الإنجليزية',
    },
    fontNames: {
      'plus-amiri': 'أميري وجاكارتا',
      naskh: 'نسخ العربي',
      scheherazade: 'شهرزاد الجديد',
      kufi: 'كوفي العربي',
      lateef: 'لطيف الكلاسيكي',
      vazirmatn: 'وزيرمتن العصري',
    },
    nav: {
      dashboard: 'الرئيسية',
      quran: 'القرآن والتفسير',
      dictionary: 'معجم كلمات القرآن',
      hadith: 'مكتبة الحديث',
      adhkar: 'الأذكار والأوراد',
      tasbeeh: 'المسبحة الإلكترونية',
      duas: 'أدعيتي الخاصة',
      prayer: 'مواقيت الصلاة',
      qibla: 'اتجاه القبلة',
      mosques: 'المساجد القريبة',
      library: 'المكتبة الإسلامية',
      quotes: 'الرقائق والآثار',
      zakat: 'حاسبة الزكاة',
      calendar: 'التقويم الهجري',
      tasks: 'المهام اليومية',
      routines: 'الروتين التعبدي',
      statistics: 'الإحصائيات',
      assistant: 'مساعد إِيَاد',
      search: 'البحث الشامل',
      notifications: 'مركز الإشعارات',
      settings: 'الإعدادات والنسخ الاحتياطي',
      about: 'عن المطوّر',
      admin: 'الإدارة والمراجعة',
      moreModules: 'كافة الأقسام',
    },
    navGroups: {
      worship: 'العبادة والمواقيت',
      quranHadith: 'القرآن والحديث والذكر',
      knowledgeTools: 'المعرفة والمكتبة والتخطيط',
      system: 'الإعدادات والمساعدة',
    },
    common: {
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      search: 'بحث...',
      filter: 'تصفية',
      all: 'الكل',
      copy: 'نسخ',
      copied: 'تم النسخ',
      share: 'مشاركة',
      download: 'تحميل',
      downloaded: 'محمّل',
      offlineReady: 'متاح دون إنترنت',
      localCacheLabel: 'محفوظ محلياً',
      bookmark: 'إشارة مرجعية',
      favorite: 'مفضلة',
      favorites: 'المفضلة',
      bookmarks: 'الإشارات',
      close: 'إغلاق',
      confirm: 'تأكيد',
      reset: 'إعادة ضبط',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      loading: 'جاري التحميل...',
      empty: 'لا توجد بيانات مطابقة.',
      source: 'المصدر',
      verified: 'موثّق',
      today: 'اليوم',
      completed: 'مكتمل',
      pending: 'قيد الانتظار',
      yes: 'نعم',
      no: 'لا',
      exportCard: 'بطاقة مشاركة',
      enable: 'تفعيل',
      disable: 'تعطيل',
      apply: 'تطبيق',
      total: 'الإجمالي',
    },
    onboarding: {
      title: 'إِيَادُ المُسْلِم – رفيق المسلم',
      subtitle: 'تطبيق إسلامي شامل للقرآن والحديث والأذكار ومواقيت الصلاة والمكتبة والمهام — يعمل دون إنترنت وبلا إعلانات.',
      chooseLang: 'اختر اللغة',
      chooseTheme: 'اختر السمة البصرية',
      yourName: 'الاسم الكريم',
      namePlaceholder: 'مثال: عبد الله',
      defaultUserName: 'أخي المسلم',
      locationOpt: 'الموقع الجغرافي لمواقيت الصلاة (اختياري)',
      locationDesc: 'يُستخدم موقعك محلياً لحساب مواقيت الصلاة والقبلة والمساجد القريبة فقط.',
      allowLocation: 'السماح بالموقع',
      notifOpt: 'تنبيهات الصلاة والأذكار (اختياري)',
      notifDesc: 'تفعيل الإشعارات للتذكير بأوقات الصلاة وأذكار الصباح والمساء.',
      allowNotif: 'تفعيل الإشعارات',
      noSignupNote: 'تُحفظ كافة بياناتك محلياً بأمان دون الحاجة لتسجيل حساب.',
      startApp: 'ابدأ الاستخدام',
    },
    dashboard: {
      hijriDate: 'التاريخ الهجري',
      gregorianDate: 'التاريخ الميلادي',
      nextPrayer: 'الصلاة القادمة',
      prayerSummary: 'صلوات اليوم',
      adhkarProgress: 'تقدم الأذكار',
      quranProgress: 'ورد القرآن',
      tasksProgress: 'إنجاز المهام',
      dailyGoals: 'الأهداف اليومية',
      dailyHadith: 'حديث اليوم',
      dailyAyah: 'آية اليوم',
      dailyDua: 'دعاء اليوم',
      recommendedBook: 'كتاب مقترح',
      upcomingEvent: 'المناسبة الإسلامية القادمة',
      quickAccess: 'الوصول السريع',
      carouselTitle: 'إشراقات يومية',
      carouselPaused: 'العرض متوقف مؤقتاً',
      carouselPlaying: 'يتبدل تلقائياً كل ١٠ ثوانٍ',
      daysLeft: 'يوماً متبقياً',
      ayahsRemaining: 'آية متبقية',
      asrSurahRef: 'سورة العصر · ١-٣',
    },
    prayers: {
      fajr: 'الفجر',
      sunrise: 'الشروق',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء',
      city: 'المدينة',
      detectLocation: 'تحديد الموقع تلقائياً',
      calcMethod: 'طريقة الحساب',
      madhab: 'مذهب صلاة العصر',
      hanafi: 'الحنفي',
      shafi: 'الجمهور (الشافعي والمالكي والحنبلي)',
      adjustments: 'تعديل الدقائق يدوياً',
      monthlyCalendar: 'التقويم الشهري',
      adhanAlert: 'تنبيه الأذان',
      markPrayed: 'تسجيل الأداء',
      prayed: 'أُدّيت',
      manualLocation: 'اختيار المدينة يدوياً',
      selectCity: 'اختر مدينة',
      methods: {
        Karachi: 'جامعة العلوم الإسلامية بكراتشي',
        MuslimWorldLeague: 'رابطة العالم الإسلامي',
        UmmAlQura: 'تقويم أم القرى (مكة المكرمة)',
        Egyptian: 'الهيئة المصرية العامة للمساحة',
        NorthAmerica: 'الجمعية الإسلامية لأمريكا الشمالية',
        Tehran: 'معهد الجيوفيزياء بطهران',
      },
    },
    qiblaModule: {
      northShort: 'ش',
      southShort: 'ج',
      eastShort: 'شر',
      westShort: 'غ',
      makkahLabel: 'مكة المكرمة',
      compassHeading: 'اتجاه البوصلة',
      bearingTrueNorth: 'الزاوية من الشمال الحقيقي',
      enableSensor: 'تفعيل مستشعر البوصلة',
      sensorMissingTitle: 'لم يتم اكتشاف مستشعر البوصلة في هذا الجهاز',
      sensorMissingDesc: 'اجعل الشمال الحقيقي عند ٠ درجة واتجه بمقدار الزاوية الظاهرة نحو الكعبة المشرفة.',
      calibrationTitle: 'إرشادات معايرة البوصلة',
      calibrationSteps: '١. أبعد الهاتف عن الأجسام المعدنية والمغناطيس. ٢. حرّك الجهاز على شكل رقم ثمانية في الهواء. ٣. فعّل تحديد الموقع للحصول على أدق زاوية.',
      worldCitiesTitle: 'زوايا القبلة لأشهر المدن الإسلامية والعالمية',
      previewDialLabel: 'معاينة وتدوير الاتجاه يدوياً',
    },
    mosquesModule: {
      offlineRadarTitle: 'خريطة المساجد القريبة دون إنترنت',
      offlineRadarDesc: 'المساجد المحفوظة مرتبة حسب المسافة والاتجاه من موقعك',
      openDirections: 'عرض الاتجاهات',
      sourceLabel: 'بيانات الخرائط المفتوحة والذاكرة المحلية',
      youAreHere: 'موقعك الحالي',
      ringLabel: 'نطاق',
    },
    quranModule: {
      surahWord: 'سورة',
      juzWord: 'جزء',
      surahs: 'السور (١١٤)',
      juzs: 'الأجزاء (٣٠)',
      meccan: 'مكية',
      medinan: 'مدنية',
      ayahs: 'آيات',
      readingMode: 'وضع التلاوة',
      studyMode: 'وضع الدراسة والتفسير',
      nightMode: 'الوضع الليلي',
      tafsir: 'التفسير والبيان',
      tafsirMuyassar: 'التفسير الميسر',
      tafsirIbnKathir: 'تفسير ابن كثير',
      tafsirJalalayn: 'تفسير الجلالين',
      defaultTafsirSource: 'التفسير الميسر — مجمع الملك فهد',
      lexicalMeaning: 'المعنى اللغوي',
      asbabNuzul: 'أسباب النزول',
      lastRead: 'آخر موضع قراءة',
      continueReading: 'متابعة التلاوة',
      dailyGoal: 'الهدف اليومي',
      khatmah: 'متابعة الختمة',
      downloadOffline: 'تحميل للقراءة دون إنترنت',
      downloadAllOffline: 'تحميل السور الأساسية',
      reciter: 'القارئ',
      speed: 'السرعة',
      repeat: 'تكرار',
      searchAyahs: 'ابحث في الآيات...',
      shareCard: 'بطاقة آية مصورة',
      wordDictionary: 'كلمات القرآن',
      cacheAudioBtn: 'حفظ التلاوة الصوتية محلياً',
      audioCachedBadge: 'التلاوة محفوظة دون إنترنت',
      offlineSpeechPlay: 'قراءة صوتية محلية',
      offlineSpeechStop: 'إيقاف الصوت',
    },
    hadithModule: {
      collections: 'دواوين السنة',
      narrator: 'الراوي',
      grade: 'الدرجة',
      chapter: 'الباب',
      hadithNum: 'رقم الحديث',
      commentary: 'الشرح والفوائد',
      hadithOfDay: 'حديث اليوم',
      authenticityNotice: 'جميع الأحاديث موثقة بالمصدر والدرجة من الأمهات المعتمدة.',
      topics: 'الموضوعات',
      topicLabels: {
        'Sincerity & Intention': 'الإخلاص والنية',
        'Ihsan & Worship': 'الإحسان والعبادة',
        'Quran & Teaching': 'القرآن وتعليمه',
        'Brotherhood & Heart': 'الأخوة وسلامة القلب',
        'Knowledge & Help': 'طلب العلم وإعانة الناس',
        'Patience & Gratitude': 'الصبر والشكر',
        'Mercy & Character': 'الرحمة وحسن الخلق',
        'Trustworthiness & Honesty': 'الأمانة والصدق',
        'Seeking Knowledge': 'طلب العلم النافع',
        'Taqwa & Character': 'التقوى ومكارم الأخلاق',
        'Character & Mindful Living': 'الأخلاق والورع',
        'Dhikr & Gratitude': 'الذكر والشكر',
        'Worship & Prayer': 'العبادة والصلاة',
        'Safety & Trust': 'كف الأذى والأمانة',
        'Charity & Blessing': 'الصدقة والبركة',
        Repentance: 'التوبة والاستغفار',
        'Sincere Devotion': 'الإخلاص والعبودية',
        Character: 'حسن الخلق',
        'Forgiveness & Brotherhood': 'العفو والأخوة',
        'Quran & Sunnah': 'الكتاب والسنة',
        Brotherhood: 'الأخوة الإيمانية',
        'Lawful & Pure Heart': 'الكسب الحلال وصلاح القلب',
        'Trust in Allah': 'التوكل على الله',
        'Family & Parents': 'بر الوالدين والأسرة',
        'Neighborhood & Ethics': 'حق الجار والآداب',
        'Kindness & Charity': 'الرفق والصدقة',
        'Dhikr & Hope': 'الذكر وحسن الظن بالله',
        'Justice & Mercy': 'العدل وتحريم الظلم',
        'Divine Mercy': 'سعة رحمة الله',
        Reviewed: 'مُراجع',
      },
      gradeLabels: {
        'صحيح (متفق عليه)': 'صحيح (متفق عليه)',
        صحيح: 'صحيح',
        'صحيح (الترمذي والألباني)': 'صحيح (الترمذي والألباني)',
        'صحيح (الألباني وحسنه الترمذي)': 'صحيح (الألباني وحسنه الترمذي)',
        'صحيح (الترمذي والحاكم)': 'صحيح (الترمذي والحاكم)',
        'صحيح (الترمذي وابن حبان)': 'صحيح (الترمذي وابن حبان)',
        'صحيح لغيره (السيوطي والألباني)': 'صحيح لغيره',
        'حسن صحيح': 'حسن صحيح',
        'حسن صحيح (النووي والألباني)': 'حسن صحيح',
        'حسن (الترمذي والحاكم)': 'حسن (الترمذي والحاكم)',
        'حسن (الترمذي وابن ماجه)': 'حسن (الترمذي وابن ماجه)',
        'حسن لغيره (الموطأ والحاكم)': 'حسن لغيره',
      },
    },
    dictionaryModule: {
      learningHistory: 'سجل التعلم',
    },
    duasModule: {
      categories: {
        Personal: 'شخصي',
        Family: 'الأسرة',
        Knowledge: 'العلم النافع',
        Rizq: 'الرزق الحلال',
        Healing: 'الشفاء والعافية',
      },
      translationPlaceholder: 'الترجمة أو المعنى...',
      notesPlaceholder: 'ملاحظات ووقت الدعاء...',
    },
    libraryModule: {
      subtitleSuffix: 'كتب ومستندات إسلامية محلية',
      addDocumentBtn: 'إضافة كتاب رقمي',
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      fullscreen: 'ملء الشاشة',
      pageLabel: 'صفحة',
      pageShort: 'ص',
      volumeShort: 'مجلد',
      localUserDoc: 'مستند محلي',
      publicDomainLabel: 'نص علمي متاح للعموم',
      sizeUnitMB: 'م.ب',
      chapterLabel: 'فصل',
      chaptersListTitle: 'فهرس فصول الكتاب',
      aboutAuthorLabel: 'نبذة عن المؤلف',
    },
    quotesModule: {
      authenticityBanner: 'أقوال العلماء وآثار الصحابة مفصولة تماماً عن الأحاديث النبوية وموثقة بالكتاب والجزء والصفحة.',
    },
    zakatModule: {
      cash: 'النقد والأرصدة البنكية',
      goldGrams: 'الذهب (بالغرام)',
      goldPricePerGram: 'سعر غرام الذهب',
      silverGrams: 'الفضة (بالغرام)',
      silverPricePerGram: 'سعر غرام الفضة',
      businessGoods: 'عروض التجارة',
      otherAssets: 'أصول زكوية أخرى',
      debts: 'الديون والالتزامات المستحقة',
      nisabStandard: 'معيار النصاب',
      goldStandard: 'نصاب الذهب (٨٥ غرام)',
      silverStandard: 'نصاب الفضة (٥٩٥ غرام)',
      goldShort: 'الذهب',
      silverShort: 'الفضة',
      nisabLabel: 'النصاب',
      calculate: 'احسب الزكاة',
      resultTitle: 'نتيجة حساب الزكاة',
      totalAssets: 'إجمالي الأصول',
      netZakatable: 'الوعاء الزكوي الصافي',
      zakatDue: 'الزكاة الواجبة (٢.٥٪)',
      belowNisab: 'المال دون النصاب ولا تجب فيه الزكاة.',
      fiqhNote: 'تنبيه فقهي: يأخذ الحنفية بنصاب الفضة في النقود احتياطاً للفقراء بينما يرى الجمهور نصاب الذهب؛ استشر أهل العلم في المسائل المركبة.',
      history: 'سجل الحسابات',
      currencies: {
        USD: 'دولار أمريكي',
        AFN: 'أفغاني',
        SAR: 'ريال سعودي',
        EUR: 'يورو',
      },
      recipientsTitle: 'مصارف الزكاة الثمانية الشرعية',
      recipientsVerseRef: 'سورة التوبة (الآية ٦٠)',
      recipients: [
        'الفقراء (الذين لا يملكون الكفاية الأساسية)',
        'المساكين (أشد حاجة وضيقاً في المعاش)',
        'العاملون عليها (المكلفون بجمعها وتوزيعها)',
        'المؤلفة قلوبهم (تأليف القلوب على الإسلام)',
        'في الرقاب (فك الأسرى والرقاب)',
        'الغارمون (المثقلون بالديون المباحة)',
        'في سبيل الله (وجوه الخير ونشر الدين)',
        'ابن السبيل (المسافر المنقطع عن ماله)',
      ],
      fitrTitle: 'تذكير بزكاة الفطر',
      fitrDesc: 'تجب قبل صلاة عيد الفطر عن كل مسلم يملك قوت يومه وليلته، ومقدارها صاع من غالب قوت البلد (أو قيمته عند من يجيزها من الفقهاء).',
    },
    calendarModule: {
      sightingNote: 'ملاحظة: التاريخ المعروض يعتمد على الحساب الفلكي، أما دخول الأشهر الشرعية فيعتمد على الرؤية الشرعية الرسمية.',
      eventsTitle: 'المناسبات الإسلامية',
      ramadan: 'غرة رمضان المبارك (١ رمضان)',
      laylatulQadr: 'العشر الأواخر وليلة القدر (٢٧ رمضان)',
      eidFitr: 'عيد الفطر المبارك (١ شوال)',
      dhulHijjahTen: 'أيام عشر ذي الحجة المباركة (١ ذو الحجة)',
      arafah: 'يوم عرفة (٩ ذو الحجة)',
      eidAdha: 'عيد الأضحى المبارك (١٠ ذو الحجة)',
      ashura: 'يوم عاشوراء (١٠ محرم)',
      tasua: 'يوم تاسوعاء (٩ محرم)',
      hijriNewYear: 'رأس السنة الهجرية (١ محرم)',
      rabiAwwal12: 'ذكرى السيرة النبوية (١٢ ربيع الأول)',
      israMiraj: 'ذكرى الإسراء والمعراج (٢٧ رجب)',
      midShaban: 'النصف من شعبان (١٥ شعبان)',
      friday: 'يوم الجمعة',
      hijriMonthsCount: 'الأشهر الهجرية (١٢)',
      fastingIndicatorsTitle: 'تنبيه الصيام المسنون اليوم',
      ayyamAlBidLabel: 'الأيام البيض (١٣، ١٤، ١٥ من الشهر الهجري)',
      sunnahFastMonThu: 'صيام سنتي الاثنين والخميس',
    },
    tasksModule: {
      views: {
        today: 'اليوم',
        upcoming: 'القادمة',
        overdue: 'المتأخرة',
        completed: 'المكتملة',
        all: 'الكل',
      },
      priorities: {
        high: 'أولوية عالية',
        medium: 'متوسطة',
        low: 'عادية',
      },
      recurrences: {
        none: 'مرة واحدة',
        daily: 'يومياً',
        weekly: 'أسبوعياً',
        monthly: 'شهرياً',
      },
      descPlaceholder: 'تفاصيل وملاحظات المهمة...',
    },
    statsModule: {
      localRealData: 'بيانات عبادية وإنتاجية محلية حقيقية ١٠٠٪',
      lockBtn: 'قفل',
      weeklyChartTitle: 'نشاط العبادة والمطالعة خلال ٧ أيام',
      pinPlaceholder: 'الرمز السري',
      pinLengthHint: '٤ أحرف أو أرقام على الأقل',
    },
    notificationsModule: {
      morningAdhkarLabel: 'أذكار الصباح',
      eveningAdhkarLabel: 'أذكار المساء',
      unreadLabel: 'إشعارات غير مقروءة',
      markAllRead: 'تحديد الكل كمقروء',
      clearRead: 'مسح المقروءة',
      testAlert: 'تجربة التنبيه والصوت',
      checkReminders: 'فحص التذكيرات الآن',
      prefsTitle: 'تفضيلات التنبيهات',
      scheduledTodayTitle: 'جدول تذكيرات اليوم',
      filterAll: 'الكل',
      filterUnread: 'غير مقروءة',
      openModule: 'فتح القسم',
      soundChime: 'نغمة تنبيه هادئة',
      permissionGranted: 'تنبيهات المتصفح مفعّلة',
      permissionDefault: 'لم تُمنح إذن المتصفح بعد — التنبيهات الداخلية فعالة',
      permissionBlocked: 'حظر المتصفح التنبيهات الخارجية — التنبيهات الداخلية نشطة وتعمل',
      permissionUnsupported: 'المتصفح يدعم التنبيهات الداخلية داخل التطبيق',
      inAppFallbackNote: 'تُحفظ التنبيهات وتُعرض مباشرة في أعلى الشاشة مع نغمة هادئة دون الحاجة للإنترنت.',
      testTitle: 'اختبار تنبيهات إِيَادُ المُسْلِم',
      testBody: 'نظام التنبيهات يعمل بنجاح لتذكيرك بالصلاة والأذكار والقرآن والمهام اليومية.',
      prayerDueTitle: 'حان أو اقترب موعد الصلاة',
      prayerDueBody: 'تأهب للوضوء وإقامة الصلاة في وقتها.',
      morningAdhkarTitle: 'تذكير بأذكار الصباح',
      morningAdhkarBody: 'حصّن يومك بتلاوة أذكار الصباح المسنونة وآية الكرسي.',
      eveningAdhkarTitle: 'تذكير بأذكار المساء',
      eveningAdhkarBody: 'لا تنسَ أذكار المساء والمعوذات والاستغفار قبل الغروب أو بعده.',
      quranReminderTitle: 'وردك اليومي من القرآن الكريم',
      quranReminderBody: 'بقي من هدفك اليومي آيات يسيرة — بادر بتلاوتها وتدبرها.',
      fridayReminderTitle: 'فضل يوم الجمعة المبارك',
      fridayReminderBody: 'اليوم الجمعة! لا تنسَ قراءة سورة الكهف والإكثار من الصلاة على النبي ﷺ.',
      eventReminderTitle: 'مناسبة إسلامية قادمة',
      taskReminderTitle: 'تذكير بمهمة مستحقة',
      welcomeNotifTitle: 'تم تفعيل نظام التنبيهات',
      welcomeNotifBody: 'مراقب الصلاة والأذكار والورد القرآني والمهام اليومية يعمل الآن تلقائياً.',
    },
    assistantModule: {
      title: 'مساعد إِيَاد',
      subtitle: 'مساعد معرفي للقرآن والحديث وتنظيم العبادة (يعمل محلياً ودون إنترنت)',
      placeholder: 'اكتب سؤالك هنا...',
      send: 'إرسال',
      offlineLocalNotice: 'وضع البحث المعرفي المحلي نشط — يتم الرد من مصادر القرآن والحديث والأذكار والمكتبة المحفوظة.',
      scholarlyNotice: 'تنبيه: المساعد أداة تعليمية لا تغني عن استشارة العلماء الموثوقين في الفتاوى الشرعية.',
      quickPrompts: [
        'اشرح لي معاني سورة الفاتحة بإيجاز',
        'رتب لي جدولاً يومياً للقرآن والأذكار',
        'اذكر حديثاً صحيحاً في فضل الصدق مع مصدره',
        'ما هي الآداب المعينة على الخشوع في الصلاة؟',
      ],
    },
    settingsModule: {
      appearance: 'المظهر والخطوط',
      language: 'اللغة',
      theme: 'السمة البصرية',
      wallpaper: 'خلفية الزجاج والمشهد الإسلامي',
      fontFamily: 'نوع الخط',
      fontSize: 'حجم الخط',
      lineSpacing: 'تباعد الأسطر',
      customBgTint: 'لون خلفية مخصص',
      tints: {
        default: 'الافتراضي',
        ivory: 'رق عاجي',
        mint: 'نعناع هادئ',
        cream: 'كريمي دافئ',
        slate: 'رمادي بارد',
        forest: 'أخضر داكن',
      },
      securityBackup: 'الخصوصية والنسخ الاحتياطي',
      encryptedNote: 'نسخة مشفرة وآمنة',
      createBackup: 'إنشاء نسخة احتياطية مشفرة',
      restoreBackup: 'استعادة نسخة احتياطية',
      backupPassword: 'كلمة مرور التشفير (اختياري)',
      restoreConfirm: 'ستؤدي الاستعادة إلى استبدال البيانات الحالية. هل أنت متأكد؟',
      statsPin: 'الرمز السري لحماية الإحصائيات',
      setPin: 'تعيين الرمز',
      pinSaved: 'تم حفظ الرمز السري',
      pinCleared: 'تم مسح الرمز السري',
      unlockStats: 'أدخل الرمز السري لعرض الإحصائيات',
      wrongPin: 'الرمز السري غير صحيح.',
      deleteAllData: 'حذف كافة البيانات المحلية',
      deleteConfirm: 'هل أنت متأكد من حذف جميع البيانات المحفوظة محلياً؟',
      aboutTitle: 'حول التطبيق',
      version: 'الإصدار',
      checkUpdates: 'التحقق من التحديثات',
      upToDate: 'التطبيق محدث إلى أحدث إصدار.',
    },
    adminModule: {
      subtitle: 'مراجعة وتوثيق المحتوى الإسلامي وإدارة الإصدارات',
      tabs: {
        hadith: 'حديث',
        book: 'كتاب',
        announcement: 'إعلان',
      },
      collectionNames: {
        bukhari: 'صحيح البخاري',
        muslim: 'صحيح مسلم',
        abudawud: 'سنن أبي داود',
        tirmidhi: 'جامع الترمذي',
        nasai: 'سنن النسائي',
        ibnmajah: 'سنن ابن ماجه',
        malik: 'موطأ مالك',
        nawawi40: 'الأربعون النووية',
        adab: 'الأدب المفرد',
        qudsi: 'الأحاديث القدسية',
      },
      arabicTextPlaceholder: 'متن الحديث بالعربية...',
      translationPlaceholder: 'بيان أو شرح الحديث...',
      sourceRequiredPlaceholder: 'المصدر الموثق (إلزامي)...',
      bookTitlePlaceholder: 'عنوان الكتاب',
      bookAuthorPlaceholder: 'المؤلف',
      bookContentPlaceholder: 'محتوى الكتاب...',
      publishAnnouncementTitle: 'نشر تحديث أو إعلان جديد',
      announcementTitlePlaceholder: 'العنوان',
      announcementBodyPlaceholder: 'تفاصيل التحديث...',
      reviewedLabel: 'تمت المراجعة',
      seeSourceLabel: 'انظر المصدر',
      adminEditionLabel: 'نسخة مراجعة وموثقة',
      permittedLabel: 'مصدر علمي مباح',
    },
    aboutModule: {
      pageTitle: 'حول التطبيق والمطوّر',
      developerLabel: 'مطوّر التطبيق',
      developerName: 'طالب العلم خبيب تكل',
      developerRole: 'طالب علم شرعي وتقني · خادم المشاريع الإسلامية الرقمية',
      essayTitle: 'كلمة عن مطوّر التطبيق',
      essayParagraphs: [
        'أُنشئ تطبيق «إِيَادُ المُسْلِم – رفيق المسلم الشامل» على يد طالب العلم خبيب تكل بنيةٍ خالصة لخدمة كتاب الله وسنة نبيه ﷺ، وتيسير العبادة وطلب العلم وتنظيم الحياة اليومية للمسلم في منصة رقمية واحدة.',
        'انطلقت فكرة المشروع من الحاجة إلى تطبيق إسلامي موثوق خالٍ من الإعلانات والمشتتات، يعمل دون اتصال بالإنترنت، ويجمع بين القرآن الكريم والتفسير والأحاديث الصحيحة والأذكار ومواقيت الصلاة والقبلة والمكتبة العلمية في واجهة هادئة ومريحة للعين.',
        'حرص طالب العلم خبيب تكل على توثيق المصادر الشرعية، والفصل التام بين الحديث النبوي وأقوال العلماء، ودعم اللغات البشتو والعربية والفارسية والإنجليزية بشكل متكامل.',
      ],
      pillarsTitle: 'مرتكزات تطبيق إِيَادُ المُسْلِم',
      pillars: [
        'بيئة عبادية نقية خالية تماماً من الإعلانات',
        'الالتزام بالأمانة العلمية وتوثيق المصادر',
        'حفظ الخصوصية والعمل دون اتصال بالإنترنت',
        'دعم كامل للغات البشتو والعربية والفارسية والإنجليزية',
      ],
      closingDua: 'اللهم تقبل هذا العمل خالصاً لوجهك الكريم، وبارك لطالب العلم خبيب تكل ولوالديه ومشايخه، واجعله صدقةً جاريةً نافعةً للأمة.',
      replaySplash: 'عرض شاشة الترحيب مرة أخرى',
      privacyTitle: 'سياسة الخصوصية وأمان البيانات',
      privacyBody: 'تطبيق إِيَادُ المُسْلِم خالٍ تماماً من الإعلانات وأكواد التتبع، وتُحفظ بياناتك محلياً على جهازك فقط.',
      openPrivacyPolicy: 'فتح صفحة سياسة الخصوصية',
      dataSafetyTitle: 'ضمان الخصوصية لمتجر Google Play',
      dataSafetyItems: [
        'خالٍ تماماً من الإعلانات أو شبكات التتبع الخارجية',
        'جميع البيانات تُخزن محلياً على جهاز المستخدم دون رفع تلقائي',
        'أذونات الموقع والإشعارات اختيارية ومحصورة في الصلاة والقبلة',
        'إمكانية تصدير نسخة مشفرة أو حذف كافة البيانات بضغطة واحدة',
      ],
      shareApp: 'مشاركة التطبيق',
      shareCopied: 'تم نسخ رابط التطبيق',
      playStoreReadyTitle: 'جاهزية النشر على Google Play',
      playStoreChecklist: [
        'أيقونات متجر Play عالية الدقة وملف التهيئة الكامل للتثبيت',
        'يعمل دون اتصال بالإنترنت مع محتوى شرعي موسع وموثق',
        'صفحة سياسة خصوصية مستقلة (/privacy.html) واختصارات أندرويد جاهزة',
        'واجهة زجاجية حديثة بالكامل مع ١٠ سمات و٦ خلفيات إسلامية',
      ],
    },
    themes: {
      light: 'نهاري فاتح',
      dark: 'ليلي داكن',
      system: 'تلقائي حسب النظام',
      emerald: 'الأخضر الزمردي',
      gold: 'الذهبي الملكي',
      'islamic-blue': 'الأزرق الإسلامي',
      'minimal-white': 'الأبيض البسيط',
      'night-black': 'الأسود الليلي',
      'desert-sand': 'رمال الصحراء',
      'royal-islamic': 'الإسلامي الملكي',
    },
    hijriMonths: [
      'محرم',
      'صفر',
      'ربيع الأول',
      'ربيع الثاني',
      'جمادى الأولى',
      'جمادى الآخرة',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذو القعدة',
      'ذو الحجة',
    ],
    weekdays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  },
  fa: {
    appName: 'إِيَادُ المُسْلِم',
    appSubtitle: 'همراه جامع مسلمان',
    welcome: 'خوش آمدید',
    greetingPrefix: 'السلام علیکم،',
    offlineBanner: 'حالت آفلاین — تمام منابع محلی بدون نیاز به اینترنت در دسترس است',
    onlineStatus: 'آنلاین',
    offlineStatus: 'آفلاین',
    installApp: 'نصب برنامه',
    installIOS: 'نصب در آیفون',
    iosInstallSteps: '۱. دکمه اشتراک‌گذاری را بزنید ← ۲. گزینه افزودن به صفحه اصلی را انتخاب کنید.',
    offlineZeroAdsBadge: 'کاملاً آفلاین · بدون تبلیغات',
    versionPrefix: 'نسخه',
    gpsLabel: 'موقعیت خودکار',
    kmUnit: 'کیلومتر',
    daysShortUnit: 'روز',
    hijriYearSuffix: 'هـ ق',
    languageNames: {
      ps: 'پشتو',
      ar: 'عربی',
      fa: 'فارسی',
      en: 'انگلیسی',
    },
    fontNames: {
      'plus-amiri': 'امیری و مدرن',
      naskh: 'نسخ عربی',
      scheherazade: 'شهرزاد نو',
      kufi: 'کوفی عربی',
      lateef: 'لطیف کلاسیک',
      vazirmatn: 'وزیرمتن مدرن',
    },
    nav: {
      dashboard: 'صفحه اصلی',
      quran: 'قرآن و تفسیر',
      dictionary: 'فرهنگ لغات قرآن',
      hadith: 'کتابخانه حدیث',
      adhkar: 'اذکار و اوراد',
      tasbeeh: 'تسبیح دیجیتال',
      duas: 'دعاهای شخصی',
      prayer: 'اوقات شرعی',
      qibla: 'قبله‌نما',
      mosques: 'مساجد نزدیک',
      library: 'کتابخانه اسلامی',
      quotes: 'رقائق و اقوال علما',
      zakat: 'محاسبه زکات',
      calendar: 'تقویم اسلامی',
      tasks: 'مدیریت کارها',
      routines: 'برنامه روزانه',
      statistics: 'آمار و گزارش',
      assistant: 'دستیار ایاد',
      search: 'جستجوی جامع',
      notifications: 'اعلان‌ها',
      settings: 'تنظیمات و پشتیبان',
      about: 'درباره سازنده',
      admin: 'مدیریت محتوا',
      moreModules: 'سایر بخش‌ها',
    },
    navGroups: {
      worship: 'عبادت و اوقات شرعی',
      quranHadith: 'قرآن، حدیث و اذکار',
      knowledgeTools: 'دانش، کتابخانه و برنامه',
      system: 'تنظیمات و راهنما',
    },
    common: {
      save: 'ذخیره',
      cancel: 'لغو',
      delete: 'حذف',
      edit: 'ویرایش',
      add: 'افزودن',
      search: 'جستجو...',
      filter: 'فیلتر',
      all: 'همه',
      copy: 'کپی',
      copied: 'کپی شد',
      share: 'اشتراک‌گذاری',
      download: 'دانلود',
      downloaded: 'ذخیره شده',
      offlineReady: 'آماده آفلاین',
      localCacheLabel: 'حافظه محلی',
      bookmark: 'نشانه‌گذاری',
      favorite: 'علاقه‌مندی',
      favorites: 'علاقه‌مندی‌ها',
      bookmarks: 'نشانه‌ها',
      close: 'بستن',
      confirm: 'تأیید',
      reset: 'بازنشانی',
      back: 'بازگشت',
      next: 'بعدی',
      previous: 'قبلی',
      loading: 'در حال بارگذاری...',
      empty: 'موردی یافت نشد.',
      source: 'منبع',
      verified: 'تأیید شده',
      today: 'امروز',
      completed: 'تکمیل شده',
      pending: 'در انتظار',
      yes: 'بله',
      no: 'خیر',
      exportCard: 'کارت تصویری',
      enable: 'فعال‌سازی',
      disable: 'غیرفعال',
      apply: 'اعمال',
      total: 'مجموع کل',
    },
    onboarding: {
      title: 'إِيَادُ المُسْلِم – همراه مسلمان',
      subtitle: 'اپلیکیشن جامع اسلامی برای قرآن، حدیث، اذکار، اوقات نماز و برنامه‌ریزی روزانه — بدون تبلیغات و ثبت‌نام اجباری.',
      chooseLang: 'انتخاب زبان',
      chooseTheme: 'انتخاب پوسته برنامه',
      yourName: 'نام شما',
      namePlaceholder: 'مثال: سارا یا یوسف',
      defaultUserName: 'برادر مسلمان',
      locationOpt: 'موقعیت مکانی برای اوقات نماز (اختیاری)',
      locationDesc: 'موقعیت شما فقط روی دستگاه خودتان برای اوقات نماز، قبله و مساجد نزدیک استفاده می‌شود.',
      allowLocation: 'اجازه موقعیت',
      notifOpt: 'یادآوری نماز و اذکار (اختیاری)',
      notifDesc: 'دریافت اعلان برای اوقات نماز و اذکار صبح و شام.',
      allowNotif: 'فعال‌سازی اعلان‌ها',
      noSignupNote: 'تمامی داده‌ها به‌صورت امن در دستگاه شما ذخیره می‌شود.',
      startApp: 'شروع برنامه',
    },
    dashboard: {
      hijriDate: 'تاریخ هجری قمری',
      gregorianDate: 'تاریخ میلادی',
      nextPrayer: 'نماز بعدی',
      prayerSummary: 'اوقات نماز امروز',
      adhkarProgress: 'پیشرفت اذکار',
      quranProgress: 'تلاوت قرآن',
      tasksProgress: 'پیشرفت کارها',
      dailyGoals: 'اهداف روزانه',
      dailyHadith: 'حدیث روز',
      dailyAyah: 'آیه روز',
      dailyDua: 'دعای روز',
      recommendedBook: 'کتاب پیشنهادی',
      upcomingEvent: 'مناسبت اسلامی پیش رو',
      quickAccess: 'دسترسی سریع',
      carouselTitle: 'پیام‌های معنوی',
      carouselPaused: 'متوقف شده',
      carouselPlaying: 'تغییر خودکار هر ۱۰ ثانیه',
      daysLeft: 'روز مانده',
      ayahsRemaining: 'آیه مانده',
      asrSurahRef: 'سوره عصر · ۱-۳',
    },
    prayers: {
      fajr: 'فجر (صبح)',
      sunrise: 'طلوع آفتاب',
      dhuhr: 'ظهر',
      asr: 'عصر',
      maghrib: 'مغرب',
      isha: 'عشاء',
      city: 'شهر',
      detectLocation: 'تشخیص خودکار موقعیت',
      calcMethod: 'روش محاسبه',
      madhab: 'فقه وقت عصر',
      hanafi: 'حنفی',
      shafi: 'جمهور (شافعی، مالکی و حنبلی)',
      adjustments: 'تنظیم دستی دقایق',
      monthlyCalendar: 'جدول ماهانه',
      adhanAlert: 'هشدار اذان',
      markPrayed: 'ثبت نماز',
      prayed: 'خوانده شد',
      manualLocation: 'انتخاب دستی شهر',
      selectCity: 'انتخاب شهر',
      methods: {
        Karachi: 'دانشگاه علوم اسلامی کراچی',
        MuslimWorldLeague: 'رابطه عالم اسلامی',
        UmmAlQura: 'تقویم ام‌القری (مکه مکرمه)',
        Egyptian: 'اداره کل مساحت مصر',
        NorthAmerica: 'انجمن اسلامی آمریکای شمالی',
        Tehran: 'مؤسسه ژئوفیزیک تهران',
      },
    },
    qiblaModule: {
      northShort: 'ش',
      southShort: 'ج',
      eastShort: 'شر',
      westShort: 'غ',
      makkahLabel: 'مکه مکرمه',
      compassHeading: 'زاویه قطب‌نما',
      bearingTrueNorth: 'زاویه از شمال حقیقی',
      enableSensor: 'فعال‌سازی سنسور قطب‌نما',
      sensorMissingTitle: 'سنسور قطب‌نما در این دستگاه یافت نشد',
      sensorMissingDesc: 'شمال حقیقی را بر صفر درجه قرار دهید و مطابق زاویه نمایش‌داده‌شده به سمت مکه مکرمه بایستید.',
      calibrationTitle: 'راهنمای تنظیم سنسور',
      calibrationSteps: '۱. دستگاه را از اشیای فلزی دور نگه دارید. ۲. گوشی را به شکل عدد هشت در هوا بچرخانید. ۳. برای دقت بیشتر موقعیت مکانی را فعال کنید.',
      worldCitiesTitle: 'زاویه قبله شهرهای مشهور جهان اسلام',
      previewDialLabel: 'آزمایش دستی زاویه قبله',
    },
    mosquesModule: {
      offlineRadarTitle: 'نقشه آفلاین مساجد نزدیک',
      offlineRadarDesc: 'مساجد ذخیره شده بر اساس فاصله و جهت از مکان شما',
      openDirections: 'مسیریابی',
      sourceLabel: 'نقشه باز و حافظه محلی دستگاه',
      youAreHere: 'مکان شما',
      ringLabel: 'فاصله',
    },
    quranModule: {
      surahWord: 'سوره',
      juzWord: 'جزء',
      surahs: 'سوره‌ها (۱۱۴)',
      juzs: 'جزءها (۳۰)',
      meccan: 'مکی',
      medinan: 'مدنی',
      ayahs: 'آیه',
      readingMode: 'حالت تلاوت',
      studyMode: 'حالت مطالعه و تفسیر',
      nightMode: 'حالت شب',
      tafsir: 'تفسیر آیه',
      tafsirMuyassar: 'تفسیر روان (المیسر)',
      tafsirIbnKathir: 'تفسیر ابن کثیر',
      tafsirJalalayn: 'تفسیر جلالین',
      defaultTafsirSource: 'تفسیر المیسر — مجمع ملک فهد',
      lexicalMeaning: 'معنای لغوی',
      asbabNuzul: 'شأن نزول',
      lastRead: 'آخرین محل تلاوت',
      continueReading: 'ادامه تلاوت',
      dailyGoal: 'هدف روزانه',
      khatmah: 'پیگیری ختم قرآن',
      downloadOffline: 'دانلود آفلاین',
      downloadAllOffline: 'دانلود سوره‌های منتخب',
      reciter: 'قاری',
      speed: 'سرعت',
      repeat: 'تکرار',
      searchAyahs: 'جستجو در آیات...',
      shareCard: 'ساخت کارت آیه',
      wordDictionary: 'لغات قرآن',
      cacheAudioBtn: 'ذخیره تلاوت صوتی برای آفلاین',
      audioCachedBadge: 'تلاوت صوتی آفلاین آماده است',
      offlineSpeechPlay: 'خوانش صوتی محلی',
      offlineSpeechStop: 'توقف صدا',
    },
    hadithModule: {
      collections: 'کتب حدیث',
      narrator: 'راوی',
      grade: 'درجه صحت',
      chapter: 'باب',
      hadithNum: 'شماره حدیث',
      commentary: 'شرح حدیث',
      hadithOfDay: 'حدیث روز',
      authenticityNotice: 'احادیث با ذکر منبع و درجه از کتب معتبر ثبت شده‌اند.',
      topics: 'موضوعات',
      topicLabels: {
        'Sincerity & Intention': 'اخلاص و نیت',
        'Ihsan & Worship': 'احسان و عبادت',
        'Quran & Teaching': 'قرآن و آموزش آن',
        'Brotherhood & Heart': 'برادری و پاکی دل',
        'Knowledge & Help': 'علم و یاری مؤمنان',
        'Patience & Gratitude': 'صبر و شکرگزاری',
        'Mercy & Character': 'رحمت و اخلاق نیکو',
        'Trustworthiness & Honesty': 'امانت‌داری و راستی',
        'Seeking Knowledge': 'طلب دانش سودمند',
        'Taqwa & Character': 'تقوا و اخلاق',
        'Character & Mindful Living': 'اخلاق و حضور قلب',
        'Dhikr & Gratitude': 'ذکر و سپاسگزاری',
        'Worship & Prayer': 'عبادت و نماز',
        'Safety & Trust': 'امنیت و امانت',
        'Charity & Blessing': 'صدقه و برکت',
        Repentance: 'توبه و استغفار',
        'Sincere Devotion': 'بندگی خالصانه',
        Character: 'اخلاق',
        'Forgiveness & Brotherhood': 'گذشت و برادری',
        'Quran & Sunnah': 'قرآن و سنت',
        Brotherhood: 'برادری ایمانی',
        'Lawful & Pure Heart': 'روزی حلال و قلب سلیم',
        'Trust in Allah': 'توکل بر خداوند',
        'Family & Parents': 'نیکی به والدین',
        'Neighborhood & Ethics': 'همسایه‌داری و ادب',
        'Kindness & Charity': 'مهربانی و انفاق',
        'Dhikr & Hope': 'ذکر و امید به خدا',
        'Justice & Mercy': 'عدالت و مهربانی',
        'Divine Mercy': 'رحمت فراگیر الهی',
        Reviewed: 'تأیید شده',
      },
      gradeLabels: {
        'صحيح (متفق عليه)': 'صحیح (متفق علیه)',
        صحيح: 'صحیح',
        'صحيح (الترمذي والألباني)': 'صحیح (ترمذی و آلبانی)',
        'صحيح (الألباني وحسنه الترمذي)': 'صحیح',
        'صحيح (الترمذي والحاكم)': 'صحیح',
        'صحيح (الترمذي وابن حبان)': 'صحیح',
        'صحيح لغيره (السيوطي والألباني)': 'صحیح لغیره',
        'حسن صحيح': 'حسن صحیح',
        'حسن صحيح (النووي والألباني)': 'حسن صحیح',
        'حسن (الترمذي والحاكم)': 'حسن',
        'حسن (الترمذي وابن ماجه)': 'حسن',
        'حسن لغيره (الموطأ والحاكم)': 'حسن لغیره',
      },
    },
    dictionaryModule: {
      learningHistory: 'تاریخچه یادگیری',
    },
    duasModule: {
      categories: {
        Personal: 'شخصی',
        Family: 'خانواده',
        Knowledge: 'علم و دانش',
        Rizq: 'روزی حلال',
        Healing: 'شفا و عافیت',
      },
      translationPlaceholder: 'ترجمه یا معنای دعا را بنویسید...',
      notesPlaceholder: 'یادداشت و زمان مناسب...',
    },
    libraryModule: {
      subtitleSuffix: 'کتاب‌ها و اسناد اسلامی محلی',
      addDocumentBtn: 'افزودن کتاب دیجیتال',
      zoomIn: 'بزرگ‌نمایی',
      zoomOut: 'کوچک‌نمایی',
      fullscreen: 'تمام صفحه',
      pageLabel: 'صفحه',
      pageShort: 'ص',
      volumeShort: 'جلد',
      localUserDoc: 'سند محلی کاربر',
      publicDomainLabel: 'منبع علمی آزاد',
      sizeUnitMB: 'مگابایت',
      chapterLabel: 'فصل',
      chaptersListTitle: 'فهرست فصل‌های کتاب',
      aboutAuthorLabel: 'معرفی نویسنده',
    },
    quotesModule: {
      authenticityBanner: 'اقوال علما و آثار صحابه به‌طور کامل از احادیث نبوی تفکیک شده و با نام کتاب، جلد و صفحه مستند گردیده‌اند.',
    },
    zakatModule: {
      cash: 'وجه نقد و حساب‌های بانکی',
      goldGrams: 'طلا (گرم)',
      goldPricePerGram: 'قیمت هر گرم طلا',
      silverGrams: 'نقره (گرم)',
      silverPricePerGram: 'قیمت هر گرم نقره',
      businessGoods: 'کالای تجاری',
      otherAssets: 'سایر دارایی‌های زکوی',
      debts: 'بدهی‌های کسرشدنی',
      nisabStandard: 'معیار نصاب',
      goldStandard: 'نصاب طلا (۸۵ گرم)',
      silverStandard: 'نصاب نقره (۵۹۵ گرم)',
      goldShort: 'طلا',
      silverShort: 'نقره',
      nisabLabel: 'نصاب',
      calculate: 'محاسبه زکات',
      resultTitle: 'نتیجه محاسبه زکات',
      totalAssets: 'مجموع دارایی‌ها',
      netZakatable: 'دارایی مشمول زکات',
      zakatDue: 'زکات واجب (۲.۵٪)',
      belowNisab: 'دارایی کمتر از حد نصاب است و زکات ندارد.',
      fiqhNote: 'نکته فقهی: در مذهب حنفی برای پول نقد نصاب نقره جهت نفع فقرا معتبر است، در حالی که جمهور نصاب طلا را ملاک می‌دانند.',
      history: 'تاریخچه محاسبات',
      currencies: {
        USD: 'دلار آمریکا',
        AFN: 'افغانی',
        SAR: 'ریال سعودی',
        EUR: 'یورو',
      },
      recipientsTitle: 'مصارف هشت‌گانه زکات در قرآن',
      recipientsVerseRef: 'سوره توبه (آیه ۶۰)',
      recipients: [
        'فقیران (ندارانی که کفاف زندگی ندارند)',
        'مسکینان (نیازمندان بسیار تنگدست)',
        'کارگزاران جمع‌آوری و توزیع زکات',
        'کسانی که دل‌هایشان به اسلام متمایل می‌شود',
        'آزادی بندگان و اسیران',
        'بدهکاران ناتوان در ادای قرض مشروع',
        'در راه خدا (مصالح دینی، علمی و عمومی)',
        'درراه‌ماندگان سفر (ابن السبیل)',
      ],
      fitrTitle: 'یادآوری زکات فطره',
      fitrDesc: 'پیش از نماز عید فطر بر هر مسلمان توانا به اندازه یک صاع از قوت غالب شهر یا معادل نقدی آن واجب است.',
    },
    calendarModule: {
      sightingNote: 'توجه: تاریخ نمایش داده شده بر اساس محاسبه نجومی است و آغاز رسمی ماه‌های قمری منوط به رؤیت شرعی هلال است.',
      eventsTitle: 'مناسبت‌های اسلامی',
      ramadan: 'آغاز ماه مبارک رمضان (۱ رمضان)',
      laylatulQadr: 'دهه پایانی و شب قدر (۲۷ رمضان)',
      eidFitr: 'عید سعید فطر (۱ شوال)',
      dhulHijjahTen: 'دهه مبارک ذی‌الحجه (۱ ذی‌الحجه)',
      arafah: 'روز عرفه (۹ ذی‌الحجه)',
      eidAdha: 'عید سعید قربان (۱۰ ذی‌الحجه)',
      ashura: 'روز عاشورا (۱۰ محرم)',
      tasua: 'روز تاسوعا (۹ محرم)',
      hijriNewYear: 'آغاز سال نو هجری قمری (۱ محرم)',
      rabiAwwal12: 'یادبود میلاد و سیره پیامبر ﷺ (۱۲ ربیع‌الاول)',
      israMiraj: 'یادبود اسراء و معراج (۲۷ رجب)',
      midShaban: 'نیمه شعبان (۱۵ شعبان)',
      friday: 'روز جمعه',
      hijriMonthsCount: 'ماه‌های هجری قمری (۱۲)',
      fastingIndicatorsTitle: 'نشانه روزه‌های مستحب امروز',
      ayyamAlBidLabel: 'ایام البیض (روزهای ۱۳، ۱۴ و ۱۵ ماه قمری)',
      sunnahFastMonThu: 'روزه سنت دوشنبه و پنجشنبه',
    },
    tasksModule: {
      views: {
        today: 'امروز',
        upcoming: 'پیش رو',
        overdue: 'عقب‌افتاده',
        completed: 'تکمیل شده',
        all: 'همه',
      },
      priorities: {
        high: 'اولویت بالا',
        medium: 'متوسط',
        low: 'عادی',
      },
      recurrences: {
        none: 'یک بار',
        daily: 'روزانه',
        weekly: 'هفتگی',
        monthly: 'ماهانه',
      },
      descPlaceholder: 'توضیحات و یادداشت کار...',
    },
    statsModule: {
      localRealData: 'آمار کاملاً واقعی از فعالیت‌های محلی شما',
      lockBtn: 'قفل کردن',
      weeklyChartTitle: 'فعالیت عبادی و مطالعاتی ۷ روز گذشته',
      pinPlaceholder: 'کد امنیتی',
      pinLengthHint: 'حداقل ۴ کاراکتر یا عدد',
    },
    notificationsModule: {
      morningAdhkarLabel: 'اذکار صبحگاه',
      eveningAdhkarLabel: 'اذکار شامگاه',
      unreadLabel: 'اعلان‌های خوانده‌نشده',
      markAllRead: 'علامت همه به‌عنوان خوانده‌شده',
      clearRead: 'پاک کردن خوانده‌شده‌ها',
      testAlert: 'آزمایش اعلان و صدا',
      checkReminders: 'بررسی یادآوری‌های امروز',
      prefsTitle: 'تنظیمات اعلان‌ها',
      scheduledTodayTitle: 'یادآوری‌های برنامه‌ریزی‌شده امروز',
      filterAll: 'همه',
      filterUnread: 'خوانده‌نشده',
      openModule: 'باز کردن بخش',
      soundChime: 'صدای آرام اعلان',
      permissionGranted: 'اعلان‌های مرورگر فعال است',
      permissionDefault: 'هنوز مجوز مرورگر صادر نشده — اعلان‌های درون‌برنامه‌ای فعالند',
      permissionBlocked: 'اعلان خارجی توسط مرورگر مسدود است — اعلان‌های درون‌برنامه‌ای فعالند',
      permissionUnsupported: 'این مرورگر از اعلان‌های درون‌برنامه‌ای پشتیبانی می‌کند',
      inAppFallbackNote: 'تمام اعلان‌ها به‌صورت خودکار در مرکز اعلان ذخیره شده و در بالای صفحه با صدای ملایم نمایش داده می‌شوند.',
      testTitle: 'آزمایش سیستم اعلان إِيَادُ المُسْلِم',
      testBody: 'سیستم اعلان‌ها فعال است و اوقات نماز، اذکار، قرآن و کارهای روزانه را یادآوری می‌کند.',
      prayerDueTitle: 'وقت نماز فرا رسیده یا نزدیک است',
      prayerDueBody: 'برای وضو و اقامه نماز در وقت فضیلت آماده شوید.',
      morningAdhkarTitle: 'یادآوری اذکار صبحگاه',
      morningAdhkarBody: 'روز خود را با اذکار صبحگاه، آیةالکرسی و معوذات آغاز و بیمه کنید.',
      eveningAdhkarTitle: 'یادآوری اذکار شامگاه',
      eveningAdhkarBody: 'اذکار عصر و شامگاه و استغفار را فراموش نکنید.',
      quranReminderTitle: 'ورد روزانه قرآن کریم',
      quranReminderBody: 'هدف تلاوت امروز شما هنوز کامل نشده است؛ چند آیه با تفسیر بخوانید.',
      fridayReminderTitle: 'فضیلت روز مبارک جمعه',
      fridayReminderBody: 'امروز جمعه است! تلاوت سوره کهف و فرستادن صلوات فراوان بر پیامبر ﷺ را فراموش نکنید.',
      eventReminderTitle: 'مناسبت اسلامی پیش رو',
      taskReminderTitle: 'یادآوری کار زمان‌بندی‌شده',
      welcomeNotifTitle: 'سیستم یادآور فعال شد',
      welcomeNotifBody: 'یادآورهای اوقات نماز، اذکار، ورد قرآن و کارهای روزانه به‌صورت خودکار فعال هستند.',
    },
    assistantModule: {
      title: 'دستیار ایاد',
      subtitle: 'همیار هوشمند قرآن، حدیث و برنامه‌ریزی عبادت (فعال در حالت آفلاین و آنلاین)',
      placeholder: 'سؤال خود را بنویسید...',
      send: 'ارسال',
      offlineLocalNotice: 'حالت دانشی محلی فعال است — پاسخ‌ها از میان قرآن، حدیث، اذکار و کتابخانه آفلاین شما بازیابی می‌شوند.',
      scholarlyNotice: 'توجه: این دستیار ابزار آموزشی است و جایگزین مشورت با عالمان معتبر در فتاوای شرعی نمی‌باشد.',
      quickPrompts: [
        'معانی سوره فاتحه را به اختصار توضیح بده',
        'یک برنامه روزانه منظم برای قرآن و اذکار بساز',
        'یک حدیث صحیح درباره راستگویی با ذکر منبع معرفی کن',
        'آداب و راهکارهای حضور قلب در نماز چیست؟',
      ],
    },
    settingsModule: {
      appearance: 'ظاهر و تایپوگرافی',
      language: 'زبان',
      theme: 'پوسته برنامه',
      wallpaper: 'پس‌زمینه شیشه‌ای و منظره اسلامی',
      fontFamily: 'نوع فونت',
      fontSize: 'اندازه متن',
      lineSpacing: 'فاصله خطوط',
      customBgTint: 'رنگ پس‌زمینه دلخواه',
      tints: {
        default: 'پیش‌فرض',
        ivory: 'کاغذ عاجی',
        mint: 'سبز ملایم',
        cream: 'کرمی گرم',
        slate: 'سربی روشن',
        forest: 'سبز تیره',
      },
      securityBackup: 'حریم خصوصی و پشتیبان‌گیری',
      encryptedNote: 'فایل پشتیبان رمزگذاری شده',
      createBackup: 'ایجاد فایل پشتیبان رمزگذاری‌شده',
      restoreBackup: 'بازیابی پشتیبان',
      backupPassword: 'رمز عبور پشتیبان (اختیاری)',
      restoreConfirm: 'بازیابی پشتیبان داده‌های فعلی را جایگزین می‌کند. ادامه می‌دهید؟',
      statsPin: 'کد امنیتی بخش آمار',
      setPin: 'تنظیم کد',
      pinSaved: 'کد امنیتی ذخیره شد',
      pinCleared: 'کد امنیتی پاک شد',
      unlockStats: 'برای مشاهده آمار کد امنیتی را وارد کنید',
      wrongPin: 'کد امنیتی اشتباه است.',
      deleteAllData: 'پاک کردن همه داده‌های محلی',
      deleteConfirm: 'آیا از حذف تمام داده‌های ذخیره شده مطمئن هستید؟',
      aboutTitle: 'درباره برنامه',
      version: 'نسخه',
      checkUpdates: 'بررسی به‌روزرسانی',
      upToDate: 'برنامه روی آخرین نسخه است.',
    },
    adminModule: {
      subtitle: 'بررسی و مستندسازی محتوای اسلامی و مدیریت نسخه‌ها',
      tabs: {
        hadith: 'حدیث',
        book: 'کتاب',
        announcement: 'اعلان',
      },
      collectionNames: {
        bukhari: 'صحیح بخاری',
        muslim: 'صحیح مسلم',
        abudawud: 'سنن ابی‌داود',
        tirmidhi: 'جامع ترمذی',
        nasai: 'سنن نسایی',
        ibnmajah: 'سنن ابن ماجه',
        malik: 'موطأ مالک',
        nawawi40: 'چهل حدیث نووی',
        adab: 'الادب المفرد',
        qudsi: 'احادیث قدسی',
      },
      arabicTextPlaceholder: 'متن عربی حدیث...',
      translationPlaceholder: 'ترجمه فارسی حدیث...',
      sourceRequiredPlaceholder: 'منبع معتبر و دقیق (الزامی)...',
      bookTitlePlaceholder: 'عنوان کتاب',
      bookAuthorPlaceholder: 'نویسنده',
      bookContentPlaceholder: 'متن کتاب...',
      publishAnnouncementTitle: 'انتشار اطلاعیه یا نسخه جدید',
      announcementTitlePlaceholder: 'عنوان',
      announcementBodyPlaceholder: 'جزئیات اطلاعیه...',
      reviewedLabel: 'بررسی شده',
      seeSourceLabel: 'به منبع مراجعه شود',
      adminEditionLabel: 'نسخه بررسی‌شده',
      permittedLabel: 'متن علمی آزاد',
    },
    aboutModule: {
      pageTitle: 'درباره برنامه و سازنده',
      developerLabel: 'سازنده برنامه',
      developerName: 'طالب العلم خبیب تکل',
      developerRole: 'طالب‌علم علوم شرعی و فناوری · خادم خدمات دیجیتال اسلامی',
      essayTitle: 'نوشتاری درباره سازنده برنامه',
      essayParagraphs: [
        'برنامه جامع «إِيَادُ المُسْلِم – همراه مسلمان» توسط طالب العلم خبیب تکل با نیت خالص، امانت‌داری علمی و با هدف خدمت به امت اسلامی در زمینه عبادت، مطالعه و نظم روزانه طراحی و ساخته شده است.',
        'این پروژه برای آن شکل گرفت که مسلمانان به جای استفاده از چندین برنامه پراکنده و پر از تبلیغات، یک همراه یکپارچه، آفلاین، آرام و مستند داشته باشند که قرآن، تفسیر، حدیث، اذکار، اوقات شرعی، قبله و کتابخانه اسلامی را در یک جا فراهم سازد.',
        'در ساخت این برنامه تلاش شده است منابع معتبر دینی به درستی ذکر شوند و پشتیبانی کامل از زبان‌های پشتو، عربی، فارسی و انگلیسی ارائه گردد.',
      ],
      pillarsTitle: 'ارزش‌های بنیادین إِيَادُ المُسْلِم',
      pillars: [
        'محیطی پاک و بدون هیچ‌گونه تبلیغات',
        'دقت علمی و ذکر منبع در نقل آیات، احادیث و اقوال علما',
        'حفظ حریم خصوصی و اولویت عملکرد آفلاین',
        'پشتیبانی کامل از چهار زبان پشتو، عربی، فارسی و انگلیسی',
      ],
      closingDua: 'بارالها این تلاش را خالصانه بپذیر و برای طالب العلم خبیب تکل، والدین، اساتید او و همه مسلمانان پربرکت بگردان.',
      replaySplash: 'نمایش دوباره صفحه خوش‌آمدگویی',
      privacyTitle: 'سیاست حفظ حریم خصوصی و امنیت داده‌ها',
      privacyBody: 'این برنامه کاملاً بدون تبلیغات و ردیاب است و تمام اطلاعات شخصی تنها در دستگاه خود شما نگهداری می‌شود.',
      openPrivacyPolicy: 'مشاهده صفحه حریم خصوصی',
      dataSafetyTitle: 'تضمین حریم خصوصی برای Google Play',
      dataSafetyItems: [
        '۱۰۰٪ بدون تبلیغات و بدون ابزارهای ردیابی',
        'ذخیره‌سازی تمام داده‌ها به صورت محلی در حافظه دستگاه شما',
        'دسترسی به موقعیت و اعلان‌ها کاملاً اختیاری و تنها برای نماز و قبله',
        'امکان پشتیبان‌گیری رمزگذاری‌شده یا پاک‌سازی کامل داده‌ها در هر زمان',
      ],
      shareApp: 'اشتراک‌گذاری برنامه',
      shareCopied: 'لینک برنامه کپی شد',
      playStoreReadyTitle: 'آمادگی انتشار در Google Play',
      playStoreChecklist: [
        'آیکون‌های استاندارد Play Store و مانیفست نصب اندروید آماده است',
        'عملکرد کامل آفلاین با محتوای غنی و مستند اسلامی',
        'صفحه مستقل حریم خصوصی (/privacy.html) و میانبرهای اندروید فعال است',
        'رابط کاربری تمام‌شیشه‌ای با ۱۰ پوسته و ۶ پس‌زمینه اسلامی',
      ],
    },
    themes: {
      light: 'روشن',
      dark: 'تیره',
      system: 'مطابق سیستم',
      emerald: 'سبز زمردی',
      gold: 'طلایی سلطنتی',
      'islamic-blue': 'آبی اسلامی',
      'minimal-white': 'سفید ساده',
      'night-black': 'سیاه شب',
      'desert-sand': 'شن‌های کویر',
      'royal-islamic': 'اسلامی سلطنتی',
    },
    hijriMonths: [
      'محرم',
      'صفر',
      'ربیع‌الاول',
      'ربیع‌الثانی',
      'جمادی‌الاول',
      'جمادی‌الثانی',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذی‌القعده',
      'ذی‌الحجه',
    ],
    weekdays: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  },
  en: {
    appName: 'Eyad Al-Muslim',
    appSubtitle: 'The Muslim Companion',
    welcome: 'Welcome',
    greetingPrefix: 'Peace be upon you,',
    offlineBanner: 'Offline Mode — All locally saved resources work without internet',
    onlineStatus: 'Online',
    offlineStatus: 'Offline',
    installApp: 'Install App',
    installIOS: 'Install on iOS',
    iosInstallSteps: '1. Tap the Safari Share button, then 2. Select Add to Home Screen.',
    offlineZeroAdsBadge: 'Offline-First · Zero Ads',
    versionPrefix: 'v',
    gpsLabel: 'Auto GPS',
    kmUnit: 'km',
    daysShortUnit: 'd',
    hijriYearSuffix: 'AH',
    languageNames: {
      ps: 'Pashto',
      ar: 'Arabic',
      fa: 'Persian',
      en: 'English',
    },
    fontNames: {
      'plus-amiri': 'Amiri & Plus Jakarta Sans',
      naskh: 'Noto Naskh Arabic',
      scheherazade: 'Scheherazade New',
      kufi: 'Noto Kufi Arabic',
      lateef: 'Lateef Classic',
      vazirmatn: 'Vazirmatn Modern',
    },
    nav: {
      dashboard: 'Dashboard',
      quran: 'Quran & Tafsir',
      dictionary: 'Quranic Lexicon',
      hadith: 'Hadith Library',
      adhkar: 'Adhkar & Awrad',
      tasbeeh: 'Digital Tasbeeh',
      duas: 'Personal Duas',
      prayer: 'Prayer Times',
      qibla: 'Qibla Compass',
      mosques: 'Nearby Mosques',
      library: 'Islamic Library',
      quotes: 'Scholarly Gems',
      zakat: 'Zakat Calculator',
      calendar: 'Islamic Calendar',
      tasks: 'Task Manager',
      routines: 'Daily Routines',
      statistics: 'Statistics',
      assistant: 'Eyad Assistant',
      search: 'Global Search',
      notifications: 'Notifications',
      settings: 'Settings & Backup',
      about: 'About Developer',
      admin: 'Content Review',
      moreModules: 'All Modules',
    },
    navGroups: {
      worship: 'Worship & Prayer',
      quranHadith: 'Quran, Hadith & Dhikr',
      knowledgeTools: 'Knowledge & Planning',
      system: 'Settings & Info',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search...',
      filter: 'Filter',
      all: 'All',
      copy: 'Copy',
      copied: 'Copied',
      share: 'Share',
      download: 'Download',
      downloaded: 'Saved Offline',
      offlineReady: 'Offline Ready',
      localCacheLabel: 'Cached Locally',
      bookmark: 'Bookmark',
      favorite: 'Favorite',
      favorites: 'Favorites',
      bookmarks: 'Bookmarks',
      close: 'Close',
      confirm: 'Confirm',
      reset: 'Reset',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      loading: 'Loading...',
      empty: 'No items found.',
      source: 'Source',
      verified: 'Verified',
      today: 'Today',
      completed: 'Completed',
      pending: 'Pending',
      yes: 'Yes',
      no: 'No',
      exportCard: 'Image Card',
      enable: 'Enable',
      disable: 'Disable',
      apply: 'Apply',
      total: 'Total',
    },
    onboarding: {
      title: 'Eyad Al-Muslim — The Muslim Companion',
      subtitle: 'Your comprehensive offline-first companion for Quran, Hadith, Adhkar, Prayer Times, Study Library, and Daily Productivity — ad-free and private.',
      chooseLang: 'Select Language',
      chooseTheme: 'Select Visual Theme',
      yourName: 'Your Name',
      namePlaceholder: 'e.g. Yusuf',
      defaultUserName: 'Believer',
      locationOpt: 'Location for Prayer Times & Qibla (Optional)',
      locationDesc: 'Your coordinates stay on your device solely for prayer calculations, Qibla direction, and nearby mosques.',
      allowLocation: 'Allow Location',
      notifOpt: 'Prayer & Adhkar Reminders (Optional)',
      notifDesc: 'Enable browser reminders for prayer times and morning/evening Adhkar.',
      allowNotif: 'Enable Notifications',
      noSignupNote: 'All personal data stays locally on your device. No mandatory account signup.',
      startApp: 'Launch Eyad Al-Muslim',
    },
    dashboard: {
      hijriDate: 'Hijri Date',
      gregorianDate: 'Gregorian Date',
      nextPrayer: 'Next Prayer',
      prayerSummary: "Today's Prayers",
      adhkarProgress: 'Adhkar Progress',
      quranProgress: 'Quran Reading',
      tasksProgress: 'Tasks Done',
      dailyGoals: 'Daily Goals',
      dailyHadith: 'Hadith of the Day',
      dailyAyah: 'Verse of the Day',
      dailyDua: 'Dua of the Day',
      recommendedBook: 'Recommended Book',
      upcomingEvent: 'Upcoming Islamic Event',
      quickAccess: 'Quick Access',
      carouselTitle: 'Daily Spiritual Feed',
      carouselPaused: 'Carousel paused',
      carouselPlaying: 'Rotates every 10 seconds',
      daysLeft: 'days left',
      ayahsRemaining: 'ayahs remaining',
      asrSurahRef: 'Surah Al-Asr · 1-3',
    },
    prayers: {
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      city: 'City',
      detectLocation: 'Detect GPS Location',
      calcMethod: 'Calculation Method',
      madhab: 'Asr Juristic Method',
      hanafi: 'Hanafi',
      shafi: 'Majority (Shafi, Maliki, Hanbali)',
      adjustments: 'Manual Minute Adjustments',
      monthlyCalendar: 'Monthly Timetable',
      adhanAlert: 'Adhan Alert',
      markPrayed: 'Mark Prayed',
      prayed: 'Prayed',
      manualLocation: 'Manual Location',
      selectCity: 'Select City',
      methods: {
        Karachi: 'University of Islamic Sciences, Karachi',
        MuslimWorldLeague: 'Muslim World League',
        UmmAlQura: 'Umm al-Qura (Makkah)',
        Egyptian: 'Egyptian General Authority',
        NorthAmerica: 'Islamic Society of North America',
        Tehran: 'University of Tehran Method',
      },
    },
    qiblaModule: {
      northShort: 'N',
      southShort: 'S',
      eastShort: 'E',
      westShort: 'W',
      makkahLabel: 'Makkah',
      compassHeading: 'Compass Heading',
      bearingTrueNorth: 'Bearing from True North',
      enableSensor: 'Enable Compass Sensor',
      sensorMissingTitle: 'Compass orientation sensor is not available on this device',
      sensorMissingDesc: 'Align true North to 0 degrees and turn clockwise by the indicated bearing toward Makkah.',
      calibrationTitle: 'Sensor Calibration Guide',
      calibrationSteps: '1. Keep away from metal objects or magnetic cases. 2. Wave the device in a figure-8 motion three times. 3. Keep location active for accurate coordinates.',
      worldCitiesTitle: 'Qibla Bearings for Major World Cities',
      previewDialLabel: 'Interactive Heading Preview',
    },
    mosquesModule: {
      offlineRadarTitle: 'Offline Nearby Mosques Radar',
      offlineRadarDesc: 'Locally cached landmark mosques plotted by bearing and distance',
      openDirections: 'Open Directions',
      sourceLabel: 'Open Map Data & Local Cache',
      youAreHere: 'You',
      ringLabel: 'Radius',
    },
    quranModule: {
      surahWord: 'Surah',
      juzWord: 'Juz',
      surahs: 'Surahs (114)',
      juzs: 'Juz (30)',
      meccan: 'Meccan',
      medinan: 'Medinan',
      ayahs: 'Ayahs',
      readingMode: 'Reading Mode',
      studyMode: 'Study & Tafsir Mode',
      nightMode: 'Night Reading',
      tafsir: 'Tafsir & Commentary',
      tafsirMuyassar: 'Al-Tafsir Al-Muyassar',
      tafsirIbnKathir: 'Tafsir Ibn Kathir',
      tafsirJalalayn: 'Tafsir Al-Jalalayn',
      defaultTafsirSource: 'Al-Tafsir Al-Muyassar — King Fahd Complex',
      lexicalMeaning: 'Lexical Meaning',
      asbabNuzul: 'Occasions of Revelation',
      lastRead: 'Last Read Position',
      continueReading: 'Continue Reading',
      dailyGoal: 'Daily Goal',
      khatmah: 'Khatmah Tracker',
      downloadOffline: 'Save Offline',
      downloadAllOffline: 'Save Essential Surahs Offline',
      reciter: 'Reciter',
      speed: 'Speed',
      repeat: 'Repeat',
      searchAyahs: 'Search Ayahs...',
      shareCard: 'Share Image Card',
      wordDictionary: 'Quranic Lexicon',
      cacheAudioBtn: 'Save Audio for Offline',
      audioCachedBadge: 'Audio Saved Offline',
      offlineSpeechPlay: 'Local Voice Readout',
      offlineSpeechStop: 'Stop Voice',
    },
    hadithModule: {
      collections: 'Hadith Collections',
      narrator: 'Narrator',
      grade: 'Grade',
      chapter: 'Chapter',
      hadithNum: 'Hadith #',
      commentary: 'Commentary',
      hadithOfDay: 'Hadith of the Day',
      authenticityNotice: 'All Hadiths include verified collection citations and authenticity grades.',
      topics: 'Topics',
      topicLabels: {
        'Sincerity & Intention': 'Sincerity & Intention',
        'Ihsan & Worship': 'Ihsan & Worship',
        'Quran & Teaching': 'Quran & Teaching',
        'Brotherhood & Heart': 'Brotherhood & Heart',
        'Knowledge & Help': 'Knowledge & Help',
        'Patience & Gratitude': 'Patience & Gratitude',
        'Mercy & Character': 'Mercy & Character',
        'Trustworthiness & Honesty': 'Trustworthiness & Honesty',
        'Seeking Knowledge': 'Seeking Knowledge',
        'Taqwa & Character': 'Taqwa & Character',
        'Character & Mindful Living': 'Character & Mindful Living',
        'Dhikr & Gratitude': 'Dhikr & Gratitude',
        'Worship & Prayer': 'Worship & Prayer',
        'Safety & Trust': 'Safety & Trust',
        'Charity & Blessing': 'Charity & Blessing',
        Repentance: 'Repentance',
        'Sincere Devotion': 'Sincere Devotion',
        Character: 'Character',
        'Forgiveness & Brotherhood': 'Forgiveness & Brotherhood',
        'Quran & Sunnah': 'Quran & Sunnah',
        Brotherhood: 'Brotherhood',
        'Lawful & Pure Heart': 'Lawful & Pure Heart',
        'Trust in Allah': 'Trust in Allah',
        'Family & Parents': 'Family & Parents',
        'Neighborhood & Ethics': 'Neighborhood & Ethics',
        'Kindness & Charity': 'Kindness & Charity',
        'Dhikr & Hope': 'Dhikr & Hope',
        'Justice & Mercy': 'Justice & Mercy',
        'Divine Mercy': 'Divine Mercy',
        Reviewed: 'Reviewed',
      },
      gradeLabels: {
        'صحيح (متفق عليه)': 'Authentic (Agreed Upon)',
        صحيح: 'Authentic (Sahih)',
        'صحيح (الترمذي والألباني)': 'Authentic (Tirmidhi & Albani)',
        'صحيح (الألباني وحسنه الترمذي)': 'Authentic (Albani & Tirmidhi)',
        'صحيح (الترمذي والحاكم)': 'Authentic (Tirmidhi & Hakim)',
        'صحيح (الترمذي وابن حبان)': 'Authentic (Tirmidhi & Ibn Hibban)',
        'صحيح لغيره (السيوطي والألباني)': 'Authentic by Corroboration',
        'حسن صحيح': 'Sound & Authentic',
        'حسن صحيح (النووي والألباني)': 'Sound & Authentic',
        'حسن (الترمذي والحاكم)': 'Sound (Hasan)',
        'حسن (الترمذي وابن ماجه)': 'Sound (Hasan)',
        'حسن لغيره (الموطأ والحاكم)': 'Sound by Corroboration',
      },
    },
    dictionaryModule: {
      learningHistory: 'Learning History',
    },
    duasModule: {
      categories: {
        Personal: 'Personal',
        Family: 'Family',
        Knowledge: 'Knowledge',
        Rizq: 'Provision',
        Healing: 'Healing',
      },
      translationPlaceholder: 'Enter translation or meaning...',
      notesPlaceholder: 'Personal notes...',
    },
    libraryModule: {
      subtitleSuffix: 'Local Texts & Personal Documents',
      addDocumentBtn: 'Add Document',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      fullscreen: 'Fullscreen',
      pageLabel: 'Page',
      pageShort: 'p.',
      volumeShort: 'vol.',
      localUserDoc: 'Local Document',
      publicDomainLabel: 'Public Domain Text',
      sizeUnitMB: 'MB',
      chapterLabel: 'Chapter',
      chaptersListTitle: 'Chapters in This Book',
      aboutAuthorLabel: 'About the Author',
    },
    quotesModule: {
      authenticityBanner: 'Scholarly statements and Companion narrations are strictly separated from Prophetic Hadith and include book, volume, and page citations.',
    },
    zakatModule: {
      cash: 'Cash & Bank Balances',
      goldGrams: 'Gold (grams)',
      goldPricePerGram: 'Gold Price per Gram',
      silverGrams: 'Silver (grams)',
      silverPricePerGram: 'Silver Price per Gram',
      businessGoods: 'Business Inventory',
      otherAssets: 'Other Zakatable Assets',
      debts: 'Deductible Debts & Liabilities',
      nisabStandard: 'Nisab Standard',
      goldStandard: 'Gold Nisab (85g)',
      silverStandard: 'Silver Nisab (595g)',
      goldShort: 'Gold',
      silverShort: 'Silver',
      nisabLabel: 'Nisab',
      calculate: 'Calculate Zakat',
      resultTitle: 'Zakat Summary',
      totalAssets: 'Total Assets',
      netZakatable: 'Net Zakatable Wealth',
      zakatDue: 'Zakat Due (2.5%)',
      belowNisab: 'Net wealth is below the chosen Nisab threshold.',
      fiqhNote: 'Jurisprudence Note: Hanafi scholars apply the Silver Nisab for cash to benefit the poor, while majority schools use Gold Nisab. Consult a scholar for complex estates.',
      history: 'Calculation History',
      currencies: {
        USD: 'USD',
        AFN: 'AFN',
        SAR: 'SAR',
        EUR: 'EUR',
      },
      recipientsTitle: 'Eight Quranic Categories of Zakat Recipients',
      recipientsVerseRef: 'Surah At-Tawbah (9:60)',
      recipients: [
        'Al-Fuqara (The poor lacking basic sufficiency)',
        'Al-Masakin (The deeply needy & destitute)',
        'Amilun (Authorized Zakat administrators)',
        'Mu’allafat al-Qulub (Reconciling hearts to faith)',
        'Fi al-Riqab (Freeing captives and bondage)',
        'Al-Gharimun (Those burdened by lawful debt)',
        'Fi Sabilillah (Sacred, educational, and public good)',
        'Ibn al-Sabil (Stranded travelers in need)',
      ],
      fitrTitle: 'Zakat al-Fitr Quick Reminder',
      fitrDesc: 'Obligatory before Eid al-Fitr prayer on behalf of every Muslim and dependents: one Sa (~2.5 kg) of staple food or its charitable value per juristic allowance.',
    },
    calendarModule: {
      sightingNote: 'Note: Hijri dates shown are astronomically calculated. Official Islamic months depend on confirmed moon sighting.',
      eventsTitle: 'Islamic Occasions',
      ramadan: '1st of Ramadan',
      laylatulQadr: 'Last 10 Nights & Laylatul-Qadr (27 Ramadan)',
      eidFitr: 'Eid al-Fitr (1 Shawwal)',
      dhulHijjahTen: 'Ten Blessed Days of Dhul-Hijjah (1 Dhul-Hijjah)',
      arafah: 'Day of Arafah (9 Dhul-Hijjah)',
      eidAdha: 'Eid al-Adha (10 Dhul-Hijjah)',
      ashura: 'Day of Ashura (10 Muharram)',
      tasua: 'Day of Tasua (9 Muharram)',
      hijriNewYear: 'Islamic New Year (1 Muharram)',
      rabiAwwal12: 'Seerah Commemoration (12 Rabi al-Awwal)',
      israMiraj: 'Al-Isra wal-Mi’raj (27 Rajab)',
      midShaban: 'Mid-Shaban (15 Shaban)',
      friday: 'Friday (Jumuah)',
      hijriMonthsCount: 'Hijri Months (12)',
      fastingIndicatorsTitle: "Today's Voluntary Fasting Note",
      ayyamAlBidLabel: 'Ayyam al-Bid (13th, 14th, 15th of the Hijri month)',
      sunnahFastMonThu: 'Sunnah Monday / Thursday Fast',
    },
    tasksModule: {
      views: {
        today: 'Today',
        upcoming: 'Upcoming',
        overdue: 'Overdue',
        completed: 'Completed',
        all: 'All',
      },
      priorities: {
        high: 'High Priority',
        medium: 'Medium',
        low: 'Low',
      },
      recurrences: {
        none: 'One-time',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
      },
      descPlaceholder: 'Task notes or details...',
    },
    statsModule: {
      localRealData: '100% Real Local Activity Data',
      lockBtn: 'Lock',
      weeklyChartTitle: '7-Day Worship & Study Activity',
      pinPlaceholder: 'Enter PIN',
      pinLengthHint: '4+ character PIN',
    },
    notificationsModule: {
      morningAdhkarLabel: 'Morning Adhkar',
      eveningAdhkarLabel: 'Evening Adhkar',
      unreadLabel: 'unread',
      markAllRead: 'Mark All Read',
      clearRead: 'Clear Read',
      testAlert: 'Test Alert & Sound',
      checkReminders: 'Check Reminders Now',
      prefsTitle: 'Reminder Preferences',
      scheduledTodayTitle: "Today's Scheduled Reminders",
      filterAll: 'All',
      filterUnread: 'Unread',
      openModule: 'Open',
      soundChime: 'Gentle Chime Sound',
      permissionGranted: 'Browser Notifications Enabled',
      permissionDefault: 'Browser prompt pending — In-app alerts are active',
      permissionBlocked: 'Browser notifications blocked — In-app alerts remain active',
      permissionUnsupported: 'This browser uses reliable In-app alerts',
      inAppFallbackNote: 'All reminders are saved locally and appear as floating banners with a calm chime even inside embedded frames or offline.',
      testTitle: 'Eyad Al-Muslim Alert Test',
      testBody: 'Your notification engine is working cleanly for prayers, Adhkar, Quran goals, and daily tasks.',
      prayerDueTitle: 'Prayer Time Reminder',
      prayerDueBody: 'Prepare for Wudu and perform Salah on time.',
      morningAdhkarTitle: 'Morning Adhkar Reminder',
      morningAdhkarBody: 'Begin your morning with authentic remembrance, Ayat al-Kursi, and Mu’awwidhat.',
      eveningAdhkarTitle: 'Evening Adhkar Reminder',
      eveningAdhkarBody: 'Safeguard your evening with Sunnah Adhkar and Istighfar.',
      quranReminderTitle: 'Daily Quran Target',
      quranReminderBody: 'Your daily Quran recitation goal is waiting — take a moment to read with Tafsir.',
      fridayReminderTitle: 'Blessed Friday Reminder',
      fridayReminderBody: 'Jumuah Mubarak! Recite Surah Al-Kahf and send abundant Salawat upon the Prophet ﷺ.',
      eventReminderTitle: 'Upcoming Islamic Occasion',
      taskReminderTitle: 'Scheduled Task Due',
      welcomeNotifTitle: 'Smart Reminders Active',
      welcomeNotifBody: 'Prayer times, Adhkar, Quran goal, and task reminders are active offline.',
    },
    assistantModule: {
      title: 'Eyad Assistant',
      subtitle: 'Islamic study & worship planning companion (Works both Online & Offline)',
      placeholder: 'Ask a question about Quran, Hadith sources, or study plans...',
      send: 'Send',
      offlineLocalNotice: 'Offline Knowledge Mode Active — Answering directly from your locally cached Quran, Hadith, Adhkar, and Library.',
      scholarlyNotice: 'Note: This assistant does not issue religious rulings. Please consult qualified scholars for binding verdicts.',
      quickPrompts: [
        'Explain the key themes of Surah Al-Fatiha',
        'Build a balanced daily Quran & Adhkar schedule',
        'Share an authentic Hadith on honesty with source & grade',
        'Practical tips for improving focus in prayer',
      ],
    },
    settingsModule: {
      appearance: 'Appearance & Typography',
      language: 'Language',
      theme: 'Theme',
      wallpaper: 'Glass Backdrop Scene',
      fontFamily: 'Arabic Font Family',
      fontSize: 'Font Size',
      lineSpacing: 'Line Spacing',
      customBgTint: 'Custom Background Tint',
      tints: {
        default: 'Reset',
        ivory: 'Ivory Parchment',
        mint: 'Soft Mint',
        cream: 'Warm Cream',
        slate: 'Cool Slate',
        forest: 'Deep Forest',
      },
      securityBackup: 'Privacy, PIN & Backup',
      encryptedNote: 'AES-256-GCM Encrypted',
      createBackup: 'Create Encrypted Backup',
      restoreBackup: 'Restore Backup',
      backupPassword: 'Encryption Password (Optional)',
      restoreConfirm: 'Restoring a backup will overwrite existing local records. Continue?',
      statsPin: 'Statistics Lock PIN',
      setPin: 'Set PIN',
      pinSaved: 'PIN saved',
      pinCleared: 'PIN cleared',
      unlockStats: 'Enter your Statistics PIN to view personal metrics',
      wrongPin: 'Incorrect PIN.',
      deleteAllData: 'Erase All Local Data',
      deleteConfirm: 'Are you sure you want to erase all local data?',
      aboutTitle: 'About Eyad Al-Muslim',
      version: 'Version',
      checkUpdates: 'Check for Updates',
      upToDate: 'You are on the latest version.',
    },
    adminModule: {
      subtitle: 'Authenticated Islamic Content Review & Version Management',
      tabs: {
        hadith: 'Hadith',
        book: 'Book',
        announcement: 'Announcement',
      },
      collectionNames: {
        bukhari: 'Sahih al-Bukhari',
        muslim: 'Sahih Muslim',
        abudawud: 'Sunan Abi Dawud',
        tirmidhi: "Jami' at-Tirmidhi",
        nasai: "Sunan an-Nasa'i",
        ibnmajah: 'Sunan Ibn Majah',
        malik: 'Muwatta Malik',
        nawawi40: '40 Hadith Nawawi',
        adab: 'Al-Adab Al-Mufrad',
        qudsi: 'Hadith Qudsi',
      },
      arabicTextPlaceholder: 'Original Arabic Hadith text...',
      translationPlaceholder: 'English translation...',
      sourceRequiredPlaceholder: 'Verified Source Citation (Required)...',
      bookTitlePlaceholder: 'Book Title',
      bookAuthorPlaceholder: 'Author',
      bookContentPlaceholder: 'Book content...',
      publishAnnouncementTitle: 'Publish Update / Announcement',
      announcementTitlePlaceholder: 'Title',
      announcementBodyPlaceholder: 'Announcement details...',
      reviewedLabel: 'Reviewed',
      seeSourceLabel: 'See source',
      adminEditionLabel: 'Reviewed Edition',
      permittedLabel: 'Public Domain Text',
    },
    aboutModule: {
      pageTitle: 'About the App & Developer',
      developerLabel: 'Application Creator',
      developerName: 'Talib al-Ilm Khubaib Takal',
      developerRole: 'Student of Sacred & Modern Sciences · Islamic Digital Companion Builder',
      essayTitle: 'Note About the Developer',
      essayParagraphs: [
        'Eyad Al-Muslim — The Muslim Companion was envisioned and developed by Talib al-Ilm Khubaib Takal with sincere intention to serve the Muslim community through a calm, trustworthy, and comprehensive daily digital companion.',
        'Seeing how Muslims often need separate, ad-crowded apps for Quran recitation, Tafsir, Hadith, Adhkar, prayer times, Qibla, Islamic books, and daily task planning, Talib al-Ilm Khubaib Takal sought to unify these essentials into one offline-first, privacy-respecting, zero-ad platform.',
        'Special care was taken to verify sources, separate Prophetic Hadiths from scholarly statements, and provide seamless support for Pashto, Arabic, Persian, and English.',
      ],
      pillarsTitle: 'Guiding Principles',
      pillars: [
        'Zero advertisements and zero distracting clutter',
        'Verified references for Quran, Hadith, and scholarly wisdom',
        'Offline-first architecture with full local user privacy',
        'Complete multilingual support (Pashto, Arabic, Persian, English)',
      ],
      closingDua: 'O Allah, accept this humble work sincerely for Your Noble Face, and bless Talib al-Ilm Khubaib Takal, his parents, teachers, and everyone who benefits from it.',
      replaySplash: 'Replay Welcome Splash Screen',
      privacyTitle: 'Privacy Policy & Data Safety',
      privacyBody: 'Eyad Al-Muslim contains zero ads and zero analytics trackers. All personal records remain privately on your device.',
      openPrivacyPolicy: 'Open Privacy Policy Page',
      dataSafetyTitle: 'Google Play Data Safety Guarantee',
      dataSafetyItems: [
        '100% free of advertisements and third-party tracking SDKs',
        'All personal data is stored locally on your device only',
        'Location and notification permissions are strictly optional',
        'One-tap encrypted export and full local data deletion anytime',
      ],
      shareApp: 'Share App',
      shareCopied: 'App link copied to clipboard',
      playStoreReadyTitle: 'Play Store Release Readiness',
      playStoreChecklist: [
        'High-resolution 192px, 512px, maskable icons, and rich install manifest ready',
        'Full offline capability across 41 Surahs, 50 Hadiths, 91 Adhkar, and 32 books',
        'Dedicated hosted Privacy Policy (/privacy.html) and Android quick shortcuts included',
        'Complete frosted-glass UI across 10 themes and 6 atmospheric Islamic backdrops',
      ],
    },
    themes: {
      light: 'Light Mode',
      dark: 'Dark Mode',
      system: 'System Default',
      emerald: 'Emerald Green',
      gold: 'Royal Gold',
      'islamic-blue': 'Islamic Blue',
      'minimal-white': 'Minimal White',
      'night-black': 'Night Black',
      'desert-sand': 'Desert Sand',
      'royal-islamic': 'Royal Islamic',
    },
    hijriMonths: [
      'Muharram',
      'Safar',
      'Rabi al-Awwal',
      'Rabi al-Thani',
      'Jumada al-Ula',
      'Jumada al-Akhirah',
      'Rajab',
      'Shaban',
      'Ramadan',
      'Shawwal',
      'Dhul-Qadah',
      'Dhul-Hijjah',
    ],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
};

export function getText(lang: LanguageCode, obj: { ps: string; ar: string; fa: string; en: string }): string {
  return obj[lang] || obj.en || obj.ar;
}

export function getLocalizedContent(
  lang: LanguageCode,
  obj: { arabic: string; ps: string; fa: string; en: string; ar?: string }
): string {
  if (lang === 'ar') return obj.ar || obj.arabic;
  return obj[lang] || obj.en || obj.ps || obj.arabic;
}
