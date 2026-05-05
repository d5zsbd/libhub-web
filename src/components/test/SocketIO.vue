<template></template>

<script setup lang="ts">
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');


socket.on('connect', () => {
  console.log('成功连接到服务器，socket id：', socket.id);
});

socket.on('connect_error', error => {
  console.error('连接错误：', error);
})
</script>