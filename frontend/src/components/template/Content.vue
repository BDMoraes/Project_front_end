<template>
    <div class="content">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'Content'
}
</script>

<style>
    .content {
        grid-area: content;
        background-color: rgba(233, 239, 245, 0.459);
        padding: 20px;
    }
</style>
