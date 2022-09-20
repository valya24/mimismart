import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import store from '../store/index.js';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "room" */ '../views/Home/Home.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        components: {
          default: () => import(/* webpackChunkName: "homeMain" */ '../views/Home/HomeMain/HomeMain.vue'),
          // header: () => import(/* webpackChunkName: "homeMainHeader" */ '../components/Header.vue'),
          header: () => import(/* webpackChunkName: "homeMainHeader" */ '../views/Home/HomeMain/HomeMainHeader.vue'),
        },
        props: {
          header: { title: "Весь дом" }
        }
      },
      {
        path: 'room/:id',
        name: 'HomeRoom',
        components: {
          default: () => import(/* webpackChunkName: "homeRoom" */ '../views/Home/HomeRoom/HomeRooms.vue'),
          header: () => import(/* webpackChunkName: "homeRoomHeader" */ '../views/Home/HomeRoom/HomeRoomHeader.vue'),
        },
        async beforeEnter (to, from, next) {
          if (!store.state.floors || !store.state.floors.length) {
            let unwatch = store.watch(state => state.logicParsed, function (newVal) {
              if (newVal) {
                // store.commit('selectRoom', to.params.id);
                unwatch();
                next();
              }
            });
            await store.dispatch("loadLogic");
          } else {
            // store.commit('selectRoom', to.params.id);
            next();
          }
        }
      },
      {
        path: 'room/:id/change-photo',
        name: 'ChangeRoomPhoto',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        components: {
          default: () => import(/* webpackChunkName: "changePhoto" */ '../views/UIKit/ChangeRoomPhoto.vue'),
        },
        async beforeEnter(to, from, next) {
          if (!store.state.floors || !store.state.floors.length) {
            let unwatch = store.watch(state => state.logicParsed, function (newVal) {
              if (newVal) {
                // store.commit('selectRoom', to.params.id);
                unwatch();
                next();
              }
            });
            await store.dispatch("loadLogic");
          } else {
            // store.commit('selectRoom', to.params.id);
            next();
          }
        }
      },
      {
        path: 'category/:category',
        name: 'DevicesByCategory',
        components: {
          default: () => import(/* webpackChunkName: "category" */ '../views/Home/HomeMain/DevicesByCategory.vue'),
          header: () => import(/* webpackChunkName: "categoryHeader" */ '../views/Home/HomeMain/DevicesByCategoryHeader.vue'),
        },
      },
    ]
  },
  // {
  //   path: '/category/:category',
  //   name: 'DevicesByCategory',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "category" */ '../views/Home/HomeMain/DevicesByCategory.vue')
  // },
  {
    path: '/favorites',
    name: 'Favorites',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "favorites" */ '../views/Favorites.vue')
  },
  {
    path: '/notifications',
    name: 'Notifications',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "notifications" */ '../views/Notifications.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    path: '/uiroom',
    name: 'UIRoom',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/Home/UIRoom.vue')
  },
  
  // {
  //   path: '/change-room-photo',
  //   name: 'ChangeRoomPhoto',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "settings" */ '../views/UIKit/ChangeRoomPhoto.vue')
  // },
  {
    path: '/uikit',
    name: 'UIKit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/UIKit/Uikit.vue')
  },
  {
    path: '/create-light-scheme',
    name: 'CreateLightScheme',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/UIKit/CreateLightScheme.vue')
  },
  {
    path: '/modaldevice',
    name: 'ModalDeviceControl',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/UIKit/ModalDeviceControl.vue')
  },
  {
    path: '/iconsgrid',
    name: 'IconsGrid',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/UIKit/IconsGrid.vue')
  },
  {
    path: '/modal-with-buttons',
    name: 'ModalWithButtons',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "settings" */ '../views/UIKit/ModalWithButtons.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
