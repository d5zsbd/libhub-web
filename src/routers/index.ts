import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '../components/view/Login.vue';
import Signup from '../components/view/Signup.vue';
import Home from '../components/view/Home.vue';
import PostEditor from '../components/view/PostEditor.vue';
import Post from '../components/view/Post.vue';
import OwnedPosts from '../components/view/OwnedPosts.vue';
import FavoritePosts from '../components/view/FavoritePosts.vue';
import FollowingUsers from '../components/view/FollowingUsers.vue';
import Notification from '../components/view/Notification.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/:page?/:query?',
    name: 'home',
    component: Home,
    props: (route) => {
      const query = route.params.query ? JSON.parse(route.params.query as string) : {};
      
      return {
        ...query,
        page: typeof route.params.page === 'string' ? parseInt(route.params.page) : undefined
      }
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/post-editor/:postId?',
    name: 'postEditor',
    component: PostEditor,
    props: (route) => ({ postId: typeof route.params.postId === 'string' ? parseInt(route.params.postId) : route.params.postId })
  },
  {
    path: '/post/:id/:page?',
    name: 'post',
    component: Post,
    props: (route) => {
      const page = route.params.page ? { page: parseInt(route.params.page.toString()) } : {};

      return {
        id: typeof route.params.id === 'string' ? parseInt(route.params.id) : NaN,
        ...page
      };
    }
  },
  {
    path: '/user/:id/posts/:page',
    name: 'ownedPosts',
    component: OwnedPosts,
    props: (route) => ({
      id: typeof route.params.id === 'string' ? parseInt(route.params.id) : NaN,
      page: typeof route.params.page === 'string' ? parseInt(route.params.page) : NaN
    })
  },
  {
    path: '/user/following/:page',
    name: 'followingUsers',
    component: FollowingUsers,
    props: (route) => ({
      page: typeof route.params.page === 'string' ? parseInt(route.params.page) : NaN
    })
  },
  {
    path: '/user/favorites/:page',
    name: 'favoritePosts',
    component: FavoritePosts,
    props: route => ({ page: Number.parseInt(route.params.page as string) })
  },
  {
    path: '/user/notification/:page',
    name: 'notification',
    component: Notification,
    props: route => ({ page: Number.parseInt(route.params.page as string) })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;