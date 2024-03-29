<template>
  <div>
    <div class="header">
      <h2>Simple Weather</h2>
      <el-icon size="25"><Search /></el-icon>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @click="handleRefresh">
      <el-tab-pane label="RIO DE JANEIRO" name="first"
        ><Weather city="Rio De Janeiro"></Weather
      ></el-tab-pane>
      <el-tab-pane label="BEIJING" name="second"
        ><Weather city="Beijing"></Weather
      ></el-tab-pane>
      <el-tab-pane label="LOS ANGELES" name="third">
        <Weather city="Los Angeles"></Weather
      ></el-tab-pane>
    </el-tabs>
    Last Update on {{ lastupdated }}
  </div>
</template>
<script setup>
const lastupdated = ref(null);
const activeName = ref("first");

const getTodaysDate = () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${month} ${date.getDate()}, ${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  lastupdated.value = getTodaysDate();
});

const handleRefresh = () => {
  lastupdated.value = getTodaysDate();
};
</script>
<style lang="scss">
@use "element-plus/dist/index.css" as *;
html {
  font-family: sans-serif;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .refresh {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
  }
}
</style>
