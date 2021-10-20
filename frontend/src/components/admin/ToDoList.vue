<template>
    <div class="user-admin">
        <PageTitle icon="fa fa-clipboard" main="To Do List"
            sub="Acompanhe e conclua as tarefas do seu diário" />
            <b-list-group>
                <div v-for="task in tasks" :key="task.id">
                    <b-list-group-item> 
                        <div>
                            {{ task.titulo }} - {{ task.descricao }} - {{ task.entrega }}
                        </div>
                        <hr>
                        <div>
                             <b-button variant="outline-info" @click="load()" size="sm">
                                <i class="fa fa-check"></i>
                             </b-button>
                        </div> 
                    </b-list-group-item> 
                </div>
            </b-list-group>
        <hr>
    </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  nome: "To Do List",
  components: { PageTitle },
  data: function() {
    return {
      tasks: [],
    };
  },
  methods: {
   async loadTasks() {
        const waiting = await axios.get(`${baseApiUrl}/query-running-dailys/${JSON.parse(localStorage.getItem(userKey)).id}`)
        const id = waiting.data.id
        // await axios.post(`${baseApiUrl}/normalizies/${id}`)
        //         .then(() => {
        //             this.$toasted.global.organizerSuccess()
        //         })
        //         .catch(showError)
        await axios.get(`${baseApiUrl}/query-ordanized-tasks/${id}`)
                .then(res => {
                this.tasks = res.data
            })
            .catch(showError)
    },
    formatHora(value){
            let hora = value + ''
            let horaCerta = hora.replace(".", ":")
            return horaCerta
        },
    load(){
        this.$toasted.global.organizerSuccess()
    }
  },
  mounted() {
      this.loadTasks();
  },
};
</script>

<style>
</style>
