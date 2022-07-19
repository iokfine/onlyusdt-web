<template>
  <div class="app-container">
    <div class="filter-container">
      <div >
        <robotInfoBar :info="robot.info"/>
        <!--        // 配置-->
        <el-collapse v-model="activeConfig">
          <el-collapse-item title="配置" name="1">
            <div style="text-align: center">
              <div>
                <span style="width: 100px;display: inline-block">交易所:&nbsp;&nbsp;</span>
                <span style="width: 50%;display: inline-block">{{robot.config.exchangeId}}</span>
              </div>
              <div><span style="width: 100px;display: inline-block">初始金额:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.initBalance"
                          disabled></el-input>
              </div>
              <div><span style="width: 100px;display: inline-block">币种列表:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.symbols"
                          disabled></el-input>
              </div>
              <div><span style="width: 100px;display: inline-block">k线周期:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.k"
                          disabled></el-input>
              </div>
              <div><span style="width: 100px;display: inline-block">ma:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.ma"
                          disabled></el-input>
              </div>
              <div><span style="width: 100px;display: inline-block">买入借币量:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.buyUnitPercent"
                          disabled></el-input>
              </div>
              <div><span style="width: 100px;display: inline-block">卖出借币量:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.sellUnitPercent"
                          disabled></el-input>
              </div>
              <div><span style="width: 100px;display: inline-block">转到现货阈值:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.maxBalance"
                          disabled></el-input>
              </div>
              <div><span style="width: 100px;display: inline-block">止盈比:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.stopProfit"
                          disabled></el-input>
              </div>
              <div><span style="width: 100px;display: inline-block">滑点强吃:&nbsp;&nbsp;</span>
                <el-input style="width: 50%" size="mini" v-model="robot.config.slippage"
                          disabled></el-input>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item title="收益曲线" name="2">
            <chart  :robotId="robotId" />
          </el-collapse-item>

          <el-collapse-item title="状态信息" name="3">
            <div style=";width: 100%">
              <div>更新时间：{{robot.status.time| date_format}}</div>
              <el-descriptions size="mini" direction="vertical" :column="13" border>
                <el-descriptions-item label="初始余额">
                  ${{robot.status.initBalance}}
                </el-descriptions-item>
                <el-descriptions-item label="当前余额">${{robot.status.currentBalance}}</el-descriptions-item>
                <el-descriptions-item label="累计收益">${{robot.status.totalProfit}}</el-descriptions-item>
                <el-descriptions-item label="收益率">{{robot.status.totalProfitRate}}%</el-descriptions-item>
                <el-descriptions-item label="转到现货">${{robot.status.transferredAsset}}</el-descriptions-item>
                <el-descriptions-item label="交易币种">{{robot.status.currency}}</el-descriptions-item>
                <el-descriptions-item label="方向">
                  <el-tag size="mini" effect="dark" v-if="robot.status.dir==='0'" type="success">多</el-tag>
                  <el-tag size="mini" effect="dark" v-if="robot.status.dir==='1'" type="danger">空</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="借款(利息)">${{robot.status.borrowed}}</el-descriptions-item>
                <el-descriptions-item label="开仓价格">${{robot.status.orderPrice}}</el-descriptions-item>
                <el-descriptions-item label="标记价格">${{robot.status.currentPrice}}</el-descriptions-item>
                <el-descriptions-item label="浮亏">{{robot.status.fukuiRate}}%</el-descriptions-item>
                <el-descriptions-item label="预估强平">${{robot.status.ping}}</el-descriptions-item>
                <el-descriptions-item label="操作">
                  <el-button type="danger" size="mini" @click="coverAll">
                    平仓
                  </el-button>
                </el-descriptions-item>
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
  import {getRobot, robotStatus,  command} from '@/api/robot'

  import chart from '@/components/chart-profit.vue'
  import robotLogBar from '@/components/robot-logs.vue'
  import robotInfoBar from '@/components/robot-info.vue'

  export default {
    components: {chart,robotLogBar,robotInfoBar},
    data() {
      return {
        // activeConfig: ['1', '3', '4'],
        activeConfig: ['3', '4'],
        robotId: "",
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
