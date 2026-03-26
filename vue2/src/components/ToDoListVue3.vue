<script setup lang="ts">
import { reactive, ref } from "vue";

interface ListProps {
  content: string;
  checked: boolean;
}

const inputValue = ref("");
const list = reactive<ListProps[]>([]);
const isAllCompleted = ref(false);

const handleSubmit = () => {
  list.push({
    content: inputValue.value,
    checked: false
  })
  inputValue.value = "";
}

const handleDelete = (index: number) => {
  list.splice(index, 1);
}

const changeAllToCompleted = () => {
  list.map(it => it.checked = true);
  isAllCompleted.value = true;
}

const changeAllToUncompleted = () => {
  list.map(it => it.checked = false);
  isAllCompleted.value = false;
}

const clearAll = () => {
  // list.splice(0, list.length);
  list.length = 0;
}
</script>

<template>
  <div class="to_do_list">
    <div class="input_wrapper">
      <input v-model="inputValue" placeholder="请输入今日代办项" />
      <button type="submit" @click="handleSubmit">提交</button>
      <div class="list">
          <div v-for="(item, index) in list" :key="index">
          <div class="content_wrapper">
            <input type="checkbox" :checked="item.checked">
            <div class="content">{{item.content}}</div>
            <div class="delete" @click="() => handleDelete(index)">X</div>
          </div>
        </div>
      </div>
    </div>
    <div class="operation">
      <div class="buttons">
        <button class="all" type="button">全部</button>
        <button v-if="!isAllCompleted" class="completed" type="button" @click="changeAllToCompleted">全部标记为已完成</button>
        <button v-if="isAllCompleted" class="completed" type="button" @click="changeAllToUncompleted">清除已完成</button>
        <button class="clearAll" type="button" @click="clearAll">清除全部</button>
      </div>
    </div>
  </div>
</template>
  
<style scoped lang="less">
.to_do_list {
  display: flex;
  justify-content: center;

  .list {
    .content_wrapper {
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .delete {
        cursor: pointer;
      }
    }
  }

  .operation {
    margin-left: 20px;
    .buttons {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
  