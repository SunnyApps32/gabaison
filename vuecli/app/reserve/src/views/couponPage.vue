<template>
  <div class="coupon-container">
    <!-- Header -->
        <header class="header">
      <!-- ヘッダー画像を追加 -->
      <img :src="require('@/assets/coupon-kira.png')" alt="Coupon Header" class="header-image">
    </header>
    

    <!-- Coupon Information -->
    <div class="coupon-info">
      <h2>ポイント取得が完了しました</h2>
      <p>ZOZOTOWNでのお買い物をお楽しみください。</p>
      <div class="points">
        <span class="points-amount">1,000</span>pt 取得
      </div>
      <p class="expiry">使用期限：2024年9月5日 15:29まで</p>
    </div>

    <!-- Button -->
    <button class="coupon-button">対象商品はこちら</button>

    <!-- Notice -->
    <div class="notice">
      <ul>
        <li>キャンペーンポイントは、取得から72時間有効です。</li>
        <li>一部、ポイントが利用できない商品もございます。</li>
        <li>キャンペーンポイントをご利用いただけるコスメ取り扱いショップは
          <a href="#">こちら</a>よりご確認ください。</li>
        <li>本キャンペーンは、バナーが表示されたお客様のみ対象です。</li>
        <li>本企画のクーポン付与は、バナーが表示された当日中のみお一人様一回です。なお、ポイントのご利用はお一人様一回までと増します。</li>
        <!-- その他の注意書き... -->
      </ul>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <nav>
        <ul>
          <li>ホーム</li>
          <li>お気に入り</li>
          <li>探す</li>
          <li>ランキング</li>
          <li>計測・その他</li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'CouponPage',
  data() {
    return {
      // 必要に応じてデータを定義
    };
  },
  methods: {
    // 必要なメソッドを追加
  }
}
</script>

<style scoped>
.coupon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0; /* コンテナのパディングを削除 */
  margin: 0; /* コンテナのマージンを削除 */
  background-color: #fff;
}

.notice ul {
  text-align: left; /* リスト全体を左揃えに設定 */
  padding-left: 20px; /* インデントを追加 */
  list-style: disc; /* デフォルトのリストスタイルにする（必要なら） */
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.header-image {
  width: 100%;
  max-height: 200px;
}

.coupon-info {
  text-align: center;
  margin: 20px 0;
}

.points-amount {
  font-size: 36px;
  font-weight: bold;
  color: #000;
}

.coupon-button {
  background-color: #00AEEF;
  color: #fff;
  padding: 10px 120px;
  border: none;
  border-radius: 50px;
  margin: 20px 0;
}

.notice {
  margin: 20px;
  color: #666;
}

.footer {
  width: 100%;
  background-color: #f1f1f1;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
}

.footer nav ul {
  display: flex;
  justify-content: space-around;
  list-style: none;
}
</style>
