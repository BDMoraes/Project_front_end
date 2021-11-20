import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3000
})

Vue.toasted.register(
    'defaultSuccess',
    payload => !payload.msg ? 'Operação realizada com sucesso!' : payload.msg,
    { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'defaultError',
    payload => !payload.msg ? 'Erro inesperado.' : payload.msg,
    { type : 'error', icon : 'times' }
)

Vue.toasted.register(
    'organizerSuccess',
    payload => !payload.msg ? 'ordenação das tarefas realizada com sucesso!' : payload.msg,
    { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'taskSuccess',
    payload => !payload.msg ? 'Parabéns! Tarefa concluída!' : payload.msg,
    { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'dailySuccess',
    payload => !payload.msg ? 'Parabéns! Diário concluído!' : payload.msg,
    { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'noInitTask',
    payload => !payload.msg ? 'Tarefa ainda não iniciada' : payload.msg,
    { type : 'error', icon : 'times' }
)

Vue.toasted.register(
    'initSuccess',
    payload => !payload.msg ? 'Tarefa iniciada!' : payload.msg,
    { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'yetInitTask',
    payload => !payload.msg ? 'Tarefa já foi iniciada!' : payload.msg,
    { type : 'error', icon : 'times' }
)


