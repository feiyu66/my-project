import Vue from 'vue'
import Router from 'vue-router'
// import { delCookie, getCookie } from '../util/util'
// 登录
import Login from '../views/Login/Login.vue'
// 修改密码
import Password from '../views/Password/index.vue'
// 体检
import Statistics from '@/views/Statistics/index'
// 体检 ----》 体检人数统计
import Attribute from '@/views/Statistics/Children/Attribute'
// 体检 ----》 体检人员属性分析
import Analysis from '@/views/Statistics/Children/Analysis'
// 管理
import Objectives from '@/views/Objectives/index.vue'
// 管理目标 ----> 管理目标统计 - 概述
import Outline from '@/views/Objectives/Children/Outline.vue'
// 管理目标 ----> 管理目标属性分布
import Cobjectives from '@/views/Objectives/Children/Cobjectives.vue'
// 病种
import Disease from '@/views/Disease/index.vue'
// 病种 ----》 病种统计 - 概述
import attributeAnalysis from '@/views/Disease/children/Attribute-analysis.vue'
// 病种 ----》 病种属性分布
import diseaseStatistics from '@/views/Disease/children/Disease_statistics.vue'
// 患者内容管理分布
import PatientContent from '@/views/Patient-content/index.vue'
// 患者内容管理分布 -----》 患者内容管理
import contentManagement from '@/views/Patient-content/children/ContentManagement.vue'
// 患者内容管理分布 -----》 添加文章
import addData from '@/views/AddData/AddData.vue'
// 患者内容管理分布 -----》 编辑文章
import editArticle from '@/views/editArticle/editArticle.vue'
//  文章预览
import Preview from '@/views/Preview/preview.vue'
// 意见与反馈
import Opinion from '@/views/Opinion/index.vue'
// 医院管理
import HCManagement from '@/views/HCManagement/index.vue'
// ---- 医护管理 ----
import healthCare from '@/views/HCManagement/children/healthCare.vue'
// ---- 合作医院管理 ----
import cHospital from '@/views/HCManagement/children/cHospital.vue'
// ---- 合作医院跑步机管理 ----
import treadmill from '@/views/HCManagement/children/treadmill.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
      isFull: true,
      meta: {
        isFull: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      isFull: true,
      meta: {
        isFull: true
      }
    },
    {
      title: '修改密码',
      path: '/password',
      name: 'password',
      icon: 'fa fa-home fa-lg',
      component: Password,
      isFull: true,
      meta: {
        isPwd: true
      }
    },
    {
      title: '体检人次统计分布',
      path: '/statistics',
      name: 'statistics',
      imgUrl: 'http://doctor.dlcaring.com/health_icon.png',
      component: Statistics,
      redirect: 'attribute',
      children: [
        {
          title: '体检人次统计',
          name: 'attribute',
          path: 'attribute',
          icon: 'images',
          component: Attribute
        },
        {
          title: '体检人员属性分布',
          name: 'analysis',
          path: 'analysis',
          icon: 'images',
          component: Analysis
        }
      ]
    },
    {
      title: '管理目标统计分布',
      path: '/objectives',
      name: 'objectives',
      imgUrl: 'http://doctor.dlcaring.com/Goal_icon.png',
      component: Objectives,
      children: [
        {
          title: '管理目标分布概述',
          name: 'outline',
          path: 'outline',
          component: Outline
        },
        {
          title: '各目标人群属性分布',
          name: 'cobjectives',
          path: 'cobjectives',
          component: Cobjectives
        }
      ]
    },
    {
      title: '病种统计分布',
      path: '/disease',
      name: 'disease',
      imgUrl: 'http://doctor.dlcaring.com/entity_icon.png',
      component: Disease,
      children: [
        {
          title: '病种分布概述',
          name: 'attributeAnalysis',
          path: 'attributeAnalysis',
          component: attributeAnalysis
        },
        {
          title: '各病种人群属性分布',
          name: 'diseaseStatistics',
          path: 'diseaseStatistics',
          component: diseaseStatistics
        }
      ]
    },
    {
      title: '患教内容管理',
      path: '/patient-content',
      name: 'patient-content',
      imgUrl: 'http://doctor.dlcaring.com/content_icon.png',
      component: PatientContent,
      children: [
        {
          title: '文章管理',
          name: 'contentManagement',
          path: 'contentManagement',
          component: contentManagement
        }
      ]
    },
    {
      title: '添加文章',
      name: 'addData',
      path: '/addData',
      component: addData,
      isFull: true,
      meta: {
        isArticle: true
      }
    },
    {
      title: '编辑文章',
      name: 'editArticle',
      path: '/editArticle',
      component: editArticle,
      isFull: true,
      meta: {
        isArticle: true
      }
    },
    {
      title: '文章预览',
      name: 'preview',
      path: '/preview',
      component: Preview,
      isFull: true,
      meta: {
        isArticle: true
      }
    },
    {
      title: '意见与反馈',
      path: '/opinion',
      name: 'opinion',
      imgUrl: 'http://doctor.dlcaring.com/feedback_icon.png',
      component: Opinion
    }
    // {
    //   title: '医院管理',
    //   path: '/HCManagement',
    //   name: 'HCManagement',
    //   imgUrl: 'http://doctor.dlcaring.com/hospital.png',
    //   component: HCManagement,
    //   children: [
    //     {
    //       title: '医护管理',
    //       name: 'healthCare',
    //       path: 'healthCare',
    //       icon: 'images',
    //       component: healthCare
    //     },
    //     {
    //       title: '合作医院管理',
    //       name: 'cHospital',
    //       path: 'cHospital',
    //       icon: 'images',
    //       component: cHospital
    //     },
    //     {
    //       title: '合作医院跑步机管理',
    //       name: 'treadmill',
    //       path: 'treadmill',
    //       icon: 'images',
    //       component: treadmill
    //     }
    //   ]
    // }
  ]
})
export default router
