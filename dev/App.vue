<template>
  <div id="app" style="font-size:40px">
    <BMWeek ref="week" @cur-week-changed="weekChanged" style="font-size:40px"></BMWeek>
    <div @click="toDate">选中指定日期</div>
    <div>
      <BMRegion :ranks = 'ranks' :preData="preData" @outputRegion="outputRegion" ref="region"></BMRegion>
      <input type="text" placeholder="请选择地区" @click="openRegion()" :value="value">
    </div>
    <div>
      <BMRegion :ranks = 'ranks1' :preData="preData1" @outputRegion="outputRegion1" ref="region1"></BMRegion>
      <input type="text" placeholder="请选择地区" @click="openRegion1()" :value="value1">
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      ranks: 3,
      ranks1: 4,
      value: '',
      value1: '',
      preData: [
        {dcode: "44", dname: "广东", pcode: "", type: "province"},
        {dcode: "4401", dname: "广州", pcode: "44", type: "city"},
        {dcode: "440106", dname: "天河区", pcode: "4401", type: "county"}],
      preData1: []
    }
  },
  computed: {
    regionData () {}
  },
  methods: {
    openRegion () {
      this.$refs.region.open()
    },
    openRegion1 () {
      this.$refs.region1.open()
    },
    outputRegion (data) {
      this.value = data.province.data.dname + data.city.data.dname + data.county.data.dname
      this.preData = data
      console.log(data)
    },
    outputRegion1 (data) {
      this.value1 = data.province.data.dname + data.city.data.dname + data.county.data.dname + data.street.data.dname
      this.preData1 = data
    },
    weekChanged (weeks) {
      weeks[0].event = true
    },
    toDate (time) {
      this.$refs['week'].toDate('2017/3/18')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;
}

/*h1, h2, h3 {*/
  /*font-weight: normal;*/
  /*margin: 0;*/
  /*padding: 0;*/
/*}*/

/*ul {*/
  /*list-style-type: none;*/
  /*padding: 0;*/
/*}*/

/*li {*/
  /*display: inline-block;*/
  /*margin: 0 10px;*/
/*}*/

/*a {*/
  /*color: #42b983;*/
/*}*/
/*.t-center{*/
  /*text-align: center;*/
  /*margin: 20px;*/
/*}*/
</style>
