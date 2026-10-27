/* وظائف مشتركة للصفحات */
const $ = id => document.getElementById(id);

/* نستخدم بيانات واحدة لصفحة الفعاليات وصفحة التفاصيل. */
var events = [
  {id:1, cat:"science", loc:"damascus", date:"2026-10-30", displayDate:"30 أكتوبر 2026", time:"10:00", img:"assets/img/ندوة التعليم.jpg", gallery:["assets/img/ندوة التعليم.jpg"], t:"ندوة التعليم الإلكتروني", d:"ندوة علمية تناقش مستقبل التعليم الإلكتروني وتطوير تجربة الطالب في الجامعات الافتراضية.", place:"جامعة دمشق – كلية الهندسة المعلوماتية"},
  {id:2, cat:"science", loc:"hama", date:"2026-12-01", displayDate:"1 ديسمبر 2026", time:"09:30", img:"assets/img/اليوم العالمي.jpg", gallery:["assets/img/اليوم العالمي.jpg"], t:"اليوم العلمي لبرنامج المعلوماتية", d:"فعالية علمية لطلاب الهندسة المعلوماتية عن الذكاء الاصطناعي ومشاريع الطلاب ومحاضرات تخصصية.", place:"دار الثقافة – حماة"},
  {id:3, cat:"culture", loc:"latakia", date:"2026-10-20", displayDate:"20 أكتوبر 2026", time:"17:00", img:"assets/img/مهرجان الثقافة.jpg", gallery:["assets/img/مهرجان الثقافة.jpg"], t:"مهرجان الثقافة الرقمية", d:"فعالية تجمع الطلاب المهتمين بالتقنية والثقافة الرقمية مع عرض مشاريع ونقاشات حول تأثير التكنولوجيا.", place:"المركز الثقافي – اللاذقية"},
  {id:4, cat:"culture", loc:"aleppo", date:"2026-10-28", displayDate:"28 أكتوبر 2026", time:"11:00", img:"assets/img/معرش مشاريع.jpg", gallery:["assets/img/معرش مشاريع.jpg"], t:"معرض مشاريع التخرج", d:"عرض أفضل مشاريع التخرج من مختلف الكليات، مع تقييم من لجنة أكاديمية.", place:"جامعة حلب – المدرج الكبير"},
  {id:5, cat:"sports", loc:"damascus", date:"2026-11-07", displayDate:"7 نوفمبر 2026", time:"15:00", img:"assets/img/كرة.jpg", gallery:["assets/img/كرة.jpg"], t:"بطولة كرة القدم بين الكليات", d:"بطولة بين فرق كليات الجامعة بنظام خروج المغلوب، مع جوائز للفريق الفائز.", place:"الملعب الرياضي – جامعة دمشق"},
  {id:6, cat:"sports", loc:"latakia", date:"2026-11-14", displayDate:"14 نوفمبر 2026", time:"08:00", img:"assets/img/ماراثون.jpg", gallery:["assets/img/ماراثون.jpg"], t:"ماراثون الجامعة الافتراضية (5 كم)", d:"سباق جري مفتوح لكل الطلاب والموظفين على الكورنيش البحري، مناسب لكل المستويات.", place:"الكورنيش البحري – اللاذقية"},
  {id:7, cat:"sports", loc:"aleppo", date:"2026-11-21", displayDate:"21 نوفمبر 2026", time:"14:00", img:"assets/img/سلة.jpg", gallery:["assets/img/سلة.jpg"], t:"دوري كرة السلة الطلابي", d:"دوري ودي بين فرق الطلاب بكرة السلة، مع مباريات تصفيات ونهائي.", place:"الصالة الرياضية – جامعة حلب"},
  {id:8, cat:"family", loc:"damascus", date:"2026-12-12", displayDate:"12 ديسمبر 2026", time:"10:00", img:"assets/img/عائلي.jpg", gallery:["assets/img/عائلي.jpg"], t:"يوم العائلة الجامعي", d:"يوم مفتوح بيجمع الطلاب وعائلاتهم بأنشطة وألعاب وعروض ترفيهية.", place:"حديقة تشرين – دمشق"}
];

var cats = {science:"علمي", culture:"ثقافة", sports:"رياضة", family:"عائلي"};
var favs = getFavorites();
var currentEvent = null;

/* نقرأ المفضلة من المتصفح */
function getFavorites(){
  try {
    return JSON.parse(localStorage.getItem("favs") || "[]").map(Number);
  } catch(error) {
    return [];
  }
}

function saveFavorites(){
  localStorage.setItem("favs", JSON.stringify(favs));
}

/* نحدّث أسماء الأزرار حسب الحالة */
function updateBtns(){
  var dark = document.body.classList.contains("dark");
  var themeButton = $("themeButton");
  var favoriteButton = $("favBtn") || $("favoriteButton");
  var section = $("favSection");

  if(themeButton) themeButton.textContent = dark ? "الوضع الفاتح" : "الوضع الداكن";
  if(favoriteButton && section){
    var opened = !section.hidden;
    favoriteButton.textContent = opened ? "إخفاء العناصر المفضلة" : "إظهار العناصر المفضلة";
    favoriteButton.setAttribute("aria-pressed", String(opened));
  }
}

if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark");

function changeTheme(){
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  updateBtns();
}

function toggleFavorites(){
  var section = $("favSection");
  if(!section) return;

  section.hidden = !section.hidden;
  if(!section.hidden){
    renderFavorites();
    section.scrollIntoView({behavior:"smooth"});
  }
  updateBtns();
}

function updateTopButton(){
  var button = $("topBtn");
  if(button) button.hidden = window.scrollY <= 200;
}

function goToTop(){
  window.scrollTo({top:0, behavior:"smooth"});
}

/* نبني بطاقات الفعاليات المحفوظة */
function favoriteCard(event, showHeart){
  var heartClass = favs.indexOf(event.id) > -1 ? "heart on" : "heart";
  var heartButton = showHeart ?
    '<button type="button" class="' + heartClass + '" data-action="toggle-event" data-id="' + event.id + '" aria-label="إزالة من المفضلة">' + (favs.indexOf(event.id) > -1 ? "♥" : "♡") + '</button>' : "";

  return '<div class="event-card card col-12 col-md-6 col-lg-4">' +
    heartButton +
    '<img src="' + event.img + '" alt="' + event.t + '">' +
    '<h3>' + event.t + '</h3>' +
    '<a class="btn" href="event.html?id=' + event.id + '">التفاصيل</a>' +
    '</div>';
}

function renderFavorites(){
  var list = $("favList");
  if(!list) return;

  var savedEvents = events.filter(function(event){
    return favs.indexOf(event.id) > -1;
  });
  var showHeart = $("detail") !== null;

  list.innerHTML = savedEvents.length ?
    savedEvents.map(function(event){ return favoriteCard(event, showHeart); }).join("") :
    '<p>لم يتم اختيار أي فعالية بعد.</p>';
}

function toggleEventFavorite(id){
  var position = favs.indexOf(id);
  if(position > -1) favs.splice(position, 1);
  else favs.push(id);

  saveFavorites();
  if($("detail")) renderDetailPage();
  else renderFavorites();
  updateBtns();
}

/* الصفحة الرئيسية: السلايدر والتصنيفات */
function initHomePage(){
  var sliderImage = $("slider-image");
  if(sliderImage){
    var photos = ["assets/img/كرة.jpg", "assets/img/مهرجان الثقافة.jpg", "assets/img/عائلي.jpg"];
    var slideIndex = 0;
    var timer;
    var dots = $("dots");

    function updateDots(){
      dots.querySelectorAll(".dot").forEach(function(dot, i){
        dot.classList.toggle("active", i === slideIndex);
      });
    }

    function showSlide(number){
      slideIndex = (number + photos.length) % photos.length;
      sliderImage.classList.add("fade-out");
      window.setTimeout(function(){
        sliderImage.src = photos[slideIndex];
        sliderImage.classList.remove("fade-out");
        updateDots();
      }, 250);
    }

    function restartTimer(){
      clearInterval(timer);
      timer = setInterval(function(){ showSlide(slideIndex + 1); }, 3000);
    }

    photos.forEach(function(photo, i){
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", "صورة " + (i + 1));
      dot.addEventListener("click", function(){
        showSlide(i);
        restartTimer();
      });
      dots.appendChild(dot);
    });

    $("prevBtn").addEventListener("click", function(){
      showSlide(slideIndex - 1);
      restartTimer();
    });
    $("nextBtn").addEventListener("click", function(){
      showSlide(slideIndex + 1);
      restartTimer();
    });
    updateDots();
    restartTimer();
  }

  var categoryButtons = document.querySelectorAll(".cat-btn");
  var eventsBox = $("eventsBox");
  categoryButtons.forEach(function(button){
    button.addEventListener("click", function(){
      var type = button.getAttribute("data-type");
      eventsBox.hidden = false;
      eventsBox.querySelectorAll(".event-card[data-type]").forEach(function(card){
        card.hidden = card.getAttribute("data-type") !== type;
      });
    });
  });
}

/* صفحة الفعاليات: البحث والتصفية */
function renderEventsPage(){
  var query = $("fSearch").value.trim().toLowerCase();
  var category = $("fCat").value;
  var location = $("fLoc").value;
  var date = $("fDate").value;

  var filteredEvents = events.filter(function(event){
    var text = (event.t + event.d + event.place).toLowerCase();
    return (!category || event.cat === category) &&
      (!location || event.loc === location) &&
      (!date || event.date >= date) &&
      (!query || text.indexOf(query) > -1);
  });

  $("eventsList").innerHTML = filteredEvents.map(function(event){
    return '<div class="event-card card col-12 col-md-6 col-lg-4">' +
      '<img src="' + event.img + '" alt="' + event.t + '">' +
      '<span class="badge ' + event.cat + '">' + cats[event.cat] + '</span>' +
      '<h3>' + event.t + '</h3>' +
      '<p>' + event.d + '</p>' +
      '<p><strong>التاريخ:</strong> ' + event.displayDate + '</p>' +
      '<p><strong>المكان:</strong> ' + event.place + '</p>' +
      '<a class="btn" href="event.html?id=' + event.id + '">التفاصيل</a>' +
      '</div>';
  }).join("");

  $("noResults").hidden = filteredEvents.length > 0;
}

function initEventsPage(){
  if(!$("eventsList")) return;

  ["fSearch", "fCat", "fLoc", "fDate"].forEach(function(id){
    var field = $(id);
    field.addEventListener(id === "fSearch" ? "input" : "change", renderEventsPage);
  });

  $("resetFiltersBtn").addEventListener("click", function(){
    $("fSearch").value = "";
    $("fCat").value = "";
    $("fLoc").value = "";
    $("fDate").value = "";
    renderEventsPage();
  });

  renderEventsPage();
}

/* صفحة التفاصيل ومعرض الصور */
function initDetailPage(){
  if(!$("detail")) return;

  var id = Number(new URLSearchParams(window.location.search).get("id")) || 1;
  currentEvent = events.find(function(event){ return event.id === id; }) || events[0];
  renderDetailPage();
}

function renderDetailPage(){
  if(!currentEvent) return;

  document.title = currentEvent.t + " - دليل فعاليات الجامعة الافتراضية السورية";

  $("detail").innerHTML =
    '<a class="back" href="events.html">→ العودة للفعاليات</a>' +
    '<div class="detail-wrap">' +
      '<img id="mainImg" src="' + currentEvent.img + '" alt="' + currentEvent.t + '">' +
      '<div class="detail-info">' +
        '<span class="badge ' + currentEvent.cat + '">' + cats[currentEvent.cat] + '</span>' +
        '<h2>' + currentEvent.t + '</h2>' +
        '<p>' + currentEvent.d + '</p>' +
        '<p><strong>التاريخ:</strong> ' + currentEvent.displayDate + '</p>' +
        '<p><strong>الوقت:</strong> ' + currentEvent.time + '</p>' +
        '<p><strong>المكان:</strong> ' + currentEvent.place + '</p>' +
        '<button type="button" data-action="toggle-event" data-id="' + currentEvent.id + '" class="btn btn-primary">' + (favs.indexOf(currentEvent.id) > -1 ? "♥" : "♡") + ' المفضّلة</button>' +
        '<button type="button" data-action="calendar" class="btn btn-primary">📅 أضف للتقويم</button>' +
        '<button type="button" data-action="share" class="btn btn-primary">🔗 شارك</button>' +
      '</div>' +
    '</div>';

  $("mapPlace").textContent = currentEvent.place;
  $("mapFrame").src = "https://www.google.com/maps?q=" + encodeURIComponent(currentEvent.place) + "&output=embed";

  $("gallery").innerHTML = currentEvent.gallery.map(function(photo){
    return '<img src="' + photo + '" alt="' + currentEvent.t + '" loading="lazy">';
  }).join("");

  var relatedEvents = events.filter(function(event){ return event.id !== currentEvent.id; });
  relatedEvents.sort(function(a, b){
    return Number(b.cat === currentEvent.cat) - Number(a.cat === currentEvent.cat);
  });
  $("related").innerHTML = relatedEvents.slice(0, 3).map(function(event){
    return favoriteCard(event, false);
  }).join("");

  renderFavorites();
  updateBtns();
}

/* أزرار الفعالية */
function addToCalendar(){
  var date = currentEvent.date.replace(/-/g, "");
  var parts = currentEvent.time.split(":");
  var endHour = ("0" + (Number(parts[0]) + 2)).slice(-2);
  var calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "DTSTART:" + date + "T" + parts[0] + parts[1] + "00",
    "DTEND:" + date + "T" + endHour + parts[1] + "00",
    "SUMMARY:" + currentEvent.t,
    "LOCATION:" + currentEvent.place,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  var link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([calendar], {type:"text/calendar;charset=utf-8"}));
  link.download = "event-" + currentEvent.id + ".ics";
  link.click();
  setTimeout(function(){ URL.revokeObjectURL(link.href); }, 1000);
}

function shareEvent(){
  if(!navigator.clipboard) return;
  navigator.clipboard.writeText(window.location.href).then(function(){
    alert("تم نسخ رابط الفعالية");
  });
}

/* نموذج التواصل ورسائل التحقق */
var MSG = {
  name:"الرجاء إدخال الاسم.",
  emailEmpty:"الرجاء إدخال البريد الإلكتروني.",
  email:"صيغة البريد غير صحيحة، يجب أن تتضمن علامة @.",
  message:"الرجاء إدخال الرسالة."
};

function validateField(id){
  var field = $(id);
  var error = $(id + "Error");
  var message = "";

  if(!field.value.trim()){
    message = id === "email" ? MSG.emailEmpty : id === "name" ? MSG.name : MSG.message;
  } else if(id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())){
    message = MSG.email;
  }

  error.textContent = message;
  field.classList.toggle("is-invalid", message !== "");
  return message === "";
}

function initContactForm(){
  var form = $("contactForm");
  if(!form) return;

  ["email", "name", "message"].forEach(function(id){
    $(id).addEventListener("input", function(){
      validateField(id);
      $("formAlert").hidden = true;
    });
  });

  form.addEventListener("submit", function(event){
    event.preventDefault();

    var validEmail = validateField("email");
    var validName = validateField("name");
    var validMessage = validateField("message");
    var alertBox = $("formAlert");

    if(!validEmail || !validName || !validMessage){
      alertBox.className = "alert alert-danger";
      alertBox.textContent = "يرجى مراجعة الحقول التي تظهر تحتها ملاحظة.";
      alertBox.hidden = false;
      return;
    }

    alertBox.className = "alert alert-success";
    alertBox.textContent = "تم التحقق من البيانات بنجاح.";
    alertBox.hidden = false;
  });
}

/* نربط الأزرار بعد تحميل محتوى الصفحة */
var themeButton = $("themeButton");
if(themeButton) themeButton.addEventListener("click", changeTheme);

var favoriteButton = $("favBtn") || $("favoriteButton");
if(favoriteButton) favoriteButton.addEventListener("click", toggleFavorites);

var topButton = $("topBtn");
if(topButton) topButton.addEventListener("click", goToTop);
window.addEventListener("scroll", updateTopButton);

document.addEventListener("click", function(event){
  var button = event.target.closest("[data-action]");
  if(button){
    var action = button.getAttribute("data-action");
    if(action === "toggle-event") toggleEventFavorite(Number(button.getAttribute("data-id")));
    if(action === "calendar") addToCalendar();
    if(action === "share") shareEvent();
  }

  var image = event.target.closest(".gallery img");
  if(image && $("mainImg")) $("mainImg").src = image.src;
});

initHomePage();
initEventsPage();
initDetailPage();
initContactForm();
updateBtns();
updateTopButton();
