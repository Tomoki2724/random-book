const grid = document.querySelector("#bookGrid");
const button = document.querySelector("#reloadButton");
const template = document.querySelector("#bookTemplate");

function showLoading() {
  grid.innerHTML = Array.from({ length: 8 }, () =>
    '<div class="skeleton"></div>'
  ).join("");
}

function renderBooks(books) {
  grid.innerHTML = "";

  books.forEach((book) => {
    const card = template.content.cloneNode(true);
    const link = card.querySelector(".book-card");
    const image = card.querySelector(".cover");

    link.href = book.affiliateUrl;
    image.src = book.image || "https://placehold.co/300x450/e8e2d8/555?text=No+Image";
    image.alt = `『${book.title}』の表紙`;
    card.querySelector(".book-title").textContent = book.title;
    card.querySelector(".book-author").textContent = book.author || "著者情報なし";
    card.querySelector(".book-price").textContent =
      book.price ? `¥${Number(book.price).toLocaleString()}` : "";

    grid.appendChild(card);
  });
}

async function loadBooks() {
  button.disabled = true;
  button.textContent = "探しています…";
  showLoading();

  try {
    const response = await fetch("/api/books");
    if (!response.ok) throw new Error("読み込みに失敗しました");

    const books = await response.json();
    renderBooks(books);
  } catch {
    grid.innerHTML = "<p>本を取得できませんでした。少し時間をおいて再度お試しください。</p>";
  } finally {
    button.disabled = false;
    button.innerHTML = '本を引き直す <span>↻</span>';
  }
}

button.addEventListener("click", loadBooks);
loadBooks();