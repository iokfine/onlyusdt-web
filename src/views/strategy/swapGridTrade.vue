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
            <chart :robotId="robotId"/>
          </el-collapse-item>

          <el-collapse-item title="状态信息" name="3">
            <div style="width: 100%">
              <el-card shadow="never">
                <div class="tableDesc">账户信息</div>
                <el-table :empty-text="empty" :data="robot.statusTable" style="width: 100%;" size="mini">
                  <el-table-column label="初始余额" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.initBalance }}</span></template>
                  </el-table-column>
                  <el-table-column label="当前余额" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.currentBalance }}</span></template>
                  </el-table-column>
                  <el-table-column label="保证金余额" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.marginBalance }}</span></template>
                  </el-table-column>
                  <el-table-column label="已用保证金" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.alreadymarginBalance }}</span></template>
                  </el-table-column>
                  <el-table-column label="总收益(收益率)" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.totalProfit }}-{{row.totalProfitRate}}</span></template>
                  </el-table-column>
                </el-table>
              </el-card>
              <el-card shadow="never">
                <div class="tableDesc">交易对信息</div>

                <el-table :empty-text="empty" :data="robot.statusTable" style="width: 100%;" size="mini">
                  <el-table-column label="币种" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.currency }}</span></template>
                  </el-table-column>

                  <el-table-column label="方向" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.dir }}</span></template>
                  </el-table-column>
                  <el-table-column label="数量" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.amount }}</span></template>
                  </el-table-column>
                  <el-table-column label="持仓价格" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.buyAvgPrice }}</span></template>
                  </el-table-column>
                  <el-table-column label="当前价格" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.currentPrice }}</span></template>
                  </el-table-column>
                  <el-table-column label="持仓价值" min-width="100px">
                    <template slot-scope="{row}"><span>{{ row.haveValue }}</span></template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="100px">
                    <template slot-scope="{row}">
                      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary">
                        平仓
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
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

  export default {
    components: {chart, robotLogBar, robotInfoBar},
    data() {
      return {
        // activeConfig: ['1', '3', '4'],
        activeConfig: ['3', '4'],
        empty: ' ',
        robotId: 0,
        robot: {
          info: {},
          config: null,
          status: null,
          statusTable: []
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
          if (this.robot.status) {
            this.robot.statusTable.push(this.robot.status)
          }
        })
      },

    }
  }
</script>
