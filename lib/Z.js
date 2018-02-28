/**
 * JavaScript utils
 *
 * < version 1.0.1 >
 *
 * Copyright Zhang zheng
 *
 * Composed by Zhang zheng ( Samous Zhang )
 *
 * Date: 2017/12/06
 *
 * version update rules: update the big version every year but also update the little version in one year
 */
( function (win, $) {

    "use strict";

    var _Z =  {};

    // TEEval 模板引擎
    _Z. TEEval = function (tpl, data, lab) {
        tpl = tpl.replace(/^\s+|\s+$/gm, '').replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/(&lt;)/g, '<').replace(/(&amp;)/g, '&').replace(/(&gt;)/g, '>');
        var t, fn = '(function(){ var $reg = RegExp(/null|undefined/i);var T = \'\'',
            tpls = lab ? tpl.split('<' + lab + '>') : tpl.split('<duia>');
        for ( t in tpls ) {
            var p = lab ? tpls[t].split('</' + lab + '>') : tpls[t].split('</duia>');
            if (t !== '0') {
                fn += '=' === p[0].charAt(0)
                    ? '+($reg.test(typeof(' + p[0].substr(1) + ')) ? \'\' : ' + p[0].substr(1) + ' ) '
                    : ';' + p[0] + 'T=T';
            }
            fn += '+\'' + p[ p.length - 1 ] + '\'';
        }
        fn += ';return T; })();';
        return data ? eval(fn) : fn;
    };

    _Z. renderFile = function ( file, data, container ) {
        var path = '/' + file + '.html',
            content = window['cache_'+file];
        var render = function ( f, d, c, h ) {
            c ? c.after( _Z.TEEval( h, d ) ) : $('#' + f).html( _Z.TEEval( h, d ) );
        };
        if ( content ) {
            render( file, data, container, content );
            return;
        }
        $.ajax({
            url : path,
            type : 'GET',
            dataType : 'text',
            async: false,
            success : function ( html ) {
                html = html.replace(/^\s+|\s+$/gm, '').replace(/\r\n/g, '').replace(/\n/g, '').replace(/\r/g, '');
                render( file, data, container, html );
                window['cache_'+file] = html;
            }
        });
    };

    /**
     * 禁止按钮连续触发事件
     */
    _Z. EventControl = {
        btnDisabled: function (btn) {
            btn.prop( 'disabled', true );
            setTimeout(function(){
                btn.prop( 'disabled', false );
            }, 2000);
        },

        prevent3S: function (btn) {
            if ( btn.length === 0 ) return;
            btn.addClass( 'disabled' );
            setTimeout(function(){
                btn.removeClass( 'disabled' );
            }, 3500);
        }
    };

    /**
     *  ajax
     */
    _Z. post = function(url, data, suFn){
        if( _Z.StringTool.isStringEmpty(url) ) {
            console.log('post -> url is null');
            return;
        }
        if(suFn){
            $.ajax({
                url : url,
                data : data,
                type : 'POST',
                dataType : 'json',
                success : suFn
            });
        } else {
            $.ajax({
                url : url,
                data : null,
                type : 'POST',
                dataType : 'json',
                success : data,
            });
        }
    };

    _Z. get = function(url, data, suFn){
        if( _Z.StringTool.isStringEmpty(url) ) {
            console.log('get -> url is null');
            return;
        }
        if(suFn){
            $.ajax({
                url : url,
                data : data,
                type : 'GET',
                dataType : 'json',
                success : suFn,
            });

        } else {
            $.ajax({
                url : url,
                data : null,
                type : 'GET',
                dataType : 'json',
                success : data,
            });
        }

    };


    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    win. Date. prototype. Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        var k;
        for ( k in o )
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };


    _Z. JSONTool = {

        domGetData: function (father, item) {
            if ( arguments.length < 2 ) return null;
            var data = {};
            var box = father.find( item ) || [],
                k, val, cls, i = 0;
            for ( ; i < box.length; i++ ) {
                cls = box[i].className;
                val = box[i].innerHTML;
                if ( cls && val ) {
                    data[ cls ] = val;
                }
                if ( Z.isContains( cls, 'endDate' ) && !val) {
                    data[ cls ] = '至今';
                }
            }
            return data;
        },

        carryDataToInput: function (father, item, to) {
            var i, input, html, currentData,
                data = _Z.JSONTool.domGetData (father, item),
                carryFather = father.find(to);
            for ( i in data ) {
                // 特殊处理
                input = carryFather.find('input[name="' + i + '"]');
                currentData = data[i];
                if ( input.length === 1 ) {
                    input.val( currentData );
                    if (input.attr('type') === 'hidden') {
                        $('.carry-input').html( currentData );
                    }
                } else {
                    html = '<input type="hidden" name="' + i + '" value="' + currentData + '" />\n';
                    carryFather.append(html);
                }
            }
            return carryFather.find('input');
        },

        clearStyle:  function ( div ) {
            var $input = div.find('input,textarea');
            $input.each(function () {
                if ( this.type !== 'hidden') {
                    $(this).prev().removeClass().addClass('def').removeAttr('style');
                    this.style.cssText='';
                }
            })
        },

        clearInput: function ( div ) {
            var $input = div.find('input,textarea');
            $input.each(function () {
                this.value = '';
            })
        },

        formGetData: function (form, param) {
            var request = {
                resumeId: sessionStorage.getItem('resumeId')
            };

            if ( !form ) return request;
            var _input = form.find('input,textarea'),
                k, val, name, i = 0, j = 0;

            for ( ; i < _input.length; i++ ) {
                name = _input[i].name;
                val = _input[i].value;
                if ( name && val ) {
                    request[ name ] = val;
                }
            }

            if( param && typeof param === 'object') {
                for ( k in param ) {
                    request[k] = param[k];
                }
            }

            if( param && $(param).length === 1 ) {
                var __form = $(param),
                    __input = __form.find('input') || [];

                for ( ; j < __input.length; j ++) {
                    request[__input[j].name] = __input[j].value;
                }
            }
            return request;
        },

        length: function ( obj ) {
            var k, count = 0, o = obj;
            if ( !o ) return count;

            if ( typeof o === 'object' ) {
                for ( k in o ) {
                    count++;
                }
                return count;
            }
            return o.length;
        }

    };

    _Z. Format = {

        cashFormat: function ( str ) {
            return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        fromDateGenerator: function ( date, format ) {
            date = typeof date === 'string' ? date.trim() : '';
            if ( date.indexOf('20') !== 0 ) return [];
            var applyDate = new Date( date ),
                current = new Date(),
                arr = [];
            while ( applyDate < current ) {
                arr.push( applyDate.Format( format || 'yyyy-MM' ) );
                applyDate.setMonth( applyDate.getMonth() + 1 );
            }
            return arr.reverse();
        },

        validFormat: function (flag, input, btn) {
            if ( !flag ) {
                input.css('border', '1px solid #FF6A6A');
                btn.addClass('disabled');
            } else {
                input.css('border', 'none');
                btn.removeClass('disabled');
            }
        },

        dateFormat: function ( date, fmt ) {
            return new Date( date ).Format( fmt );
        },

        getAgeByYear: function (ts) {
            var current = new Date().getFullYear();
            var birthYear = new Date(ts).getFullYear();
            return current - birthYear;
        },

        getAgeByBirth: function ( birth ) {
            var returnAge,
                strBirthdayArr = birth.split("/"),
                birthYear = strBirthdayArr[0],
                birthMonth = strBirthdayArr[1];

            if ( !birthYear || !birthMonth ) {
                strBirthdayArr = birth.split("-");
                birthYear = strBirthdayArr[0];
                birthMonth = strBirthdayArr[1];
            }

            var d = new Date(),
                nowYear = d.getFullYear(),
                nowMonth = d.getMonth() + 1;
            if (nowYear == birthYear) {
                returnAge = 0;//同年 则为0岁
            } else {
                var ageDiff = nowYear - birthYear; //年之差
                if (ageDiff > 0) {
                    if (nowMonth == birthMonth) {
                        returnAge = ageDiff;
                    } else {
                        var monthDiff = nowMonth - birthMonth;//月之差
                        if (monthDiff < 0) {
                            returnAge = ageDiff - 1;
                        } else {
                            returnAge = ageDiff;
                        }
                    }
                } else {
                    returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
                }
            }
            return returnAge;//返回周岁年龄
        },

        turnToHTML: function ( str ) {
            return str.replace(/\r\n|\n|\r/g, '<br>').replace(/\s/g, '&nbsp;');
        },

        deleteSpace: function ( str ) {
            return str.replace(/\s/g, '');
        }

    };

    _Z. StringTool = {

        isNull: function(str){
            var result = null;
            if(str === undefined || str === null){
                result = true;
            } else {
                result = false;
            }
            return result;
        },

        isStringEmpty: function(str){
            if(str === undefined || str === null || str === ""){
                return true;
            }
            return false;
        },

        replaceAll: function(s1, s2){
            var finish = false;
            var resultStr = this.replace(s1,s2);
            while(!finish){
                if(resultStr.indexOf(s1) > 0){
                    resultStr = resultStr.replace(s1 , s2);
                }else{
                    finish = true;
                }
            }
            return resultStr;
        },

        dateReplace : function (s) {
            return s.replace(/\//, '-');
        }
    };

    $.scrollto = function( position, time ){
        $('html, body').animate({
            scrollTop: $(position).offset().top
        }, time);
    };

    /**
     * 校验器
     */
    _Z. Checker = {

        number: 'number',

        isContains: function( str, substr ){
            return str.indexOf(substr) >= 0;
        },

        require: function( str ) {
            if(_Z.StringTool.isStringEmpty(str))
                return false;
            return true;
        },

        isEmpty: function( obj ) {
            if( typeof obj === 'undefined' ){
                return true;
            }
            if( Array.isArray( obj ) ) {
                return obj.length === 0;
            }
            if ( typeof obj === "object" && !( Array.isArray( obj ) ) ){
                var prop, hasProp = false;
                for ( prop in obj ) {
                    hasProp = true;
                    break;
                }
                return !hasProp;
            }
            if ( typeof obj === 'string' ){
                return  _Z.StringTool.isStringEmpty( obj );
            }
        },

        isEmptyForm: function ( form, btn ){
            if ( !form || form.length !== 1 ) return null;

            var empty = false,
                $input = form.find('input[type=\'text\'], input[type=\'hidden\'], input[type=\'password\'], input[type=\'number\'], textarea'),
                $radio = form.find('input[type=\'radio\']'),
                $select = form.find('select'),
                $checkbox = form.find('input[type=\'checkbox\']');

            function splitInput ( $radio ) {
                var splitRadio = [];
                $radio.each(function () {
                    splitRadio.push(this.name);
                });
                $.unique(splitRadio);
                return splitRadio.length;
            }

            $input.each(function () {
                if ( _Z.StringTool.isStringEmpty(this.value) ) {
                    empty = true;
                    return false;
                }
            });

            if( empty ){
                return btn ? btn.addClass('disabled') : empty;
            }
            if ( $select.length !== 0 ) {
                if ( form.find('select option:selected').length < splitInput( $select ) ) {
                    return btn ? btn.addClass('disabled') : true;
                }
            }
            if ( $radio.length !== 0 ) {
                if ( form.find('input[type=\'radio\']:checked').length < splitInput( $radio ) ) {
                    return btn ? btn.addClass('disabled') : true;
                }
            }
            if ( $checkbox.length !== 0 ) {
                if ( form.find('input[type=\'checkbox\']:checked').length < splitInput( $checkbox ) ) {
                    return btn ? btn.addClass('disabled') : true;
                }
            }

            return btn ? btn.removeClass('disabled') : false;
        },

        isEmptyInputForm: function ( form, textarea ){
            if ( !form || form.length !== 1 ) return null;
            var input = [];
            if ( textarea ) {
                form.find('input,textarea').each(function () {
                    if( !this.value.trim() ){
                        input = $(this);
                        return false;
                    }
                });
            } else {
                form.find('input').each(function () {
                    if( !this.value.trim() ){
                        input = $(this);
                        return false;
                    }
                });
            }

            return input;
        },

        hasProperty: function(obj, prop){
            if( typeof (obj) !== 'object' )
                return false;
            return obj.hasOwnProperty(prop);
        },

        isNumber: function(str){
            var num = Number(str);
            if(num === NaN){
                return false;
            } else {
                return true;
            }
        },

        notNumber: function(str){
            var num = Number(str);
            if(num === NaN){
                return true;
            } else {
                return false;
            }
        },

        isEmail: function(str){
            var regExp = new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/);
            return regExp.test(str);
        },

        isHomePhone: function(str){
            var checkPhone = /^0\d{2,3}-?\d{7,8}$/;
            return checkPhone.test(str);
        },

        isPostCode: function(str){
            var checkPostCode= /^[1-9][0-9]{5}$/;
            return checkPostCode.test(str)
        },

        isPlateNo: function(str, input, btn) {
            var reg5 = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/;
            var reg6 = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{6}$/;
            if ( !input ) {
                return reg5.test(str) || reg6.test(str)
            }
            _Z.Format.validFormat( ( reg5.test(str) || reg6.test(str) ), input, btn );
        },

        isCertNum: function(str) {
            var reg = new RegExp(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/);
            return reg.test(str);
        },

        isNotCertNum: function(str) {
            return !_Z.Checker.isCertNum(str);
        },

        isMobile_17: function (str, input, btn) {
            if ( !str ) return false;
            var regExp = new RegExp(/^(((13[0-9]{1})|(15[0-35-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
            var test = regExp.test(str);
            if ( !input ){
                return test;
            }
            _Z.Format.validFormat(test, input, btn);
        },

        /**
         * 开始时间与结束时间判断
         * @param startTime 开始时间
         * @param endTime  结束时间
         * @returns {boolean} startTime 早于 endTime 返回 true,否则返回false
         */
        isStartTimeEarlier: function(startTime, endTime){
            var start=new Date(startTime.replace("-", "/").replace("-", "/"));
            var end=new Date(endTime.replace("-", "/").replace("-", "/"));
            if( start.getTime() < end.getTime() ){
                return true;
            }else{
                return false;
            }
        }

    };

    _Z. Storage = {
        clearInputStorage: function ($input) {
            $input.each(function () {
                var name = this.name;
                localStorage.removeItem(name);
            });
        }

    };


    /**
     * < content > static data for the application
     *
     * < docType > json
     */
    _Z.static = {


    };

    var Z = {};
    // conform all the child nodes of child nodes to child nodes;
    _Z. extend = function () {
        var s, sType;
        for ( s in this ) {
            if ( _Z .Checker .hasProperty( Z, s ) ) {
                throw 'The key name \' ' + s + ' \' has been occupied!';
            }
            // load the static data
            if ( s === 'static' ) {
                Z[ s ] = this[ s ];
                continue;
            }
            sType = typeof this[ s ];
            switch ( sType ) {
                case 'function':
                    Z[ s ] = this[ s ];
                    break;
                case 'object':
                    _Z.extend.call( this[ s ] );
                    break;
                default:
            }
        }
    };

    _Z.extend.call( _Z );

    win .Z  =  Z;

})(window, jQuery);


/**
 *
 * 日历组件
 */
var datePicker = (function () {
    var Calenders = function (el, option ) {
        this.opts = option;
        this.el = el;
    };

    Calenders.prototype.init = function () {
        var opts = this.opts,
            $1 = opts.year - 1,
            $2 = $1 + 11;
        this.loadHtml();
        this.loadYearList( $1, $2 );
        this.bindEvent();
    };

    Calenders.prototype.loadHtml = function () {
        var _this = this,
            file = _this.opts.load,
            el = _this.el,
            path = '/' + file + '.html',
            content = window['cache_'+file];
        var render = function ( f, h ) {
            el.html( Z.TEEval( h, {} ) );
            var $now = el.find('.until-today');
            _this.opts.toNow ? $now.show() : $now.hide();
        };
        if ( content ) {
            render( file, content );
            return;
        }
        $.ajax({
            url : path,
            type : 'GET',
            dataType : 'text',
            async: false,
            success : function ( html ) {
                render( file, html );
                window['cache_'+file] = html;
            }
        });
    };

    Calenders.prototype.bindEvent = function () {
        var _this = this;
        this.el.off().on("click",".this_leftTen",function(e) {
            // 十年加减
            var type=0;
            _this.loadYearTitle(type)
        }).on("click",".this_rightTen",function(e) {
            var type=1;
            _this.loadYearTitle(type);
        }).on("click",".ylist li",function (e) {
            //点击年份list
            var thisHtml = $(this).html();
            $(".tenYears").html(thisHtml);
            $(".YlistBox").hide();
            $(".MlistBox").show();
            $(".this_left").removeClass("this_leftTen").addClass("this_leftOne");
            $(".this_right").removeClass("this_rightTen").addClass("this_rightOne");
            $(".tenYears").addClass("backYears");
        }).on("click",".backYears",function(e) {
            //点击年title
            var $year = $(".tenYears"),
                year = $year.html() - 0,
                backYearsOne = year - 1,
                backYearsTwo = year + 10;
            $year.removeClass("backYears").html('<span class="firstYears">'+backYearsOne+'</span>-<span class="nestYears">'+backYearsTwo+'</span>');
            $(".this_left").addClass("this_leftTen").removeClass("this_leftOne");
            $(".this_right").addClass("this_rightTen").removeClass("this_rightOne");
            _this.loadYearList( backYearsOne, backYearsTwo );//年份list
        }).on("click",".this_leftOne",function(e) {
            //一年减
            var $year = $(".tenYears"),
                year = $year.html() - 0,
                back = year - 1;
            $year.html( back );
        }).on("click",".this_rightOne",function(e) {
            //一年加
            var $year = $(".tenYears"),
                year = $year.html() - 0,
                forward = year + 1;
            $year.html( forward );
        });

        //点击月份
        // this.el.on("click",".mlist li",function() {
        //     var thisYue=$(this).html();
        //     var thisNian=$(".backYears").html();
        //     alert(thisNian+'-'+thisYue)
        // });
    };

    // 头部年份生成
    Calenders.prototype.loadYearTitle = function (type) {
        var yearsOne, yearsTwo,
            first = $(".firstYears").html() - 0,
            last= $(".nestYears").html() - 0;
        if(type === 0){
            yearsOne = first - 12;
            yearsTwo = last - 12;
        }else{
            yearsOne = first + 12;
            yearsTwo = last + 12;
        }
        this.loadYearList( yearsOne, yearsTwo );
    };

    // 年份html生成
    Calenders.prototype.loadYearList = function ( first, last ) {
        $(".firstYears").html( first );
        $(".nestYears").html( last );
        var yearsHtml="";
        for(var i = first; i <= last; i++){
            yearsHtml+='<li>'+i+'</li>';
        }
        $(".ylist").html(yearsHtml);
        $(".YlistBox").show();
        $(".MlistBox").hide();
    };

    var defaults = {
        year: new Date().getFullYear(),
        load: 'datepicker',
        toNow: false
    };

    return {
        init: function( el, options ){
            options = $.extend({}, defaults, options);
            new Calenders( el, options ).init();
        }
    }

})();


// 编辑简历整体样式
var getEditShowMode = function (data) {
    var i;
    // 各模块样式 及动态绑定事件
    for ( i in data ) {
        var item = $('div.' + i);

        // 个人评价模块的展示样式
        if( i === 'resume' ) {
            data[i].introduct ? showMode(item) : noDataMode(item);
            continue;
        }
        if ( item.length > 0 ) {
            if ( !Z.isEmpty(data[i]) ) {
                showMode(item);
            } else {
                noDataMode(item);
            }
        }
    }
    // 百分比展示
    $('.percent span').css('width', data.resume.percent + '%');
};

// 获取各模块数据
var getData = function (file) {
    var path = '/' + file+ '.html',
        container = $('#' + file),
        url = container.data('url');
    $.ajax({
        url : path,
        type : 'GET',
        dataType : 'text',
        async: false,
        success : function ( html ) {
            Z.post(url, Z.formGetData(), function (res) {
                // 拿着文件加载出的内容 再请求了数据渲染
                container.html( Z.TEEval( html, res.data ? res.data : [] ) );
                var item = container.find('.item');
                if( Z.isEmpty( res.data )){
                    // show mode
                    noDataMode(item);
                } else {
                    showMode(item);
                }
                // 更新简历百分比
                getPercent();

                // 隐藏或显示导入按钮
                isHaveImportCourse();
            });
        }
    });
};

// 判断是否有导入的课程 以隐藏或显示导入按钮
var isHaveImportCourse = function () {
    Z.post('/resume/train/duia/experience', Z.formGetData(), function ( resp ) {
        if( !resp.data ) {
            $('.resumeTrainExperiences').find('.import').hide();
        }
    });
};

var getCount = function (textarea ) {
    if (textarea.length > 0  ) {
        var len = textarea.val().length,
            require = textarea.attr('maxlength');
        textarea.siblings('span.count').text( len + '/' + require);
    }
};

var getPercent = function () {
    Z.post('/resume/complete/percent', Z.formGetData(), function (res) {
        if (res.data) {
            $('.percent span').css('width', res.data + '%');
            $('.percent-number').html( res.data + '%' );
        }
    });
};

var editMode = function ( con ) {
    con.removeClass("conInfo").removeClass("noData").addClass("compile");
};

var showMode = function ( con ) {
    con.removeClass("compile").removeClass("noData").addClass("conInfo");
};

var noDataMode = function ( con ) {
    con.removeClass("conInfo").removeClass("compile").addClass("noData");
};

var clearMode = function ( con ) {
    con.removeClass("conInfo").removeClass("compile").removeClass("noData");
};

var hideItem = function ( con ) {
    con.addClass('hide-item');
};

var hideEditBtn = function (unit) {
    hideItem( unit.find( $('.funs') ) );
    hideItem( unit.find( $('.fun') ) );
    hideItem( unit.find( $('.kong') ) );
};

var showEditBtn = function ( unit ) {
    showItem( unit.find( $('.funs') ) );
    showItem( unit.find( $('.fun') ) );
    showItem( unit.find( $('.kong') ) );
};

var showItem = function ( con ) {
    con.removeClass('hide-item');
};

var isStartTimeEarlier = function ( $edit ) {
    // 校验结束时间应大于开始时间
    var start, end, endInput, inputs = $edit.find('input');
    inputs.each(function () {
        if(this.name === 'startDateStr') {
            if ( !this.value ) return false;
            start = new Date( this.value );
        }
        if(this.name === 'endDateStr') {
            if ( !this.value ) return false;
            if ( this.value === 'now' ) {
                return false;
            }
            end = new Date( this.value );
            endInput = $(this);
        }
    });
    var time = end - start;
    if ( time < 0 ) {
        endInput.siblings('.carry-input').css("border-color","#FB3232").siblings('em').css('width','155px').html('结束时间须大于起始时间').show();
        return false;
    }
    return true;
};



// 校验输入框是否为空 并给出样式
var checkJL = function ($this){
    var error = Z.static.errorEM, carry, dropDown,
        i, obj = $this.parent(),
        $errInfo = obj.find('.errorInfo');

    if ( $this.attr('name') === 'id' ) return;

    for ( i in error ) {
        var name =  obj.attr('class');
        // 执行样式
        if( Z.isContains( name, i ) ) {
            var val = $this.val().trim(),
                require;
            // 剥离条件与逻辑 代码可分离
            if ( Z.isContains( name, 'telPhone' ) ) {
                require = Z.isMobile_17( val );
            } else if ( Z.isContains( name, 'eMail' ) ) {
                require = Z.isEmail( val );
            } else {
                require = val;
            }
            if( !require ) {
                $errInfo.show().html( error[i] );
                if ( $this.attr('type') === 'hidden' ) {
                    carry = $this.siblings('.carry-input'),
                    dropDown = $this.parents('.dropDown');
                    if ( dropDown.length > 0 ) {
                        dropDown.css("border-color","#FB3232");
                    }
                    else if ( carry.length > 0 ) {
                        carry.css("border-color","#FB3232");
                    }
                } else {
                    $this.css("border-color","#FB3232");
                }
            } else {
                $errInfo.hide();
                $this.removeAttr("style");
            }
            break;
        }
    }

};