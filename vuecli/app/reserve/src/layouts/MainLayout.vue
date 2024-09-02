<template>
  <div>
    <!-- ページコンテンツ -->
    <router-view></router-view>
    
    <!-- ボトムナビゲーション -->
    <BottomNavigation />
  </div>
</template>

<script>
import BottomNavigation from "@/components/BottomNavigation.vue";

export default {
  components: {
    BottomNavigation
  }
};
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
