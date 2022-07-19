<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        Add
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易对" width="120px" align="center">
        <template slot-scope="{row}">
          <span @click="handleUpdate(row)">{{ row.coinCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="k线周期" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.period }}</span>
        </template>
      </el-table-column>
      <el-table-column label="波动" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.amplitude }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="间隔" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.interval }}分钟</span>
        </template>
      </el-table-column>
      <el-table-column label="开关" width="110px" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.toggle"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949" @change="update(row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="上次推送时间" width="180px" align="center">
        <template slot-scope="{row}">
<!--          <span>{{ row.previousPushTime | date_format}}</span>-->
          <span>{{ aroundTime(row.previousPushTime)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"  >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px"
               style="width: 400px; ">
        <el-form-item label="交易对" prop="coinCode">
          <el-input v-model="temp.coinCode"/>
        </el-form-item>

        <el-form-item label="k线周期" prop="period">
          <el-select v-model="temp.period" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="波动(%)" prop="amplitude">
          <el-input v-model="temp.amplitude"/>
        </el-form-item>
        <el-form-item label="推送间隔(分)" prop="interval">
          <el-input v-model="temp.interval"/>
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

  </div>
</template>

<script>
  import {getList, save, del} from '@/api/coin-push'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination


  export default {
    name: 'ComplexTable',
    components: {Pagination},
    filters: {},
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          robotId:'',
          page: 1,
          limit: 20,
        },
        statusOptions: ['1m', '3m', '5m', '15m', '30m', '1h', '4h'],
        temp: {
          id: undefined,
          coinCode: null,
          period: null,
          amplitude: null,
          interval: null,
          toggle: 0,
          robotId: 0,
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          coinCode: [{required: true, message: ' is required', trigger: 'blur'}],
          period: [{required: true, message: ' is required', trigger: 'blur'}],
          amplitude: [{required: true, message: ' is required', trigger: 'blur'}],
          interval: [{required: true, message: ' is required', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.robotId = this.$route.query.robotId
      this.listQuery.robotId = this.$route.query.robotId
      this.getList()
    },
    methods: {
      aroundTime(startTime) {
        if(!startTime){
          return ''
        }
        let diffie = (new Date() - new Date(startTime)) / 1000; //计算时间差,并把毫秒转换成秒
        let days = parseInt(diffie / 86400); // 天  24*60*60*1000
        let hours = parseInt(diffie / 3600) - 24 * days; // 小时 60*60 总小时数-过去的小时数=现在的小时数
        let minutes = parseInt(diffie % 3600 / 60); // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
        let seconds = parseInt(diffie % 60); // 以60秒为一整份 取余 剩下秒数
        let daystr = ''
        let hourstr = ''
        let minutesstr = ''
        if(days !== 0){
          daystr = days + "天"
        }
        if(hours !== 0){
          hourstr = hours + "小时"
        }
        if(minutes !== 0){
          minutesstr = minutes + "分钟"
        }
        return daystr + hourstr + minutesstr + seconds + "秒" +'前'
      },

      update(row) {

        save(row).then(response => {

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
          robotId: this.robotId
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
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            save(this.temp).then(() => {
              this.dialogFormVisible = false
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
