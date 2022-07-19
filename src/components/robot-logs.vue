<template>
  <div style=";width: 100%">
    <el-button type="danger" size="mini" @click="delRobotLogs">
      清除日志
    </el-button> &nbsp;&nbsp;&nbsp;刷新于 {{updateTimes}} 秒前
    <el-table :data="robot.logs.content" style="width: 100%;" size="mini">
      <el-table-column label="时间" prop="id" align="center" width="134">
        <template slot-scope="{row}">
          <span>{{ row.createTime |date_format}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100px" align="center">
        <template slot-scope="{row}">
          <el-tag size="mini" effect="dark" v-if="row.direction ===null &&row.logType===0" type="success">买入</el-tag>
          <el-tag size="mini" effect="dark" v-if="row.direction ===null &&row.logType===1" type="danger">卖出</el-tag>
          <el-tag size="mini" effect="dark" v-if="row.direction===0" type="success">开多</el-tag>
          <el-tag size="mini" effect="dark" v-if="row.direction===1" type="danger">开空</el-tag>
          <el-tag size="mini" effect="dark" v-if="row.direction===2" type="warning">平多</el-tag>
          <el-tag size="mini" effect="dark" v-if="row.direction===3" type="warning">平空</el-tag>
          <el-tag size="mini" effect="dark" v-if="row.logType===3" type="info">错误</el-tag>
          <el-tag size="mini" effect="dark" v-if="row.logType===5" type="warm">信息</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="100px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.logType===0||row.logType===1">{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="80px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.logType===0||row.logType===1">{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信息" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.extra }}</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-show="robot.logs.totalElements > 0" :total="robot.logs.totalElements"
                :page.sync="logQuery.pageNum" :limit.sync="logQuery.pageSize" @pagination="getRobotLogs"/>
  </div>
</template>

<script>
  import {getRobot, robotStatus, robotLogs, robotProfit, delLogs, command} from '@/api/robot'
  import Pagination from '@/components/Pagination/index.vue'

  export default {
    name: 'robot-logs',
    components: {Pagination},
    props: {
      robotId: {
        type: String,
        default: 1
      },
    },
    data() {
      return {
        logQuery: {
          id: this.robotId,
          pageNum: 1,
          pageSize: 20
        },
        updateTimes: 0,
        robot: {
          logs: {
            content:[],
            totalElements:0,
          }
        }
      }
    },
    methods: {
      delRobotLogs() {
        delLogs({'robotId': this.robotId}).then(resp => {
          this.$notify({
            title: 'Success', message: '清除成功', type: 'success', duration: 2000
          })
          this.getRobotLogs()
        })
      },
      getRobotLogs() {
        robotLogs(this.logQuery).then(resp => {
          this.updateTimes = 0
          this.robot.logs = resp.data
        })
      },
    }
    ,
    mounted() {
      this.getRobotLogs()
      setInterval(()=>{
        this.getRobotLogs()
      },10000)

      setInterval(()=>{
        this.updateTimes ++
      },1000)
    },
  }
</script>
