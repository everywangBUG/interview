<script>
export default {
  data() {
    return {
      inputValue: '',
      list: [],
      isAllCompleted: false
    }
  },
  methods: {
      handleSubmit() {
        if (!this.inputValue) {
          return;
        }
        this.list.push({
          content:this.inputValue,
          checked: false
        })
        this.clearInputValue();
      },
      clearInputValue() {
        this.inputValue = "";
      },
      handleDelete (index) {
        this.list.splice(index, 1);
      },
      changeAllToCompleted () {
        this.list.map(it => it.checked = true)
        this.isAllCompleted = true;
      },
      changeAllToUncompleted() {
        this.list.map(it => it.checked = false);
        this.isAllCompleted = false;
      },
      clearAll() {
        this.list = [];
      }
  }
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
