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