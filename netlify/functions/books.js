const keywords = [
  "小説", "ミステリー", "エッセイ", "哲学", "歴史",
  "SF", "恋愛", "ビジネス", "心理学", "旅", "漫画",
  "自己啓発", "短編集", "料理", "デザイン"
];

exports.handler = async () => {
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const page = Math.floor(Math.random() * 5) + 1;

  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
    keyword,
    hits: "30",
    page: String(page),
    format: "json"
  });

  try {
    const response = await fetch(
      `https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?${params}`
    );

    if (!response.ok) throw new Error("Rakuten API error");

    const data = await response.json();

    const books = (data.Items || [])
      .map(({ Item }) => ({
        title: Item.title,
        author: Item.author,
        price: Item.itemPrice,
        image: Item.largeImageUrl || Item.mediumImageUrl,
        affiliateUrl: Item.affiliateUrl
      }))
      .filter((book) => book.title && book.affiliateUrl)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(books)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "本の取得に失敗しました。" })
    };
  }
};