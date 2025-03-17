<template>
  <div class="home">
    <h1>欢迎进入聊天室</h1>
    <input type="text" v-model="roomId" placeholder="请输入房间号" />
    <button @click="joinRoom">加入房间</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const roomId = ref('')
const router = useRouter()

const joinRoom = () => {
  if (roomId.value.trim()) {
    router.push(`/room/${roomId.value.trim()}`)
  } else {
    alert('请输入房间号')
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}
.home input {
  padding: 8px;
  font-size: 16px;
  width: 200px;
  margin-right: 10px;
}
.home button {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>
