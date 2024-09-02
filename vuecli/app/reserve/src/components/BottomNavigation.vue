<template>
  <div class="bottom-navigation">
    <router-link to="/home" class="nav-item">
      <img src="@/assets/icons/home-icon.png" alt="ホーム" />
      <span>ホーム</span>
    </router-link>
    <router-link to="/user-info" class="nav-item">
      <img src="@/assets/icons/user-info-icon.png" alt="ユーザ情報" />
      <span>ユーザ情報</span>
    </router-link>
    <router-link to="/team-data" class="nav-item">
      <img src="@/assets/icons/team-data-icon.png" alt="チームデータ" />
      <span>チームデータ</span>
    </router-link>
    <router-link to="/settings" class="nav-item">
      <img src="@/assets/icons/settings-icon.png" alt="アプリ設定" />
      <span>アプリ設定</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "BottomNavigation"
};
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  background-color: #f0f0f0;
  padding: 10px 0;
  border-top: 1px solid #ccc;
}

.nav-item {
  text-align: center;
  color: #888;
}

.nav-item img {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.nav-item.active {
  color: #1e90ff;
}

.nav-item.active img {
  filter: hue-rotate(200deg);
}
</style>
