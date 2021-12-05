<template>
    <aside id="menu" v-show="isMenuVisible">
        <nav>
            <div id="div">
                <div id="link">
                    <a href="#">
                        <router-link to="/admin">Diários</router-link>
                    </a>
                </div>
            </div>
             <div id="div">
                 <div id="link">
                    <a href="#">
                        <router-link to="/">Relatórios</router-link>
                    </a>
                 </div>
            </div>
        </nav>
    </aside>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Menu",
  computed: mapState(["isMenuVisible"]),
  methods: {},
  mounted() {},
};
</script>

<style>
#menu {
  display: flex;
  flex-direction: column;
  background: linear-gradient(to left, #1e89be, #1b4977);
  justify-content: initial;
  align-items: initial;
  font-size: 25px;
}
#menu div {
  flex-wrap: wrap;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}
#menu a {
  color: rgb(213, 230, 230);
  text-decoration: none;
}
#div:hover {
  text-decoration: none;
  background-color: rgba(2, 0, 36, 1);
}
#link {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
