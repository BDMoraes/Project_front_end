import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import TasksAdmin from '@/components/admin/TasksAdmin'
import UserAdmin from '@/components/admin//UserAdmin'
import ToDoList from '@/components/admin/ToDoList'
import Auth from '@/components/auth/Auth'
import ForgotPass from '@/components/auth/ForgotPass'
import { userKey } from '@/global'

Vue.use(VueRouter)

const routes = [{
    name: 'home',
    path: '/',
    component: Home
}, {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
}, {
    name: 'toDoList',
    path: '/toDoList',
    component: ToDoList
},
{
    name: 'auth',
    path: '/auth',
    component: Auth
}
    , {
    name: 'TasksAdmin',
    path: '/tasksAdmin',
    component: TasksAdmin
}
    , {
    name: 'UserAdmin',
    path: '/userAdmin',
    component: UserAdmin
}, {
    name: 'forgotPass',
    path: '/forgotPass',
    component: ForgotPass
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        user && user.admin ? next() : next({ path: '/' })
    } else {
        next()
    }
})

export default router
