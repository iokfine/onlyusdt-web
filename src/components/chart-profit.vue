<template>
  <div>
    <el-button type="danger" size="mini" @click="delRobotProfit">
      清除收益表
    </el-button>&nbsp;&nbsp;&nbsp;刷新于 {{updateTimes}} 秒前
    <div id="main" style="height: 300px;width: 800px;"></div>
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  import {delRobotProfit,robotProfit} from '@/api/robot'

  export default {
    name: 'chart-profit',
    props: {
      robotId: {
        type: String,
        default: 1
      },
    },
    data() {
      return {
        dom: null,
        updateTimes: 0,
        data: {}
      }
    },
    methods: {
      getRobotProfit() {
        let myChart = echarts.init(document.getElementById('main'))
        robotProfit({id: this.robotId}).then(resp => {
          let dataArr = resp.data
          let data = []
          for (let i = 1; i < dataArr.length; i++) {
            // console.log(data[i].createTime)
            data.push([dataArr[i].createTime, dataArr[i].profit]);
          }
          let option = {
            tooltip: {
              trigger: 'axis',
              position: function (pt) {
                return [pt[0], '50%'];
              }
            },
            xAxis: {
              type: 'time',
              boundaryGap: false
            },
            yAxis: {
              type: 'value',
              boundaryGap: [0, '100%']
            },
            dataZoom: [
              {
                type: 'inside',
                start: 0,
                end: 100
              },
              {
                start: 0,
                end: 100
              }
            ],
            series: [
              {
                name: '收益',
                type: 'line',
                smooth: true,
                symbol: 'none',
                areaStyle: {},
                data: data
              }
            ]
          };
          myChart.setOption(option)
          this.updateTimes =0
        })
      },
      delRobotProfit(){
        delRobotProfit({robotId:this.robotId}).then(resp=>{
          this.$notify({
            title: 'Success', message: '清除成功', type: 'success', duration: 2000
          })
          this.getRobotProfit()
        })
      }
    }
    ,
    mounted() {
      this.getRobotProfit()

      setInterval(()=>{
        this.getRobotProfit()
      },60000)

      setInterval(()=>{
        this.updateTimes ++
      },1000)
    }
    ,
  }
</script>
