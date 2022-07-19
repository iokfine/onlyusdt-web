<template>
  <div class="app-container">
    <div class="filter-container">
      <div>
         <robotInfoBar :info="robot.info"/>
        <!--        // 配置-->
        <el-collapse v-model="activeConfig">
          <el-collapse-item title="配置" name="1">

          </el-collapse-item>

          <el-collapse-item title="收益曲线" name="2">
             <chart  :robotId="robotId" />
          </el-collapse-item>

          <el-collapse-item title="状态信息" name="3">
            <div style=";width: 100%">
              <div>更新时间：{{robot.status.time| date_format}}</div>
              <el-descriptions size="mini" direction="vertical" :column="13" border>
                <el-descriptions-item label="初始余额">${{robot.status.initBalance}}</el-descriptions-item>
                <el-descriptions-item label="当前余额">${{robot.status.currentBalance}}</el-descriptions-item>
                <el-descriptions-item label="累计收益">${{robot.status.totalProfit}}</el-descriptions-item>
                <el-descriptions-item label="收益率">{{robot.status.totalProfitRate}}%</el-descriptions-item>
                <el-descriptions-item label="交易币种">{{robot.status.currency}}</el-descriptions-item>
                <el-descriptions-item label="持有价值">{{robot.status.value}}</el-descriptions-item>
                <el-descriptions-item label="最新价格">{{robot.status.lastPrice}}</el-descriptions-item>

                <!--                <el-descriptions-item label="操作">-->
<!--                  <el-button type="danger" size="mini" @click="coverAll">-->
<!--                    平仓-->
<!--                  </el-button>-->
<!--                </el-descriptions-item>-->
              </el-descriptions>

            </div>
          </el-collapse-item>

          <el-collapse-item title="日志" name="4">
           <robotLogBar :robotId="robotId"/>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
  import {getRobot, robotStatus, robotLogs, robotProfit, delLogs, command} from '@/api/robot'

  import chart from '@/components/chart-profit.vue'
  import robotLogBar from '@/components/robot-logs.vue'
  import robotInfoBar from '@/components/robot-info.vue'
  import {mapGetters} from "vuex";
  import Identicon from "identicon.js";
  import md5 from "blueimp-md5";

  export default {
    components: {chart,robotLogBar,robotInfoBar},


    data() {
      return {
        // activeConfig: ['1', '3', '4'],
        activeConfig: ['2','3', '4'],
        robotId: 0,
        robot: {
          info: {},
          config: {},
          status: {},
        },
      }
    },
    created() {
      this.robotId = this.$route.query.robotId
      this.getRobotInfo()
      this.getRobotStatus()
    },
    methods: {
      coverAll() {
        command({robotId: this.robotId, command: "coverAll"}).then(resp => {
          this.$notify({
            title: 'Success', message: '发送命令成功', type: 'success', duration: 2000
          })
        })
      },
      getRobotInfo() {
        getRobot({id: this.robotId}).then(resp => {
          this.robot.info = resp.data
          this.robot.config = JSON.parse(resp.data.param)
        })
      },
      getRobotStatus() {
        robotStatus({id: this.robotId}).then(resp => {
          this.robot.status = resp.data
        })
      },

    }
  }
</script>
