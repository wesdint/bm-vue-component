<template>
  <div>
    <div id="rs-mask"
         style="display:none;position: fixed;top:0;left:0;width:100%;height:100%;opacity: 0.5;background: #000;"></div>
    <div id="addr' + opts.id + '" class="rs-contain addr">
      <div class="rs-header">
        <ul class="clearfix addr-tabs">
          <li class="fl tabs tabs-province active" data-id="province"><span class="f24">请选择</span></li>
          <li class="fl tabs tabs-city" data-id="city"><span class="f24">请选择</span></li>
          <li class="fl tabs tabs-county" data-id="county"><span class="f24">请选择</span></li>
          <li class="shut-down fr" style="display: none;">完成</li>
        </ul>
      </div>
      <div class="re-content">
        <ul class="addr-list-nzone clearfix conts-province" style="display:block">
          <li><span>广东省</span></li>
          <li><span>广西省</span></li>
          <li><span>湖南省</span></li>
          <li><span>福建省</span></li>
          <li><span>北京市</span></li>
        </ul>
        <ul class="addr-list-nzone clearfix conts-city">
          <li><span>广州市</span></li>
          <li><span>深圳市</span></li>
          <li><span>东莞市</span></li>
        </ul>
        <ul class="addr-list-nzone clearfix conts-county">
          <li><span>天河区</span></li>
          <li><span>海珠区</span></li>
          <li><span>越秀区</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .rs-contain {
    position: absolute;
    bottom: 0;
    width: 100%;
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
</style>

<script>
  /**
   * Created by Wesdint on 2017/4/5.
   */
  export default {
    name: 'Region',
    data () {
      return {}
    }
  }
</script>
