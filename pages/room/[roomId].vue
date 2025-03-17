<template>
  <div class="chat-container">
    <!-- 登录界面 -->
    <div v-if="!loggedIn" class="login-form">
      <h2>加入房间：{{ roomId }}</h2>
      <input type="text" v-model="nickname" placeholder="请输入昵称" />
      <button @click="login">登录</button>
    </div>

    <!-- 聊天室界面 -->
    <div v-else class="chat-room">
      <div class="chat-header">
        <h2>房间 {{ roomId }} - 聊天室</h2>
        <div class="header-buttons">
          <button @click="fetchOnlineUsers">查看在线用户</button>
          <button @click="fetchHistory">查看历史记录</button>
        </div>
      </div>

      <!-- 聊天消息列表 -->
      <div class="chat-messages" ref="messageList">
        <div v-for="(msg, index) in messages" :key="index" class="chat-message">
          <strong>{{ msg.nickname }}:</strong> {{ msg.content }}
        </div>
      </div>

      <!-- 消息输入框 -->
      <div class="chat-input">
        <input
            type="text"
            v-model="message"
            @keyup.enter="sendMessage"
            placeholder="输入消息..."
        />
        <button @click="sendMessage">发送</button>
      </div>

      <!-- 在线用户 & 历史记录展示 -->
      <div class="chat-sidebar">
        <div class="online-users">
          <h3>在线用户</h3>
          <ul>
            <li v-for="(user, index) in onlineUsers" :key="index">{{ user }}</li>
          </ul>
        </div>
        <div class="history-messages">
          <h3>历史记录</h3>
          <ul>
            <li v-for="(h, index) in history" :key="index">
              <strong>{{ h.nickname }}:</strong> {{ h.content }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const roomId = route.params.roomId

const ws = ref<WebSocket | null>(null)
const nickname = ref('')
const loggedIn = ref(false)
const message = ref('')
const messages = ref<Array<{ nickname: string; content: string }>>([])
const onlineUsers = ref<string[]>([])
const history = ref<Array<{ nickname: string; content: string }>>([])

// 消息列表 DOM 引用，用于滚动
const messageList = ref<HTMLElement | null>(null)

const login = () => {
  if (!nickname.value.trim()) {
    alert('请输入昵称！')
    return
  }
  connect()
}

const connect = () => {
  // 建立 WebSocket 连接，地址需与后端保持一致（此处示例使用 ws://localhost:8080）
  ws.value = new WebSocket(`ws://192.168.1.105:8080/${roomId}`)
  ws.value.onopen = () => {
    // 登录：发送登录请求
    const loginMsg = { type: 'login', nickname: nickname.value }
    ws.value?.send(JSON.stringify(loginMsg))
  }
  ws.value.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    if (data.type === 'login' && data.success) {
      loggedIn.value = true
    } else if (data.type === 'message') {
      messages.value.push({ nickname: data.nickname, content: data.content })
      scrollToBottom()
    } else if (data.type === 'online') {
      onlineUsers.value = data.users
    } else if (data.type === 'history') {
      history.value = data.messages
    } else if (data.type === 'error') {
      alert(data.message)
    }
  }
  ws.value.onclose = () => {
    loggedIn.value = false
    alert('连接已关闭')
  }
  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
}

const sendMessage = () => {
  if (!message.value.trim()) return
  const msg = { type: 'message', content: message.value }
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify(msg))
    message.value = ''
  }
}

const fetchOnlineUsers = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    const command = { type: 'command', command: 'online' }
    ws.value.send(JSON.stringify(command))
  }
}

const fetchHistory = () => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    const command = { type: 'command', command: 'history' }
    ws.value.send(JSON.stringify(command))
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.login-form {
  text-align: center;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.login-form input {
  width: 80%;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 16px;
}

.login-form button {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}

.chat-room {
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-buttons button {
  margin-left: 10px;
  padding: 6px 12px;
  cursor: pointer;
}

.chat-messages {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  height: 300px;
  overflow-y: auto;
  margin: 20px 0;
  background: #f9f9f9;
}

.chat-message {
  margin-bottom: 8px;
}

.chat-input {
  display: flex;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
}

.chat-input button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.chat-sidebar {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.chat-sidebar > div {
  width: 48%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background: #fff;
}

.chat-sidebar h3 {
  margin-top: 0;
  font-size: 18px;
}

.chat-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-sidebar li {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

</style>
