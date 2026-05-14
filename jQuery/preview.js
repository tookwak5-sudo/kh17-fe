//멀티페이지 구현을 수행하는 라이브러리 (jQuery 의존성이 존재 : jQuery라이브러리 - 반드시 불러온 jQuery 밑에다가 불러오기)

 //이미지 미리보기 처리 (개수 무관)
$(function(){
    $(".preview-input").on("input", function(){

        //미리보기를 생성하기 전에 기전에 .preview-area에 있는 이미지를 제거
        // - 있을지 없을지 모르며 있다면 URL.revokeObjectURL()을 써서 회수까지 해줘야함

        //jquery에서 제공하는 반복함수 each를 사용  (for보다 편함)
        $(".preview-area").find("img").each(function(){
            //this = 현재 순서의 이미지
            //이미지 주소 회수 + 이미지 태그 삭제 (or 영역 비우기)
            var address = $(this).attr("src"); //기존 src가져와서
            URL.revokeObjectURL(address); //자원 회수까지
            $(this).remove(); // 태그 삭제

        });
        $(".preview-area").empty(); //영역 비우기

        if(this.files.length > 0){ //파일선택
            for(var i = 0; i < this.files.length; i++){ //이미지 개수만큼 이미지를 만들어서
                //이미지를 만들어서 .preview-area에 추가
                var img = $("<img>")
                            .addClass("image-shadow", "image-circle")
                            .attr("src", URL.createObjectURL(this.files[i]))
                            .prop("height", 100); 
                $(".preview-area").append(img);
                //.preview-area에 추가
            }
        }
    });
});