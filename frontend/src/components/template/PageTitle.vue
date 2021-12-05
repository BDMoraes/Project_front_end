<template>
    <div class="page-title">
       <mq-layout :mq="['md', 'lg', 'xl']">
          <h1><i v-if="icon" :class="icon"></i> {{ main }}</h1>
          <h2>{{ sub }}</h2>
        <hr>
       </mq-layout>
        <mq-layout :mq="['xs', 'sm']">
          <h3><i v-if="icon" :class="icon"></i> {{ main }}</h3>
          <span>{{ sub }}</span>
        <hr>
       </mq-layout>
        
    </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: ["icon", "main", "sub"],
};
</script>

<style>
.page-title h1 {
  margin: 0px;
}

.page-title h2 {
  color: #777;
  margin-top: 5px;
  font-size: 1.3rem;
}
</style>
