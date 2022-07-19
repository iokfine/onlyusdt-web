<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        创建机器人
      </el-button>
      <el-button style="margin-left: 10%" class="el-icon-refresh" size="mini" @click="getList">刷新</el-button>

    </div>
    <el-table
      :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column label="名称" prop="id" sortable="custom" align="center" min-width="120">
        <template slot-scope="{row}">
          <router-link v-for="item in types" :key="item.value"
                       v-if="row.type===item.value" :to="{name: item.name ,query: {robotId:row.id}}"
                       style="color: blue">{{ row.name }}
          </router-link>
          <!--          <router-link v-if="row.type===1" :to="{name:'maLeverTrade',query: {robotId:row.id}}" style="color: blue">{{ row.name }}</router-link>-->
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ findTypeLabel(row.type).label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.profit?row.profit:0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949" @change="start(row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ aroundTime(row.createTime)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            配置
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px"
               style="width: 400px; ">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select" @change="typeOnChange">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="配置" :visible.sync="strategy.market.dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="strategy.market" label-position="left" label-width="110px"
               style="width: 400px; ">
        <el-form-item label="邮件地址" prop="name">
          <el-input v-model="strategy.market.param.email"/>
        </el-form-item>
        <el-form-item label="延迟" prop="name">
          <el-input v-model="strategy.market.param.delay"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"
                   @click="strategy.market.dialogStatus==='create'?strategy.market.dialogFormVisible=false:updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!--    ma交易策略-->
    <el-dialog title="配置" :visible.sync="strategy.maLeverTrade.dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="strategy.maLeverTrade" label-position="left" label-width="110px"
               style="min-width: 400px; ">
        <el-form-item label="交易所" prop="exchangeId">
          <el-select v-model="strategy.maLeverTrade.param.exchangeId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in exchanges" :key="item.id" :label="item.label"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="k线周期" prop="k">
          <el-select v-model="strategy.maLeverTrade.param.k" class="filter-item" placeholder="Please select">
            <el-option v-for="item in strategy.maLeverTrade.ks" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="初始余额" prop="initBalance">
          <el-input v-model="strategy.maLeverTrade.param.initBalance"/>
        </el-form-item>
        <el-form-item label="交易币种" prop="symbols">
          <el-input v-model="strategy.maLeverTrade.param.symbols"/>
        </el-form-item>
        <el-form-item label="ma" prop="ma">
          <el-input v-model="strategy.maLeverTrade.param.ma"/>
        </el-form-item>
        <el-form-item label="买入借币量" prop="buyUnitPercent">
          <el-input v-model="strategy.maLeverTrade.param.buyUnitPercent"/>
        </el-form-item>
        <el-form-item label="卖出借币量" prop="sellUnitPercent">
          <el-input v-model="strategy.maLeverTrade.param.sellUnitPercent"/>
        </el-form-item>
        <el-form-item label="转到现货阈值" prop="maxBalance">
          <el-input v-model="strategy.maLeverTrade.param.maxBalance"/>
        </el-form-item>
        <el-form-item label="止盈比" prop="stopProfit">
          <el-input v-model="strategy.maLeverTrade.param.stopProfit"/>
        </el-form-item>
        <el-form-item label="滑点强吃" prop="slippage">
          <el-input v-model="strategy.maLeverTrade.param.slippage"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"
                   @click="strategy.maLeverTrade.dialogStatus==='create'?strategy.maLeverTrade.dialogFormVisible=false:updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!--    swap-->
    <el-dialog title="配置" :visible.sync="strategy.swapGridTrade.dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="strategy.swapGridTrade.param" label-position="left" label-width="110px"
               style="min-width: 400px; ">
        <el-form-item label="交易所" prop="exchangeId">
          <el-select v-model="strategy.swapGridTrade.param.exchangeId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in exchanges" :key="item.id" :label="item.label"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="初始余额" prop="initBalance">
          <el-input v-model="strategy.swapGridTrade.param.initBalance"/>
        </el-form-item>
        <el-form-item label="杠杆" prop="marginLever">
          <el-input v-model="strategy.swapGridTrade.param.marginLevel"/>
        </el-form-item>
        <el-form-item label="开多" prop="longSwitch">
          <el-switch v-model="strategy.swapGridTrade.param.longSwitch" active-color="#13ce66"
                     inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="开空" prop="shortSwitch">
          <el-switch v-model="strategy.swapGridTrade.param.shortSwitch" active-color="#13ce66"
                     inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="交易币种" prop="symbols">
          <el-input v-model="strategy.swapGridTrade.param.symbols"/>
        </el-form-item>
        <el-form-item label="网格类型" prop="symbols">
          <el-select v-model="strategy.swapGridTrade.param.netType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in strategy.swapGridTrade.netTypes" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="最低价格" prop="low">
          <el-input v-model="strategy.swapGridTrade.param.low"/>
        </el-form-item>
        <el-form-item label="最高价格" prop="high">
          <el-input v-model="strategy.swapGridTrade.param.high"/>
        </el-form-item>
        <el-form-item label="网格数量" prop="gridNum">
          <el-input v-model="strategy.swapGridTrade.param.gridNum"/>
        </el-form-item>
        <el-form-item label="初始保证金" prop="firstMarginAsset">
          <el-input v-model="strategy.swapGridTrade.param.firstMarginAsset"/>
        </el-form-item>
      </el-form>
      <div><span style="color: red"> {{preRate_swap}}</span></div>
      <div><span style="color: red">{{interval_swap}}</span></div>
      <div><span style="color: red">{{fullnet_swap}}</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"
                   @click="strategy.swapGridTrade.dialogStatus==='create'?strategy.swapGridTrade.dialogFormVisible=false:updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="配置" :visible.sync="strategy.mock.dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="strategy.mock.param" label-position="left" label-width="110px"
               style="min-width: 400px; ">
        <el-form-item label="初始余额" prop="initBalance">
          <el-input v-model="strategy.mock.param.initBalance"/>
        </el-form-item>
        <el-form-item label="交易币种" prop="symbols">
          <el-input v-model="strategy.mock.param.symbols"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"
                   @click="strategy.mock.dialogStatus==='create'?strategy.mock.dialogFormVisible=false:updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <!--    现货网格交易-->
    <el-dialog title="配置" :visible.sync="strategy.spotGridTrade.dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="strategy.spotGridTrade.param" label-position="left" label-width="110px"
               style="min-width: 400px; ">
        <el-form-item label="交易所" prop="exchangeId">
          <el-select v-model="strategy.spotGridTrade.param.exchangeId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in exchanges" :key="item.id" :label="item.label"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="初始余额" prop="initBalance">
          <el-input v-model="strategy.spotGridTrade.param.initBalance"/>
        </el-form-item>
        <el-form-item label="交易币种" prop="symbols">
          <el-input v-model="strategy.spotGridTrade.param.symbols"/>
        </el-form-item>
        <el-form-item label="网格类型" prop="symbols">
          <el-select v-model="strategy.spotGridTrade.param.netType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in strategy.spotGridTrade.netTypes" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="最低价格" prop="low">
          <el-input v-model="strategy.spotGridTrade.param.low"/>
        </el-form-item>
        <el-form-item label="最高价格" prop="high">
          <el-input v-model="strategy.spotGridTrade.param.high"/>
        </el-form-item>
        <el-form-item label="网格数量" prop="gridNum">
          <el-input v-model="strategy.spotGridTrade.param.gridNum"/>
        </el-form-item>
        <el-form-item label="初始保证金" prop="firstMarginAsset">
          <el-input v-model="strategy.spotGridTrade.param.firstMarginAsset"/>
        </el-form-item>
      </el-form>
      <div><span style="color: red"> {{interval}}</span></div>
      <div><span style="color: red">{{preRate}}</span></div>
      <div><span style="color: red">{{fullnet}}</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"
                   @click="strategy.spotGridTrade.dialogStatus==='create'?strategy.spotGridTrade.dialogFormVisible=false:updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {aroundTime} from '@/utils/date'
  import {getList, save, del, start} from '@/api/robot'
  import {getExchangeList} from '@/api/exchange'
  import {getInfo} from '@/api/login'
  import Pagination from '@/components/Pagination'
  import {ROBOT_STRATEGY} from "../../partten"; // secondary package based on el-pagination


  export default {
    name: 'ComplexTable',
    components: {Pagination},
    filters: {},
    computed: {
      preRate() {
        let param = this.strategy.spotGridTrade.param;
        if (!param.low || !param.high || !param.netType || !param.gridNum || !param.firstMarginAsset) {
          return ""
        }
        if (this.strategy.spotGridTrade.param.netType === 1) {
          let tsx = (this.strategy.spotGridTrade.param.high - this.strategy.spotGridTrade.param.low) / this.strategy.spotGridTrade.param.gridNum;
          let tsxhRate = tsx / (this.strategy.spotGridTrade.param.high - tsx) * 100 - 0.2
          let tsxLRate = tsx / (this.strategy.spotGridTrade.param.low) * 100 - 0.2

          let rateStr = tsxhRate.toFixed(2) + "% - " + tsxLRate.toFixed(2) + "%"


          let profitStr = (this.strategy.spotGridTrade.param.firstMarginAsset * tsxhRate / 100).toFixed(2) + " - " + (this.strategy.spotGridTrade.param.firstMarginAsset * tsxLRate / 100).toFixed(2)
          return "每格收益(除去手续费)  " + rateStr + " (" + profitStr + ")"
        } else {
          let rateStr = (this.strategy.spotGridTrade.param.high / this.strategy.spotGridTrade.param.low) ^ (1 / this.strategy.spotGridTrade.param.gridNum);
          let profitStr = 1;
          return "每格收益(除去手续费)  " + rateStr + " (" + profitStr + ")"
        }

      },
      interval() {
        let param = this.strategy.spotGridTrade.param;
        if (!param.low || !param.high || !param.netType || !param.gridNum || !param.firstMarginAsset) {
          return ""
        }
        if (this.strategy.spotGridTrade.param.netType === 1) {
          return "下单间隔  " + (this.strategy.spotGridTrade.param.high - this.strategy.spotGridTrade.param.low) / this.strategy.spotGridTrade.param.gridNum;
        }

      },
      fullnet() {
        let param = this.strategy.spotGridTrade.param;
        if (!param.gridNum || !param.firstMarginAsset) {
          return ""
        }
        return "满网格需要金额  " + this.strategy.spotGridTrade.param.gridNum * this.strategy.spotGridTrade.param.firstMarginAsset;
      },

      preRate_swap() {
        let param = this.strategy.swapGridTrade.param;
        if (!param.low || !param.high || !param.netType || !param.gridNum || !param.firstMarginAsset) {
          return ""
        }
        if (param.netType === 1) {
          let tsx = (param.high - param.low) / param.gridNum;
          let tsxhRate = (tsx / (param.high - tsx) * 100 - 0.04) * param.marginLevel
          let tsxLRate = (tsx / (param.low) * 100 - 0.04) * param.marginLevel

          let rateStr = tsxhRate.toFixed(4) + "% - " + tsxLRate.toFixed(4) + "%"


          let profitStr = (param.firstMarginAsset * tsxhRate / 100).toFixed(4) + " - " + (param.firstMarginAsset * tsxLRate / 100).toFixed(4)
          return "每格收益(除去手续费)  " + rateStr + " (" + profitStr + ")"
        } else {
          return ""
        }

      },
      interval_swap() {
        let param = this.strategy.swapGridTrade.param;
        if (!param.low || !param.high || !param.netType || !param.gridNum || !param.firstMarginAsset) {
          return ""
        }
        if (param.netType === 1) {
          return "下单间隔  " + (param.high - param.low) / param.gridNum;
        }

      },
      fullnet_swap() {
        let param = this.strategy.swapGridTrade.param;
        if (!param.gridNum || !param.firstMarginAsset) {
          return ""
        }
        return "满网格需要金额  " + param.gridNum * param.firstMarginAsset;
      },
    },
    data() {
      return {
        aroundTime,
        robotId: this.$route.query.robotId,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
        },
        types: ROBOT_STRATEGY,
        temp: {
          id: undefined,
          name: null,
          type: null,
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          name: [{required: true, message: ' is required', trigger: 'blur'}],
          type: [{required: true, message: ' is required', trigger: 'blur'}],
        },
        exchanges: [],
        strategy: {
          market: {
            dialogFormVisible: false,
            dialogStatus: '',
            param: {
              email: '',
              delay: 500,
            }
          },
          maLeverTrade: {
            dialogFormVisible: false,
            dialogStatus: '',
            ks: ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M',],
            param: {
              exchangeId: null,
              k: '1h',
              initBalance: 1000,
              symbols: "BTC_USDT,LTC_USDT",
              ma: 30,
              buyUnitPercent: 0.5,
              sellUnitPercent: 0.5,
              maxBalance: null,
              stopProfit: 0.15,
              slippage: 0.001,
            }
          },
          swapGridTrade: {
            dialogFormVisible: false,
            dialogStatus: '',
            netTypes: [{
              label: '等差',
              value: 1
            },
            //   {
            //   label: '等比',
            //   value: 2
            // }
            ],
            param: {
              exchangeId: null,
              initBalance: 1000,
              marginLevel: 5,
              longSwitch: false,
              shortSwitch: false,
              symbols: "BTC_USDT",
              firstMarginAsset: null,
              gridNum: null,
              low: null,
              high: null,
            }
          },
          mock: {
            dialogFormVisible: false,
            dialogStatus: '',
            param: {
              initBalance: 1000,
              symbols: "BTC_USDT,LTC_USDT",
            }
          },
          spotGridTrade: {
            dialogFormVisible: false,
            dialogStatus: '',
            netTypes: [{
              label: '等差',
              value: 1
            },
            //   {
            //   label: '等比',
            //   value: 2
            // }
            ],
            param: {
              exchangeId: null,
              netType: null,
              initBalance: 1000,
              symbols: "BTC_USDT",
              firstMarginAsset: null,
              gridNum: null,
              low: null,
              high: null,
            }
          },
        }
      }
    },
    created() {
      // 获取用户信息
      getInfo().then((resp) => {
        this.strategy.market.param.email = resp.data.user.mail
      })
      // 获取交易所信息
      getExchangeList().then(resp => {
        this.exchanges = resp.data
      })

      this.getList()
    },
    methods: {
      typeOnChange(val) {
        let typeObj = this.findTypeLabel(val)
        this.strategy[typeObj.name].dialogFormVisible = true
        this.strategy[typeObj.name].dialogStatus = 'create'
      },

      findTypeLabel(value) {
        let typeObj = ''
        this.types.forEach(type => {
          if (type.value === value) {
            typeObj = type
          }
        })
        return typeObj
      },

      start(row) {
        start(row).then(response => {

        })
      },
      getList() {
        this.listLoading = false
        getList(this.listQuery).then(response => {
          this.list = response.data
          // this.total = response.data.total
        })
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          coinCode: "_USDT",
          period: "5m",
          amplitude: 0.25,
          interval: 15,
          toggle: 0,
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let typeObj = this.findTypeLabel(this.temp.type)
            this.temp.param = this.strategy[typeObj.name].param
            save(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success', message: 'Created Successfully', type: 'success', duration: 2000
              })
              this.getList()
            })
          }
        })
      },

      handleUpdate(row) {
        let typeObj = this.findTypeLabel(row.type)
        this.strategy[typeObj.name].param = JSON.parse(row.param)
        this.strategy[typeObj.name].dialogStatus = 'update'
        this.strategy[typeObj.name].dialogFormVisible = true
        this.temp.type = row.type
        this.temp.id = row.id

        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let typeObj = this.findTypeLabel(this.temp.type)
            this.temp.param = this.strategy[typeObj.name].param
            save(this.temp).then(() => {
              this.strategy[typeObj.name].dialogFormVisible = false
              this.$notify({
                title: 'Success', message: 'Update Successfully', type: 'success', duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      handleDelete(row, index) {
        del(row).then(() => {
          this.$notify({
            title: 'Success', message: 'Created Successfully', type: 'success', duration: 2000
          })
          this.getList()
        })
      },

    }
  }
</script>
