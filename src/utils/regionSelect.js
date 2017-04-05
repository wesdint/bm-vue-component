/**
 * Created by Wesdint on 2016/12/12.
 */
/*
 * 名字：级联地址控件(适配移动端)
 * 作者：曾文东
 * 时间：2016-12-10
 */
import { getProvince } from '../utils/api'
import $ from 'jquery'
export const RegionSelect = ($element, option) => {
  var unique = 0 // 同一页面多处调用，作为唯一标识
  var result = {}
  var defaults = {
    id: '',
    hideTarget: '',
    url: '',
    hasCounty: true,
    defaultTab: 'province',
    isSingle: false, // 是否为一级级联地址类型
    reqData: {}, // 一级级联时请求的数据体
    currentData: {}, // 编辑状态下传入地址对象{province: {dcode:'',name}, city: {...}, county: {...}}
    loadingIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADIElEQVRYR8WW26uPaRTHP9v5LOdyCI2EHIobpBSjmRu5cCwjLsSdC9zIH+FSSUQhNxI1ozAXc+EUk7kQyTmHRENOY4ZBH6139/Ts9/29v21v7bf2xf49z1rru9bzXd+1Wujir6WL49NRAJ8jgW/2U2fYH/gJmADsAoqAReGqAOi3N/AJ+K9RlesADAd2Aj8DS4FbmbMqAD2BPsD/wLuOANB2FnAEOANsBT4mDssAmFS/qJbZp/fbYKmrQGGwDdgCrAP+qAHQK8r/T11w/TQLYBRwHHgMrAXeB4i8At0ie7Mu7jRstBRAX2A6MAY4DbzNLFcHEbcDhysA+O494t0lYPp1B4zhs7QSMwUwElgGbAb+BPYBFxIPsnpvgPRJfk+6Qj8GNsC/GfM98/cBgCBeA28Kv/kT+H4y/hdgIvAbcAC4HQZLgFXADuB5lmHRemZXZC/ogYB+BWZgz1vbuYoDQ4EVwJpwZslPhuHLGnLp00zN2MxtRQNLylxHakk4CdgQVdkP7E6ya0SuwUFGA8ulnA+tts10gWq4EThUUvYqEHaD2edE/mYd+G4zK62Ab9zoU4rb882puXwlF6IuB9Ce7DrtbjMkdLItBC6GiDQT3L4f1Axp6wAMAX4EFgFngWNNtuFkQGW9CzxtpBtVAGyhucBiwJ52AirLyuirBiD055/ZjwOGxf37wIsyuxyA/88I4fkBuAb8miwiCtO02A3yRcOym7lLi5NQXyOA8SFKz4AHoQ2lUqx0zgeWAw9jIl5OyqfDlbGenQBuAJuCEHtiis4O0HcSosih0XGuQN0L/1+vpBUwgynA2Ch568QKZ2buIDqVTMkUgNfsfefIuRIVNEH3ir/jOdoAKIaIwyMfGnJifbzhwWTZyAH49lbxCfBXSbs4pJwLtdMwt10Q3XAUuJ4c5gA8mgrIlfOd0YY6lEhmL4Fsw3TJLANgtebFVnQzSl6pHXU6oDNbcSbgOLa06VcGwHOZr40acKmRctUBcM1yM3IkXy1xVAVAO3XA7edRRwBoK3Fsnw/tAFDYSbbKZSRvw2Y0vtPv1D1BpwfMHX4B5Q2mIeCVF5AAAAAASUVORK5CYII=',
    complete: function (data) {
    }
  }

   // 构造函数
  function Address ($element, options) {
    this.$element = $element
    this.settings = $.extend({}, defaults, options)
    this.settings.id = this.settings.id || ++unique
    this.version = 'v1.0.0'
    this.hotCityLoaded = false
    this.provinceLoaded = false
    this.singleLoaded = false
    this.init()
  }

   // 对象的属性，方法
  Address.prototype = {
     // 初始化
    init: function () {
    //  var $top = $(window.top)
      var instance = this  // 对象实例
      var settings = this.settings // 参数
      var pccid = this.settings.id // 唯一标识
      var $element = this.$element  // DOM元素的jQuery对象

       // 添加插件元素跟样式
      if ($element.val().length === 0 && !settings.isSingle) {
        $('.rs-contain').remove()
      }
      // $('.rs-contain').remove()
      $('#rs-style').remove()
      if ($('#addr' + pccid).length === 0) {
        instance.addElement(settings)
      }
      instance.addStyle(settings)
       // 注册宿主单击事件
      $element.click(function () {
        Address.prototype.$currentele = $(this)
        var rsHeight = parseInt($('#rs-mask').height() / 2) - parseInt($('.rs-header').height())
        $('.re-content').height(rsHeight).find('ul').height(rsHeight)
        $('#addr' + pccid).show()
        $('#addr' + pccid).stop().animate({bottom: 0}, 300, function () {
          $('#rs-mask').show()
          // 重置样式
          instance.resetStyle(pccid)
          // 装载数据
          if (instance.provinceLoaded) {
            return
          }
          if (instance.settings.defaultTab === 'hotcity') {
            instance.loadAddressData('hotcity')
          } else if (settings.isSingle) {
            $('.tabs-province', $('#addr' + pccid)).children('span').text('请选择')
            $('conts-province', $('#addr' + pccid)).show()
            if (!instance.singleLoaded) {
              instance.loadAddressData('single', settings.reqData)
            }
          } else {
            instance.loadAddressData('province', '0')
          }
          // result = {}
        })
        // 注册遮罩点击事件
        $('#rs-mask').click(function (e) {
          e.stopPropagation()
          $('#addr' + pccid).stop().animate({bottom: '-300px'}, 300, function () {
            $('#rs-mask').hide()
            $('#addr' + pccid).hide()
          })
        })
      })
       // Tab头切换事件
      $('.tabs', $('#addr' + pccid)).click(function () {
        if (instance.settings.isSingle) {
          return
        }
        var eleId = $(this).attr('data-id')
        // var tabClass = 'tabs-' + eleId
        var contClass = 'conts-' + eleId
        $(this).siblings().removeClass('active')
        $(this).addClass('active')
        $('.' + contClass).siblings().hide()
        $('.' + contClass).show()
         // 热门城市
        if (eleId === 'hot') {
          if (!instance.hotCityLoaded) {
            instance.loadAddressData('hotcity')
          }
        } else if (eleId === 'province') { // 省份
          if (!instance.provinceLoaded) {
            instance.loadAddressData('province', '0')
          }
        }
      })
       // 注册关闭按钮事件
      $('.shut-down', $('#addr' + pccid)).click(function () {
        // instance.close(result)
        $('#rs-mask').click()
      })
    },
    // 添加插件元素
    addElement: function (opts) {
      var html = ''
      if ($('#rs-mask').length === 0) {
        html += '<div id="rs-mask" style="display:none;position: fixed;top:0;left:0;width:100%;height:100%;opacity: 0.5;background: #000;"></div>'
      }
      html += '<div id="addr' + opts.id + '" class="rs-contain addr">'
      html += '<div class="rs-header"><ul class="clearfix addr-tabs"><li class="fl tabs tabs-province" data-id="province"><span class="f24">请选择</span></li> <li class="fl tabs tabs-city" data-id="city" style="display: none;"><span class="f24">请选择</span></li> <li class="fl tabs tabs-county" data-id="county" style="display: none;"><span class="f24">请选择</span></li> <li class="shut-down fr" style="display: none;">完成</li> </ul> </div>'
      html += '<div class="re-content">'
      html += '<ul class="addr-list-nzone clearfix conts-province" style="display:block"></ul>'
      html += '<ul class="addr-list-nzone clearfix conts-city" style="display:none;"></ul>'
      html += '<ul class="addr-list-nzone clearfix conts-county" style="display:none;"></ul>'
      html += '</div></div>'
      $('body').append(html)
    },
   // 添加插件样式
    addStyle: function (opts) {
      var style = '<style type =text/css id="rs-style">'
      style += '.rs-contain{display:none;position: absolute;bottom:-300px;width:100%;background: white}'
      style += ' .rs-header{border-bottom: 1px solid #ccc;}.tabs{width:3.5rem;text-align: center;height: 1.8rem;line-height: 1.8rem;}.tabs>span{height: 1.8rem;width:100%;box-sizing: border-box;display: inline-block;text-overflow:ellipsis; white-space:nowrap; overflow:hidden;}'
      style += '.tabs.active>span{color:#999;border-bottom: 2px solid #0058f1;}.shut-down {font-size:.6rem;color:#0058f1;margin-top: .5rem;margin-right: .6rem;}'
      style += '.re-content,.re-content>ul{overflow:auto} .addr-list-nzone {padding-left:1rem;}.addr-list-nzone>li{height:2rem;line-height:2rem;color: #333;font-size:.7rem}'
      style += ' .addr-list-nzone>li>.active:after{content: "";position: relative;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAAXNSR0IArs4c6QAAAp9JREFUSA21VU1oE1EQ/mYTa6vZFYQKouBFoQgexIrUk6Ag6EVbsPlR2l5EKgqKHuqpeqooVG9aJKINRrSVgh49iD1JpVLwoKJ4EUQFJbuFSGt2nFebl32bprZ08yDszDdvv29n5r0Jod4rWTgMoltgZlg4RXXVy0zvQMl/BXDTnA7RF6tughl24PujWkwJSZb1E/S9rAhsMxIiXIobQFROsnBOxDpMOhpC3slFn+Fxd68ckqumGCbRbJ9VWLSHpsdrRpHfSLM2aUHCL8QbdmG46bPCosuwX85D0c8bYiCWnLrKYtEKvnevCOF+RaoXYUD69lT7YkRT0nThEHx6JtkF+OgF2u0DOEalaAXTxS3wZyaFdL0mJvoq3dqJfOKbxuaNlfWwnxtE7LEhBvqDGDoXElOaKxN8594Qjt2KSC8Lfcg549oPGQRVEp69LLiPVdLk+86H0J6F3fR0Bn4pZwSJxuSQHDWwkGOBZ0ZkKnTJrwez/BopLzQhQm8oN+NtB5duhyKfYNvdIazKVSXdqlGGDfZHkHSv4RHHNB40ejkBn0fBWKthot+IxzowRAWN1TAsuRg3q2N8AU+85zjhbaiK/XTvSDVaDJxxGrnElIHVcCw8WNcPy+qVKzlj7uF9UuJJpNw2jae8M2J3al8ZRFk8dLIGtohTuajJwh55WfVzs7GfaFbw8/LfNiHsL+VyN1TiNIWNdhsGqVjBFrcqgmrf3PBV8zA0olRM9Ym5UZnzq4D46lbkGj+WgaU8zXt41/6BduegkA+IggzewDLF1Ad0L1dMsZkZBvild0ekfPfkNDpB+J9N16VvF6vx/yNmhsH9eWdMPqdVvultEBZ/HC12n4kt3audYZnjJK+B6w1Ktmkp4wTilMSw/b0cXu7zLzwEyJZzg4uzAAAAAElFTkSuQmCC);background-size: .6rem;background-repeat:no-repeat;left:.6rem;bottom:-.6rem;width:1.2rem;height:1.2rem;display: inline-block;}'
      style += '</style>'
      $('head').append(style)
    },
     // 重置样式
    resetStyle: function (id) {
      var $container = $('#addr' + id)
      if (this.settings.isSingle) {
        $('.conts-province', $container).show()
        $('.conts-city', $container).hide()
        $('.conts-county', $container).hide()
      } else if (!this.provinceLoaded && $element.val().length > 0) {
        $('.conts-county', $container).show()
      }
    },
     // 关闭
    close: function (result) {
      var id = this.settings.id
      if (!result.province) {
        result.province = { code: '', name: '' }
      }
      if (!result.city) {
        result.city = { code: '', name: '' }
      }
      if (!result.county) {
        result.county = { code: '', name: '' }
      }
      result.$element = Address.prototype.$currentele
       // 显示内容区域
      $('#rs-mask').click()
      this.resetStyle(id)
      this.settings.complete(result)
    },
     // 加载地址数据
    loadAddressData: function (type, parentCode) {
      var pccid = this.settings.id
      var instance = this
      var $container = $('#addr' + pccid)
      var data = {}
      data.type = type
      var loading = '<li><img style="width:24px;height:24px;margin-top:5px" src=' + this.settings.loadingIcon + '></li>'
      if (type === 'hotcity') {
        data.isHotCity = true
        $('.conts-hot', $container).html(loading)
      } else if (type === 'province') {
        data.pid = parentCode
        $('.conts-province', $container).html(loading)
      } else if (type === 'city') {
        data.pid = parentCode
        $('.conts-city', $container).html(loading)
      } else if (type === 'county') {
        data.pid = parentCode
        $('.conts-county', $container).html(loading)
      } else if (type === 'single') {
        data = parentCode
      }
      getProvince({
        data: data,
        success: function (data) {
          if (data.responseCode === '0') {
            var adds = data.lists
            var html = ''
            for (var i = 0; i < adds.length; i++) {
              html += '<li title=' + adds[i].dname + ' id="' + pccid + adds[i].dcode + '"><span id=' + adds[i].dcode + ' data-parentcode=' + adds[i].pcode + '>' + adds[i].dname + '</span></li>'
            }
            if (type === 'hotcity') {
              instance.hotCityLoaded = true
              $('.conts-hot', $container).html(html)
              instance.addHotCityClickEvent()
            } else if (type === 'province') {
              instance.provinceLoaded = true
              $('.conts-province', $container).html(html)
              instance.addProvinceClickEvent()
              if (!$.isEmptyObject(instance.settings.currentData.province)) {
                $('#' + pccid + instance.settings.currentData.province.dcode).click()
              }
            } else if (type === 'single') {
              instance.singleLoaded = true
              $('.conts-province', $container).html(html)
              instance.addProvinceClickEvent()
            } else if (type === 'city') {
              $('.conts-city', $container).html(html)
              instance.addCityClickEvent()
              if (!$.isEmptyObject(instance.settings.currentData.city)) {
                $('#' + pccid + instance.settings.currentData.city.dcode).click()
              }
            } else if (type === 'county') {
              $('.conts-county', $container).html(html)
              instance.addCountyClickEvent()
              if (!$.isEmptyObject(instance.settings.currentData.county)) {
                $('#' + pccid + instance.settings.currentData.county.dcode).children('span').addClass('active')
                result.county = {
                  code: instance.settings.currentData.county.dcode,
                  name: instance.settings.currentData.county.name
                }
              }
            }
          } else {
            var empty = '<li></li>'
            if (type === 'hotcity') {
              $('.conts-hot', $container).html(empty)
            } else if (type === 'province') {
              $('.conts-province', $container).html(empty)
            } else if (type === 'city') {
              $('.conts-city', $container).html(empty)
            } else if (type === 'county') {
              $('.conts-county', $container).html(empty)
            }
          }
        }
      })
    },
     // 常用城市点击事件
    addHotCityClickEvent: function () {
      var instance = this
      var id = this.settings.id
      var $container = $('#addr' + id)
      $('.conts-hot > li', $container).click(function () {
        var code = $(this).children().attr('id')
        var name = $(this).children().html()
        var parentCode = $(this).children().attr('data-parentcode')
        var parentName = $(this).children().attr('data-parentName')
        var isDirect = parseInt($(this).children().attr('data-isDirect'))
        var isSpecial = parseInt($(this).children().attr('data-isSpecial'))

        result = {
          province: { code: parentCode, name: parentName },
          city: { code: code, name: name },
          isDirect: isDirect,
          isSpecial: isSpecial
        }
        if (instance.settings.hasCounty) {
          var $countyTitle = $('.tabs-county', $container)
          var $countyContent = $('.conts-county', $container)
           // Tabs
          $countyTitle.addClass('active')
          $countyTitle.siblings().removeClass('active')
           // Conts
          $countyContent.show()
          $countyContent.siblings().hide()

           // 加载区县数据
          instance.loadAddressData('county', code)
        } else {
           // 关闭
          instance.close(result)
        }
      })
    },
     // 添加省份单击事件
    addProvinceClickEvent: function () {
      var instance = this
      var id = this.settings.id
      var single = this.settings.isSingle
      var $container = $('#addr' + id)
      $('.conts-province > li', $container).click(function () {
        $(this).siblings().children('.active').removeClass('active')
        $(this).children('span').addClass('active')
        var code = $(this).children().attr('id')
        var name = $(this).attr('title')
        if (single) {
          result.street = {
            code: code,
            name: name
          }
          instance.close(result)
          return
        }
      //  var isDirect = parseInt($(this).children().attr('data-isDirect'))
        var isSpecial = false // parseInt($(this).children().attr('data-isSpecial'))

         //  保存返回结果
        result = {}
        result.province = {
          code: code,
          name: name
        }
         // 特别行政区
        if (isSpecial) {
          instance.close(result)
        } else {
          var $cityTitle = $('.tabs-city', $container)
          var $cityContent = $('.conts-city', $container)
           // Tabs
          $('.tabs-province').children('span').text(name)
          $('.tabs-province').addClass('active')
          $cityTitle.siblings().removeClass('active')
          $cityTitle.show().addClass('active').children('span').text('请选择')
          $('.tabs-county').hide()
           // Conts
          $cityContent.show()
          $cityContent.siblings().hide()

           // 加载城市数据
          instance.loadAddressData('city', code)
        }
      })
    },
     // 添加城市单击事件
    addCityClickEvent: function () {
      var instance = this
      var id = this.settings.id
      var $container = $('#addr' + id)
      $('.conts-city > li', $container).click(function () {
        $(this).siblings().children('.active').removeClass('active')
        $(this).children('span').addClass('active')
        var code = $(this).children().attr('id')
        var name = $(this).attr('title')
        // var isDirect = parseInt($(this).children().attr('data-isDirect'))
        // var isSpecial = parseInt($(this).children().attr('data-isSpecial'))

         //  保存返回结果
        // result.isDirect = isDirect
        // result.isSpecial = isSpecial
        result.county = {}
        result.city = {
          code: code,
          name: name
        }

        if (instance.settings.hasCounty) {
          var $countyTitle = $('.tabs-county', $container)
          var $countyContent = $('.conts-county', $container)
           // Tabs
          $countyTitle.siblings().removeClass('active')
          $countyTitle.show().addClass('active').children('span').text('请选择')
          $('.tabs-city').children('span').text(name)
           // Conts
          $countyContent.show()
          $countyContent.siblings().hide()

           // 加载区县数据
          instance.loadAddressData('county', code)
        } else {
          instance.close(result)
        }
      })
    },
     // 添加区县单击事件
    addCountyClickEvent: function () {
      var instance = this
      var id = this.settings.id
      var $container = $('#addr' + id)
      $('.conts-county > li', $container).click(function () {
        $('.tabs-county').children('span').text($(this).attr('title'))
        $('.tabs-county').addClass('active')
        $(this).siblings().children('.active').removeClass('active')
        $(this).children('span').addClass('active')
         //  保存返回结果
        result.county = {
          code: $(this).children().attr('id'),
          name: $(this).attr('title')
        }
        instance.close(result)
      })
    }
  }
  return new Address($element, option)
}
