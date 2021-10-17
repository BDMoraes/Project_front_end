<template>
    <footer class="footer">
        <span><strong>Bruno Moraes</strong> 2021/2</span>
    </footer>
</template>

<script>
export default {
    name: "Footer"
}
</script>

<style>
    .footer {
        grid-area: footer;
         background-color: rgba(235, 238, 241, 0.459);
        color: #333;

        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 10px;
    }
</style>
