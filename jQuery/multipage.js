//멀티페이지 구현을 수행하는 라이브러리 (jQuery 의존성이 존재 : jQuery라이브러리 - 반드시 불러온 jQuery 밑에다가 불러오기)

 $(function(){
            //[1] 1페이지 빼고 다 숨기기   
            $(".page").hide().first().show(); 
            calculateGauge();

            //[2] 다음버튼을 누르면 현재 페이지를 숨기고 다음 페이지를 보여주기
            $(".btn-next").on("click", function(){ 
                $(this).closest(".page").hide().next().show(); //가장 가까운 페이지
                calculateGauge();
            });
            //[3] 이전버튼을 누르면 현재 페이지를 숨기고 이전 페이지를 보여주기
            $(".btn-prev").on("click", function(){
                $(this).closest(".page").hide().prev().show();
                calculateGauge();
            })
            //progressbar 처리;
            //[1]처음에 .gauge의 폭을 설정
            // $(".progressbar > .gauge").css("width", "20%");
            // $(".progressbar").find(".gauge").css("width", 100 / $(".page").length + "%");
            //(+추가) 보여지는 페이지의 위치를 계산
            function calculateGauge(){
                if($(".progressbar").length == 0) return;
                var current = $(".page:visible");
                var page = $(".page").index(current) + 1;
                var percent = page * 100 / $(".page").length;
                $(".progressbar").find(".gauge").css("width", percent + "%");
            }
        });