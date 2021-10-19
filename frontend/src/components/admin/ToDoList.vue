<template>
    <div class="user-admin">
        <PageTitle icon="fa fa-user" main="To Do List"
            sub="Acompanhe e conclua as tarefas do seu diário" />
            <b-list-group>
                <div v-for="task in tasks" :key="task.id">
                    <b-list-group-item> 
                        {{ task.titulo }} - {{ task.descricao }} - {{ task.entrega }}
                    </b-list-group-item>
                </div>
            </b-list-group>
        <hr>
    </div>
</template>

<script>
//import { baseApiUrl, showError, userKey } from "@/global";
//import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  nome: "To Do List",
  components: { PageTitle },
  data: function() {
    return {
      tasks: [
          {id: 1, titulo: 'titulo 1', descricao: 'faça isso 1', entrega: '02:30'},
          {id: 2, titulo: 'titulo 2', descricao: 'faça isso 2', entrega: '02:30'},
          {id: 3, titulo: 'titulo 3', descricao: 'faça isso 3', entrega: '02:30'},
          {id: 4, titulo: 'titulo 4', descricao: 'faça isso 4', entrega: '02:30'},
          {id: 5, titulo: 'titulo 5', descricao: 'faça isso 5', entrega: '02:30'},
          {id: 6, titulo: 'titulo 6', descricao: 'faça isso 6', entrega: '02:30'}
      ],
    };
  },
  methods: {
   loadTasks() {
       
    },
  },
  mounted() {
      this.loadTasks();
  },
};
</script>

<style>
</style>
