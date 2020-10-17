function buttonClicked() {
    var userInput = document.getElementById("userInput").value;
    var temp = document.getElementsByClassName("standards");
    if (userInput > 29 && userInput < 101) {
        magicSquare(userInput);
        for (var i = 0; i < temp.length; i++) { temp[i].style.visibility = "visible"; }
        document.getElementById("var1").style.visibility = "visible";
        document.getElementById("var2").style.visibility = "visible";
        document.getElementById("var3").style.visibility = "visible";
        document.getElementById("var4").style.visibility = "visible";
    } else {
        alert("Please input a number between 30 and 100");
        for (var i = 0; i < temp.length; i++) { temp[i].style.visibility = "hidden"; }
        document.getElementById("var1").style.visibility = "hidden";
        document.getElementById("var2").style.visibility = "hidden";
        document.getElementById("var3").style.visibility = "hidden";
        document.getElementById("var4").style.visibility = "hidden";
    }
}
function buttonClear() {
    var temp = document.getElementsByClassName("standards");
    for (var i = 0; i < temp.length; i++) { temp[i].style.visibility = "hidden"; }
    document.getElementById("var1").style.visibility = "hidden";
    document.getElementById("var2").style.visibility = "hidden";        
    document.getElementById("var3").style.visibility = "hidden";
    document.getElementById("var4").style.visibility = "hidden";
}
function magicSquare(numInput) {
    var magicNum = numInput - 20;
    document.getElementById("var1").innerHTML = magicNum;
    document.getElementById("var2").innerHTML = magicNum - 1;
    document.getElementById("var3").innerHTML = magicNum + 2;
    document.getElementById("var4").innerHTML = magicNum + 1;
}