<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline" style="padding: 10px 50px">
        <el-form-item label="用户ID">
          <el-input v-model="search.id"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="search.name"></el-input>
        </el-form-item>
        <el-form-item label="邀请人ID">
          <el-input v-model="search.refferId"></el-input>
        </el-form-item>
        <!--        <el-form-item label="类型">-->
        <!--          <el-select v-model="search.type">-->
        <!--            <el-option label="区域一" value="shanghai"></el-option>-->
        <!--            <el-option label="区域二" value="beijing"></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="getPusers(1)">查询</el-button>
          <el-button @click="()=>{
            this.search = this.$options.data().search;
            this.getPusers(1)
          }">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="134">
        <template slot-scope="{row}">
          <span>{{ row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          {{row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="邀请人ID" width="100px" align="center">
        <template slot-scope="{row}">
          {{row.refferid}}
        </template>
      </el-table-column>
      <el-table-column label="过期时间" align="center">
        <template slot-scope="{row}">
          {{row.dueTime}}
        </template>
      </el-table-column>
      <el-table-column label="账户限数量" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.accountMax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center">
        <template slot-scope="{row}">
          {{row.createTime | date_format}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button
            size="mini"
            @click="handleEdit(row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="width: 100%;text-align: center">
      <el-pagination
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        @prev-click="getPusers"
        @next-click="getPusers"
        @current-change="getPusers"
        layout="prev, pager, next,total,jumper"
        :total="page.totalElements">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="modal.edit" width="500">
      <!--      <el-form-item label="活动名称">-->
      <!--        <el-input v-model="currentRow.userName"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="活动区域">-->
      <!--        <el-select v-model="form.region" placeholder="请选择活动区域">-->
      <!--          <el-option label="区域一" value="shanghai"></el-option>-->
      <!--          <el-option label="区域二" value="beijing"></el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->

      <el-form label-width="100px" label-position="left">
        <el-form-item label="最大账户数">
          <el-input-number v-model="currentRow.accountMax" :min="1" :max="500" ></el-input-number>
        </el-form-item>
        <el-form-item label="到期时间" >
          <el-date-picker type="datetime" placeholder="选择日期" v-model="currentRow.dueTime"
                          style="width: 300px"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getPremintUserlist, updatePremintUser} from "@/api/premint";

  export default {
    data() {
      return {
        page: {
          pageNum: 1,
          pageSize: 20,
          totalElements: 0,
        },
        search: {
          id: '',
          name: '',
          refferId: '',
          type: '',
        },
        updateTimes: 0,
        tableData: [],
        modal: {
          edit: false
        },
        currentRow: {
          id: '',
          dueTime: '',
          accountMax: '',
        }
      }
    },
    methods: {
      submitUpdate(){
        updatePremintUser(this.currentRow).then(resp=>{
          this.getPusers()
          this.modal.edit = false
        })
      },
      getPusers(index) {
        if (index) {
          this.page.pageNum = index
        }
        let page = {...this.page, ...this.search}
        delete page.totalElements
        getPremintUserlist(page).then(resp => {
          this.tableData = resp.data.content
          this.page.totalElements = resp.data.totalElements
        })
      },
      handleEdit(row) {
        this.currentRow.dueTime = row.dueTime
        this.currentRow.accountMax = row.accountMax
        this.currentRow.id = row.id
        this.modal.edit = true
      }
    },
    mounted() {
      this.getPusers();
    }

  }
</script>
