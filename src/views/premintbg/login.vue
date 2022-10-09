<template>
  <div style="" class="login">
    <div class="login_box">
      <p class="login_title">
        <span :class="isActiveIndex === 0 ? 'isActiveTitle' : ''" >管理平台登录</span>
      </p>
      <el-form v-if="isActive" ref="loginForm" :model="loginForm" label-width="80px">
        <el-form-item label="账号：">
          <el-input v-model="loginForm.username" placeholder="">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="loginForm.password" type="password" placeholder="">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <p class="login_agree">{{errorTip}}</p>
        <el-button class="login_btn" :loading="loading" @click.native.prevent="handleLogin" >立 即 登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { encrypt } from '@/utils/rsaEncrypt'
  import Config from '@/settings'
  import Cookies from 'js-cookie'
  import qs from 'qs'

  export default {
    name: 'Login',
    data() {
      return {
        show: 0,
        sendCodeLoading: false,
        count: '',
        timer: null,
        isActive: true, // 用于实现切换登录，作为判断
        isActiveIndex: 0,
        regForm: {
          username: '',
          verifyCode: '',
          rePwd: '',
          pwd: ''
        },
        codeUrl: '',
        cookiePass: '',
        errorTip: '',
        regErrorTip: '',
        loginForm: {
          username: '',
          password: '',
          // rememberMe: false,
          uuid: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
          password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
          // code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
        },
        regRules: {
          username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }]
        },
        loading: false,
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          const data = route.query
          if (data && data.redirect) {
            this.redirect = data.redirect
            delete data.redirect
            if (JSON.stringify(data) !== '{}') {
              this.redirect = this.redirect + '&' + qs.stringify(data, { indices: false })
            }
          }
        },
        immediate: true
      }
    },
    created() {
      // 获取验证码
      // this.getCode()
      // 获取用户名密码等Cookie
      this.getCookie()
      // token 过期提示
      this.point()
    },
    methods: {
      getCookie() {
        const username = Cookies.get('username')
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          code: ''
        }
      },
      handleLogin() {
        this.errorTip = ' '
        if (!this.loginForm.password || !this.loginForm.username) {
          this.errorTip = '账号密码不能为空！'
          return
        }
        if (this.loginForm.password.length < 6) {
          this.errorTip = '密码长度不能小于6！'
          return
        }
        this.$refs.loginForm.validate(valid => {
          const user = {
            username: this.loginForm.username,
            password: this.loginForm.password
          }
          if (user.password !== this.cookiePass) {
            user.password = encrypt(user.password)
          }
          if (valid) {
            this.loading = true
            Cookies.set('username', user.username, { expires: Config.passCookieExpires })
            this.$store.dispatch('Login', user).then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            }).catch((e) => {
              console.error(e)
              this.errorTip = '账号或者密码错误！'
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      point() {
        const point = Cookies.get('point') !== undefined
        if (point) {
          this.$notify({
            title: '提示',
            message: '当前登录状态已过期，请重新登录！',
            type: 'warning',
            duration: 5000
          })
          Cookies.remove('point')
        }
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .login_box {
    width: 500px;
    height: 490px;
    background-color: #fff;
    border-radius: 18px;
    padding: 30px 50px 30px 30px;
  }

  .login_title {
    text-align: center;
    margin: 30px 30px 40px 30px;
    font-size: 24px;
    color: #666;
  }

  .login_title span {
    margin: 0 20px 0 20px;
    cursor: pointer;
  }

  .login_title span:hover {
    color: #333;
    font-weight: bolder;
  }

  .isActiveTitle {
    color: #333;
    font-weight: bolder;
  }

  .login_agree {
    margin-left: 30px;
    color: red;
    height: 14px;
  }

  .login_btn {
    width: 100%;
    height: 50px;
    margin: 0 0 0 10px;
    background-color: #0cb95f;
    color: #fff;
  }

  .login {
    background-color: #f4f4f4;
    padding-top: 50px;
    display: flex;
    justify-content: center;
    /*align-items: center;*/
    height: 100%;
    background-size: cover;
  }
</style>
