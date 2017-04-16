<template>
  <div>
    <div id="rs-mask"
         style="display:none;position: fixed;top:0;left:0;width:100%;height:100%;opacity: 0.5;background: #000;"></div>
    <div id="addr' + opts.id + '" class="rs-contain addr">
      <div class="rs-header">
        <ul class="clearfix addr-tabs">
          <li class="fl tabs tabs-province active" v-for="item in titleDataList"><span class="f24">{{item}}</span></li>
          <li class="shut-down fr" style="display: none;">完成</li>
        </ul>
      </div>
      <div class="re-content">
        <ul ref="regionBlock" class="addr-list-nzone clearfix conts-province" v-if="displayBlock">
          <li v-for="item in regionData[regionType]" @click="pickRegion(item)"><span :class="{active: item.dcode === (picked[regionType].data ? picked[regionType].data.dcode : false)}">{{item.dname}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .rs-contain {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: white
  }

  .rs-header {
    border-bottom: 1px solid #ccc;
  }

  .tabs {
    width: 3.5rem;
    text-align: center;
    height: 1.8rem;
    line-height: 1.8rem;
  }

  .tabs > span {
    height: 1.8rem;
    width: 100%;
    box-sizing: border-box;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .tabs.active > span {
    color: #999;
    border-bottom: 2px solid #0058f1;
  }

  .shut-down {
    font-size: .6rem;
    color: #0058f1;
    margin-top: .5rem;
    margin-right: .6rem;
  }

  .re-content, .re-content > ul {
    overflow: auto
  }

  .addr-list-nzone {
    padding-left: 1rem;
    height: 50vh - 1.8rem;
  }

  .addr-list-nzone > li {
    height: 2rem;
    line-height: 2rem;
    color: #333;
    font-size: .7rem
  }

  .addr-list-nzone > li > .active:after {
    content: "";
    position: relative;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAp9JREFUSA21VU1oE1EQ/mYTa6vZFYQKouBFoQgexIrUk6Ag6EVbsPlR2l5EKgqKHuqpeqooVG9aJKINRrSVgh49iD1JpVLwoKJ4EUQFJbuFSGt2nFebl32bprZ08yDszDdvv29n5r0Jod4rWTgMoltgZlg4RXXVy0zvQMl/BXDTnA7RF6tughl24PujWkwJSZb1E/S9rAhsMxIiXIobQFROsnBOxDpMOhpC3slFn+Fxd68ckqumGCbRbJ9VWLSHpsdrRpHfSLM2aUHCL8QbdmG46bPCosuwX85D0c8bYiCWnLrKYtEKvnevCOF+RaoXYUD69lT7YkRT0nThEHx6JtkF+OgF2u0DOEalaAXTxS3wZyaFdL0mJvoq3dqJfOKbxuaNlfWwnxtE7LEhBvqDGDoXElOaKxN8594Qjt2KSC8Lfcg549oPGQRVEp69LLiPVdLk+86H0J6F3fR0Bn4pZwSJxuSQHDWwkGOBZ0ZkKnTJrwez/BopLzQhQm8oN+NtB5duhyKfYNvdIazKVSXdqlGGDfZHkHSv4RHHNB40ejkBn0fBWKthot+IxzowRAWN1TAsuRg3q2N8AU+85zjhbaiK/XTvSDVaDJxxGrnElIHVcCw8WNcPy+qVKzlj7uF9UuJJpNw2jae8M2J3al8ZRFk8dLIGtohTuajJwh55WfVzs7GfaFbw8/LfNiHsL+VyN1TiNIWNdhsGqVjBFrcqgmrf3PBV8zA0olRM9Ym5UZnzq4D46lbkGj+WgaU8zXt41/6BduegkA+IggzewDLF1Ad0L1dMsZkZBvild0ekfPfkNDpB+J9N16VvF6vx/yNmhsH9eWdMPqdVvultEBZ/HC12n4kt3audYZnjJK+B6w1Ktmkp4wTilMSw/b0cXu7zLzwEyJZzg4uzAAAAAElFTkSuQmCC);
    background-size: .6rem;
    background-repeat: no-repeat;
    left: .6rem;
    bottom: -.6rem;
    width: 1.2rem;
    height: 1.2rem;
    display: inline-block;
  }
.f24 {
  font-size:12px;;
}
 ul {
   margin:0;
   padding: 0;
 }
  li {
    display: block;
    margin:0;
  }
  .fl {
    float: left;
  }
  /* 清除浮动 */
  .clearfix {*zoom: 1;}
  .clearfix:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
  }
</style>

<script>
  /**
   * Created by Wesdint on 2017/4/5.
   */
  import axios from 'axios'
  export default {
    name: 'Region',
    data () {
      return {
        displayBlock: true,
        regionData: {
          province: null,
          city: null,
          county: null,
          street: null
        },
        provinces:[{
          id:1,
          name:"guangdong"
        }],
        citiesMap:{
          1:[
            {
              id:12,
              name:'gz'
            }
          ]
        },
        regionType: 'province',
        titleDataList: ['请选择'],
        picked: {
          province: {
            scrollTop: 0,
            data: null
          },
          city: {
            scrollTop: 0,
            data: null
          },
          county: {
            scrollTop: 0,
            data: null
          },
          street: {
            scrollTop: 0,
            data: null
          }
        },
        blockIndex: 0
      }
    },
    methods: {
      regionPost (data) {
        const request = axios.create({
          baseURL: 'http://tmallapi.bluemoon.com.cn/moonRegion/region/getRegionSelect.action',
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        return request.post('', JSON.stringify(data))
      },
      pickRegion (item) {
        this.picked[this.regionType].data = item
        this.picked[this.regionType].scrollTop = this.$refs.regionBlock.scrollTop

//        this.titleDataList[0] = item.dname
//        this.titleDataList[1] = '请选择'
      }
    },
    mounted () {
      this.regionPost({
        pid: 0,
        type: 'province'
      }).then((result) => {
        this.regionData.province = result.data.lists
      })
    }
  }
</script>
