const API_URL = "在這裡填入你的 Web App /exec URL";
const oilList = document.getElementById("oil-list");
const saveBtn = document.getElementById("saveBtn");
const searchInput = document.getElementById("search");
let oils = [];

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const text = await res.text();
    console.log("API回應：", text);
    const result = JSON.parse(text);
    if (result.status === "success") {
      oils = result.data.map(row => ({
        name: row["中文名稱"] || "未命名",
        en: row["英文名稱"] || "",
        detail: row
      }));
      renderList(oils);
    } else {
      oilList.innerHTML = `<p style="color:red;">載入失敗：${result.message}</p>`;
    }
  } catch (err) {
    oilList.innerHTML = `<p style="color:red;">讀取資料錯誤：${err.message}</p>`;
  }
}

function renderList(data) {
  if (!data.length) {
    oilList.innerHTML = "<p>沒有資料</p>";
    return;
  }
  oilList.innerHTML = data.map(oil => `
    <div class="oil-item">
      <h3>${oil.name}</h3>
      <p>${oil.en}</p>
    </div>
  `).join("");
}

// 搜尋功能
searchInput.addEventListener("input", () => {
  const keywords = searchInput.value.split(",").map(k => k.trim()).filter(k => k);
  if (!keywords.length) {
    renderList(oils);
    return;
  }
  const filtered = oils.filter(oil => 
    keywords.some(k => oil.name.includes(k) || oil.en.toLowerCase().includes(k.toLowerCase()))
  );
  renderList(filtered);
});

// 保存功能
saveBtn.addEventListener("click", async () => {
  try {
    const payload = {keywords: searchInput.value, oils: "測試精油", total: 0};
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    alert(result.status === "success" ? "保存成功" : "保存失敗");
  } catch (err) {
    alert("保存錯誤：" + err.message);
  }
});

fetchData();
