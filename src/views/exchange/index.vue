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
      style="width: 500px"
    >

      <el-table-column label="ID" width="50px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="250px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.label }}</span>
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
        <el-form-item label="名称" prop="label">
          <el-input v-model="temp.label"/>
        </el-form-item>
        <el-form-item label="API KEY" prop="apiKey">
          <el-input v-model="temp.apiKey"/>
        </el-form-item>
        <el-form-item label="API SECRET" prop="apiSecret">
          <el-input v-model="temp.apiSecret"/>
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
  const privateKey = 'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEA0vfvyTdGJkdbHkB8\n' +
    'mp0f3FE0GYP3AYPaJF7jUd1M0XxFSE2ceK3k2kw20YvQ09NJKk+OMjWQl9WitG9p\n' +
    'B6tSCQIDAQABAkA2SimBrWC2/wvauBuYqjCFwLvYiRYqZKThUS3MZlebXJiLB+Ue\n' +
    '/gUifAAKIg1avttUZsHBHrop4qfJCwAI0+YRAiEA+W3NK/RaXtnRqmoUUkb59zsZ\n' +
    'UBLpvZgQPfj1MhyHDz0CIQDYhsAhPJ3mgS64NbUZmGWuuNKp5coY2GIj/zYDMJp6\n' +
    'vQIgUueLFXv/eZ1ekgz2Oi67MNCk5jeTF2BurZqNLR3MSmUCIFT3Q6uHMtsB9Eha\n' +
    '4u7hS31tj1UWE+D+ADzp59MGnoftAiBeHT7gDMuqeJHPL4b+kC+gzV4FGTfhR9q3\n' +
    'tTbklZkD2A=='
  import {del, getExchangeList, save} from '@/api/exchange'

  export default {
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
          id: null,
          label: null,
          apiKey: null,
          apiSecret: null,
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        rules: {
          label: [{required: true, message: ' is required', trigger: 'blur'}],
          apiKey: [{required: true, message: ' is required', trigger: 'blur'}],
          apiSecret: [{required: true, message: ' is required', trigger: 'blur'}],
        },
      }
    },
    created() {
      this.robotId = this.$route.query.robotId
      this.listQuery.robotId = this.$route.query.robotId
      this.getList()
    },
    methods: {

      getList() {
        this.listLoading = false
        getExchangeList(this.listQuery).then(response => {
          this.list = response.data
          // this.total = response.data.total
        })
      },

      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const exchange = {
              label: this.temp.label,
              apiKey: this.temp.apiKey,
              apiSecret: this.temp.apiSecret,
            }

            save(exchange).then(() => {
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
            const exchange = {
              id: this.temp.id,
              label: this.temp.label,
              apiKey: this.temp.apiKey,
              apiSecret: this.temp.apiSecret,
            }
            save(exchange).then(() => {
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
