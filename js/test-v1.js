$(function() {

    $(".j-obbox").jBox({
        minWidth:500,
        mingHeight:300,
        onOpen: function(element) {
            $("#testhide").one("click", function() {
                $.jBox.close(element);
            });
        }
    });


    $("#btn3").click(function(){
        $("#box3").jBox();
    });

    $("#btn4").click(function(){
        $.jBox.show({
            title:"asd",
            content:'<input type="text" />'
        });
    });

});