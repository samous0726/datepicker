var calenders = (function (doc) {
    var $doc = $(doc);
    var currentYear = new Date().getFullYear(),
        firstYear = currentYear - 1,
        nextYear = currentYear + 10;
    //年份初始化
    yearHtml(firstYear,nextYear);
    //十年减
    $doc.on("click",".this_leftTen",function() {
        var type=0;
        yesrs(type)
    });
    //十年加
    $doc.on("click",".this_rightTen",function() {
        var type=1;
        yesrs(type);
    });
    //点击年份list
    $doc.on("click",".ylist li",function () {
        var thisHtml=$(this).html();
        $(".tenYears").html(thisHtml);
        $(".YlistBox").hide();
        $(".MlistBox").show();
        $(".this_left").removeClass("this_leftTen").addClass("this_leftOne");
        $(".this_right").removeClass("this_rightTen").addClass("this_rightOne");
        $(".tenYears").addClass("backYears");
    });
    //点击年title
    $doc.on("click",".backYears",function() {
        var backYearsOne=Number($(".tenYears").html())-1;
        var backYearsTwo=Number($(".tenYears").html())+10;
        $(".tenYears").removeClass("backYears").html('<span class="firstYears">'+backYearsOne+'</span>-<span class="nestYears">'+backYearsTwo+'</span>');
        $(".this_left").addClass("this_leftTen").removeClass("this_leftOne");
        $(".this_right").addClass("this_rightTen").removeClass("this_rightOne");
        yearHtml(backYearsOne,backYearsTwo);//年份list
    });

    //一年减
    $doc.on("click",".this_leftOne",function() {
        var yiYears=Number($(".tenYears").html())-1;
        $(".tenYears").html(yiYears);
    });
    //一年加
    $doc.on("click",".this_rightOne",function() {
        var yiYears=Number($(".tenYears").html())+1;
        $(".tenYears").html(yiYears);
    });
    // //点击月份
    // $(document).on("click",".mlist li",function() {
    //     var thisYue=$(this).html();
    //     var thisNian=$(".backYears").html();
    //     alert(thisNian+'-'+thisYue)
    // });
    // 头部年份生成
    function yesrs(type) {
        var yearsOne="";
        var yearsTwo="";
        if(type==0){
            yearsOne=Number($(".firstYears").html())-12;
            yearsTwo=Number($(".nestYears").html())-12;
        }else{
            yearsOne=Number($(".firstYears").html())+12;
            yearsTwo=Number($(".nestYears").html())+12;
        }
        yearHtml(yearsOne,yearsTwo);
    };
    //		年份html生成
    function yearHtml(oneYears,twoYears) {
        $(".firstYears").html(oneYears );
        $(".nestYears").html(twoYears );
        var yearsHtml="";
        for(var i=oneYears;i<=twoYears;i++){
            yearsHtml+='<li>'+i+'</li>';
        }
        $(".ylist").html(yearsHtml);
        $(".YlistBox").show();
        $(".MlistBox").hide();
    };

})(document);