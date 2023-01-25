// Box width
var bw = 500;
// Box height
var bh = 500;
// Padding
var p = 10;

function drawBoard(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    for (var x = 0; x <= bw; x += 50) {
        ctx.moveTo(0.5 + x + p, p);
        ctx.lineTo(0.5 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += 50) {
        ctx.moveTo(p, 0.5 + x + p);
        ctx.lineTo(bw + p, 0.5 + x + p);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.strokeStyle = "red";
    ctx.moveTo(0.5, 0.5);
    ctx.lineTo(0.5, 520);
    ctx.lineTo(520, 520);
    ctx.lineTo(520, 0.5);
    ctx.lineTo(0.5, 0.5);


    ctx.stroke();

}
