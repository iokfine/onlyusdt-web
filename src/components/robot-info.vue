<template>
  <el-descriptions title="信息" :column="2" size="mini">
    <el-descriptions-item label="名称">{{info.name}}</el-descriptions-item>
    <el-descriptions-item label="状态">
      <el-tag size="mini" effect="dark" v-if="info.status===0" type="success">开启</el-tag>
      <el-tag size="mini" effect="dark" v-if="info.status===1" type="danger">关闭</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="创建时间">{{info.createTime?new Date(info.createTime):''}}</el-descriptions-item>
    <el-descriptions-item label="活动时间">{{info.updateTime?new Date(info.updateTime):''}}</el-descriptions-item>
  </el-descriptions>
</template>

<script>

  export default {
    name: 'robot-info',
    props: {
      info: {
        type: Object,
        default: null
      },
    },
    data() {
      return {}
    },
    methods: {}
    ,
    mounted() {
    }
    ,
  }
</script>
