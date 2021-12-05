<template>
    <header class="header">
         <mq-layout class="submenu" :mq="['md', 'lg', 'xl']">
             <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
                <i class="fa fa-lg" :class="icon"></i>
            </a>
        </mq-layout>
        <mq-layout class="submenu"  :mq="['xs', 'sm']">
            <a class="toggle" @click="toggleMenuS" v-if="!hideToggle">
              <i class="fa fa-lg" :class="icon"></i>
            </a>
        </mq-layout>
        <mq-layout class="title" :mq="['sm', 'md', 'lg', 'xl']">
            {{ title }}
        </mq-layout>
        <mq-layout class="title2" mq="xs">
            {{ title }}
        </mq-layout>
        <UserDropdown v-if="!hideUserDropdown" />
    </header>
</template>

<script>
import UserDropdown from "./UserDropdown";

export default {
  name: "Header",
  components: { UserDropdown },
  props: {
    title: String,
    hideToggle: Boolean,
    hideUserDropdown: Boolean,
  },
  initial: false,
  computed: {
    icon() {
      return this.$store.state.isMenuVisible
        ? "fa-angle-left"
        : "fa-angle-down";
    },
  },
  methods: {
    toggleMenu() {
      this.$store.commit("toggleMenu");
      
    },
     toggleMenuS() {
      if(!this.initial) {
        this.$store.commit("toggleMenu", this.initial);
        this.initial = true;
      }
      this.$store.commit("toggleMenu");
      
    },
  },
  mounted(){
    this.toggleMenuS();
  }
};
</script>

<style>
.header {
  grid-area: header;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(6, 61, 74, 1) 49%,
    rgba(31, 200, 245, 1) 100%
  );

  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 2.5rem;
  color: #fff;
  font-weight: 250;
  flex-grow: 1;
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.title2 {
  font-size: 1.5rem;
  color: #fff;
  font-weight: 250;
  flex-grow: 1;
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.title a {
  color: #fff;
  text-decoration: none;
}

.title a:hover {
  color: #fff;
  text-decoration: none;
}

header.header > a.toggle {
  width: 60px;
  height: 100%;
  color: #fff;
  justify-self: flex-start;
  text-decoration: none;

  display: flex;
  justify-content: center;
  align-items: center;
}

header.header > a.toggle:hover {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
}
.submenu{
  width: 60px;
  height: 100%;
  color: #fff;
  justify-self: flex-start;
  text-decoration: none;

  display: flex;
  justify-content: center;
  align-items: center;
}
.submenu:hover{
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
