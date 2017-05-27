<template>
    <div v-if="isShow">
      <div ref="rs-mask"
           style="position: fixed;top:0;left:0;width:100%;height:100%;opacity: 0.5;background: #000;" v-if="isShow" @click="close"></div>
      <div id="addr' + opts.id + '" class="rs-contain addr">
        <div class="rs-header">
          <ul class="clearfix addr-tabs">
            <li :class="[{active: index === currentIndex},'fl', 'tabs', 'tabs-province']" v-for="(item, index) in titleDataList" @click="switchType(index)"><span class="f24">{{item}}</span></li>
            <li class="shut-down fr" style="display: none;">完成</li>
          </ul>
        </div>
        <div class="re-content">
          <ul ref="regionBlock" class="addr-list-nzone clearfix conts-province" v-show="displayBlock">
            <transition-group name="fade">
              <li v-for="item in regionData[regionType]" v-bind:key="item" @click="pickRegion(item)" :ref="item.dcode"><span :class="{active: item.dcode === (picked[regionType].data ? picked[regionType].data.dcode : false)}">{{item.dname}}</span></li>
            </transition-group>
          </ul>
        </div>
      </div>
    </div>
</template>

<style lang="less" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: all 0.1s;
  }
  .fade-enter, .fade-leave-to  {
    opacity: 0;
    transform: translateY(30px);
  }
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

  .addr-list-nzone  li {
    height: 2rem;
    line-height: 2rem;
    color: #333;
    font-size: .7rem
  }

  .addr-list-nzone  li > .active:after {
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
        isEdit: false,
        isShow: false,
        displayBlock: true,
        regionData: {
          province: null,
          city: null,
          county: null,
          street: null
        },
        regionType: 'province',
        titleDataList: ['请选择'],
        outputRegion: {
          province: null,
          city: null,
          county: null,
          street: null
        },
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
        currentIndex: 0
      }
    },
    props: {
      ranks: {
        type: Number,
        default: 3
      },
      preData: {
        default: []
      }
    },
    methods: {
      open () {
        this.isShow = true
//        if (this.isEdit) {
//          this.$nextTick(() => {
//            this.$refs.regionBlock.scrollTop = this.picked[this.regionType].scrollTop || 0
//        })
//        }
        //
        //
        if (this.preData.length > 0) {
          let thisV = this
          let preRanks = thisV.preData.length
          this.currentIndex = 0
          this.pickRegion(thisV.preData[0]).then(function () {
            if (preRanks > 2) {
              thisV.pickRegion(thisV.preData[1]).then(function () {
                if (preRanks > 3) {
                  thisV.pickRegion(thisV.preData[2])
                }
              })
            }
          })
        }
      },
      close () {
        this.isShow = false
      },
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
//        let a = {}
//        Object.assign(a, this.$refs[item.dcode])
//        console.log(a)
        let thisV = this
        return  new Promise(function (resolve, reject) {
          if (thisV.currentIndex  < thisV.titleDataList.length -1) {
            thisV.titleDataList.splice(thisV.currentIndex, thisV.titleDataList.length - thisV.currentIndex)
          }
          thisV.picked[thisV.regionType].data = item
          if (thisV.$refs.regionBlock) {
            thisV.picked[thisV.regionType].scrollTop = thisV.$refs.regionBlock.scrollTop || 0
          }
          thisV.titleDataList[thisV.currentIndex] = item.dname
          if (thisV.titleDataList.length >= thisV.ranks) {
            thisV.$emit('outputRegion', thisV.picked)
            thisV.close()
            thisV.isEdit = true
            return
          }
          if (thisV.$refs.regionBlock) {
            thisV.$refs.regionBlock.scrollTop = 0
          }
          if (thisV.regionType === 'province') {
            thisV.regionType = 'city'
          } else if (thisV.regionType === 'city') {
            thisV.regionType = 'county'
          } else if (thisV.regionType === 'county') {
            thisV.regionType = 'street'
          }
          thisV.titleDataList[++thisV.currentIndex] = '请选择'
          thisV.regionPost({
            pid: item.dcode,
            type: thisV.regionType
          }).then((result) => {
                thisV.regionData[thisV.regionType] = result.data.lists
                resolve(result.data.lists)
          })
        })
      },
      switchType (index) {
        switch(index)
        {
          case 0 :
            this.regionType = 'province'
            break
          case 1:
            this.regionType = 'city'
            break
          case 2:
            this.regionType = 'county'
            break
          case 3:
            this.regionType = 'street'
            break
          default:
            this.regionType = 'province'
            break
        }
        this.currentIndex = index
        this.$nextTick(() => {
          this.$refs.regionBlock.scrollTop = this.picked[this.regionType].scrollTop || 0
        })
      }
    },
    mounted () {
      if (this.preData.length > 0) {
        this.isEdit = true
      }
      this.regionPost({
        pid: 0,
        type: 'province'
      }).then((result) => {
        this.regionData.province = result.data.lists
      })
    }
  }
</script>
